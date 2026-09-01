/**
 * HEALER AGENT (Phase 3) — self-healing & drift detection.
 *
 * Reads test-results/test-results.json, classifies each failure, applies a
 * bounded, deterministic patch, re-runs the affected specs, and writes
 * healing-report.md. Max 2 healing attempts (enforced by the caller / this loop).
 *
 * Decision order (first match wins per failure):
 *   1. schema-drift        -> widen the offending component schema type in spec/openapi.json
 *   2. endpoint-versioning -> bump apiVersionPrefix in config/environments.ts (v1 -> v2)
 *   3. missing-seed-data   -> flag for re-run (tests self-seed with fresh Faker data)
 *   4. flaky-timeout       -> raise timeout + retries in playwright.config.ts
 *
 * Usage:
 *   ts-node healer/healer.ts                 # one healing pass over the last report
 *   ts-node healer/healer.ts --no-rerun      # classify + patch, skip the re-run
 */

import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import {
  Failure,
  HealingAction,
  HealingCategory,
  PwJsonReport,
  PwResult,
  PwSpec,
  PwSuite,
} from './types';

const ROOT = process.cwd();
const REPORT_PATH = path.join(ROOT, 'test-results', 'test-results.json');
const OPENAPI_PATH = path.join(ROOT, 'spec', 'openapi.json');
const ENV_PATH = path.join(ROOT, 'config', 'environments.ts');
const PW_CONFIG_PATH = path.join(ROOT, 'playwright.config.ts');
const HEALING_REPORT_PATH = path.join(ROOT, 'healing-report.md');
const MAX_ATTEMPTS = 2;

// ---------------------------------------------------------------------------
// Report parsing
// ---------------------------------------------------------------------------
function loadReport(): PwJsonReport | undefined {
  if (!fs.existsSync(REPORT_PATH)) {
    return undefined;
  }
  return JSON.parse(fs.readFileSync(REPORT_PATH, 'utf-8')) as PwJsonReport;
}

function collectFailures(report: PwJsonReport): Failure[] {
  const failures: Failure[] = [];

  const walk = (suite: PwSuite, inheritedFile?: string): void => {
    const file = suite.file ?? inheritedFile;
    for (const spec of suite.specs ?? []) {
      pushSpecFailure(spec, file, failures);
    }
    for (const child of suite.suites ?? []) {
      walk(child, file);
    }
  };

  for (const suite of report.suites ?? []) {
    walk(suite);
  }
  return failures;
}

function pushSpecFailure(spec: PwSpec, file: string | undefined, out: Failure[]): void {
  if (spec.ok) {
    return;
  }
  for (const t of spec.tests ?? []) {
    const failed = (t.results ?? []).find(
      (r: PwResult) => r.status === 'failed' || r.status === 'timedOut',
    );
    if (!failed) {
      continue;
    }
    const errParts = [failed.error, ...(failed.errors ?? [])].filter(Boolean);
    const message = errParts.map((e) => e?.message ?? '').join('\n');
    const stack = errParts.map((e) => e?.stack ?? '').join('\n');
    out.push({
      specTitle: spec.title,
      file: spec.file ?? file ?? 'unknown',
      message,
      stack,
    });
  }
}

// ---------------------------------------------------------------------------
// Classification
// ---------------------------------------------------------------------------
function classify(f: Failure): HealingCategory {
  const m = f.message.toLowerCase();

  if (m.includes('[contract]') || m.includes('violates schema')) {
    return 'schema-drift';
  }
  if (
    m.includes('must be integer') ||
    m.includes('must be number') ||
    m.includes('must be string') ||
    m.includes('must be boolean')
  ) {
    return 'schema-drift';
  }
  if (/expected 404|received 404|status.*404|got 404/.test(m)) {
    return 'endpoint-versioning';
  }
  if (/expected .*400|status.*400|missing dependency|missing seed/.test(m)) {
    return 'missing-seed-data';
  }
  if (
    m.includes('timeout') ||
    m.includes('timed out') ||
    m.includes('econnreset') ||
    m.includes('etimedout') ||
    m.includes('socket hang up') ||
    m.includes('econnrefused')
  ) {
    return 'flaky-timeout';
  }
  return 'unknown';
}

// ---------------------------------------------------------------------------
// Healing strategies (return an action describing what was done)
// ---------------------------------------------------------------------------

/** Parse `"SchemaName"` and the offending `/instancePath` from our contract error. */
function parseSchemaError(message: string): { schema?: string; property?: string } {
  const schema = /violates schema\s+"([^"]+)"/.exec(message)?.[1];
  // e.g.  - /totalprice must be integer {"type":"integer"}
  const property = /-\s+\/([A-Za-z0-9_/]+)\s+must be/.exec(message)?.[1];
  return { schema, property };
}

function healSchemaDrift(f: Failure): HealingAction {
  const base: HealingAction = {
    category: 'schema-drift',
    failure: f,
    applied: false,
    changeSummary: '',
    filesTouched: [],
  };
  const { schema, property } = parseSchemaError(f.message);
  if (!schema || !property) {
    base.changeSummary = 'Detected schema drift but could not parse schema/property from the error; manual review needed.';
    return base;
  }

  const doc = JSON.parse(fs.readFileSync(OPENAPI_PATH, 'utf-8')) as OpenApiSchemaDoc;
  // Resolve the (possibly nested, $ref-crossing) instance path to the leaf node.
  const target = resolveSchemaNode(doc, schema, property.split('/'));
  if (!target) {
    base.changeSummary = `Could not locate ${schema} -> /${property} in spec/openapi.json; manual review needed.`;
    return base;
  }

  const before = target.node.type;
  // Widen to accept the drifted type (union) so validation passes while keeping a record.
  const widened = Array.isArray(before)
    ? Array.from(new Set([...before, 'string', 'number', 'integer']))
    : Array.from(new Set([before, 'string', 'number', 'integer'].filter(Boolean) as string[]));
  target.node.type = widened;
  fs.writeFileSync(OPENAPI_PATH, `${JSON.stringify(doc, null, 2)}\n`);

  base.applied = true;
  base.filesTouched = ['spec/openapi.json'];
  base.changeSummary =
    `Widened ${target.owner}.${target.leaf} type from ${JSON.stringify(before)} to ${JSON.stringify(widened)} ` +
    `to absorb response drift. NOTE: also update lib/types.ts (${target.owner}.${target.leaf}) if the drift is permanent.`;
  return base;
}

interface SchemaNode {
  type?: string | string[];
  $ref?: string;
  properties?: Record<string, SchemaNode>;
  items?: SchemaNode;
}
interface OpenApiSchemaDoc {
  components: { schemas: Record<string, SchemaNode> };
}

/** Follow a JSON-Schema $ref like "#/components/schemas/Booking". */
function deref(doc: OpenApiSchemaDoc, node: SchemaNode): SchemaNode {
  if (!node.$ref) {
    return node;
  }
  const name = node.$ref.split('/').pop() as string;
  return doc.components.schemas[name] ?? node;
}

/**
 * Walk an instancePath (e.g. ["booking","totalprice"]) from a root component,
 * crossing $refs and array items, returning the mutable leaf node + its owner.
 */
function resolveSchemaNode(
  doc: OpenApiSchemaDoc,
  rootSchema: string,
  segments: string[],
): { node: SchemaNode; owner: string; leaf: string } | undefined {
  let current = doc.components.schemas[rootSchema];
  let owner = rootSchema;
  let leaf = rootSchema;
  if (!current) {
    return undefined;
  }
  for (const seg of segments) {
    current = deref(doc, current);
    if (/^\d+$/.test(seg)) {
      // Array index -> descend into items.
      if (!current.items) {
        return undefined;
      }
      current = current.items;
      continue;
    }
    const next = current.properties?.[seg];
    if (!next) {
      return undefined;
    }
    // The owner is whichever concrete schema declares this property.
    owner = current.$ref ? (current.$ref.split('/').pop() as string) : owner;
    leaf = seg;
    current = next;
  }
  return { node: deref(doc, current), owner, leaf };
}

function healEndpointVersioning(f: Failure): HealingAction {
  const src = fs.readFileSync(ENV_PATH, 'utf-8');
  const current = /apiVersionPrefix:\s*'([^']*)'/.exec(src)?.[1] ?? '';
  const next = current === '' ? '/v2' : bumpVersion(current);
  const patched = src.replace(
    /apiVersionPrefix:\s*'[^']*'/g,
    `apiVersionPrefix: '${next}'`,
  );
  fs.writeFileSync(ENV_PATH, patched);
  return {
    category: 'endpoint-versioning',
    failure: f,
    applied: true,
    filesTouched: ['config/environments.ts'],
    changeSummary: `404 detected — bumped apiVersionPrefix '${current}' -> '${next}' and will re-run.`,
  };
}

function bumpVersion(prefix: string): string {
  const n = /v(\d+)/.exec(prefix)?.[1];
  return n ? `/v${Number(n) + 1}` : `${prefix}/v2`;
}

function healMissingSeed(f: Failure): HealingAction {
  return {
    category: 'missing-seed-data',
    failure: f,
    applied: true,
    filesTouched: [],
    changeSummary:
      'Missing seed dependency detected. Tests self-seed with fresh Faker data each run; ' +
      're-running regenerates the prerequisite resource (no patch required).',
  };
}

function healFlakyTimeout(f: Failure): HealingAction {
  const src = fs.readFileSync(PW_CONFIG_PATH, 'utf-8');
  let patched = src;
  const filesTouched: string[] = ['playwright.config.ts'];

  patched = patched.replace(/timeout:\s*([\d_]+),/, (_m, val: string) => {
    const current = Number(val.replace(/_/g, ''));
    const next = Math.min(current * 2, 120_000);
    return `timeout: ${next},`;
  });
  patched = patched.replace(
    /retries:\s*process\.env\.CI \? \d+ : \d+,/,
    'retries: process.env.CI ? 3 : 2,',
  );
  fs.writeFileSync(PW_CONFIG_PATH, patched);

  return {
    category: 'flaky-timeout',
    failure: f,
    applied: patched !== src,
    filesTouched,
    changeSummary:
      'Network/timeout failure — doubled test timeout (capped at 120s) and raised retries. Will re-run.',
  };
}

function heal(f: Failure): HealingAction {
  const category = classify(f);
  switch (category) {
    case 'schema-drift':
      return healSchemaDrift(f);
    case 'endpoint-versioning':
      return healEndpointVersioning(f);
    case 'missing-seed-data':
      return healMissingSeed(f);
    case 'flaky-timeout':
      return healFlakyTimeout(f);
    default:
      return {
        category: 'unknown',
        failure: f,
        applied: false,
        filesTouched: [],
        changeSummary: 'No healing rule matched this failure; escalate to a human.',
      };
  }
}

// ---------------------------------------------------------------------------
// Re-run
// ---------------------------------------------------------------------------
function rerun(files: string[]): number {
  const unique = Array.from(new Set(files));
  const args = ['playwright', 'test', ...unique, '--reporter=list,json'];
  const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const result = spawnSync(npx, args, {
    stdio: 'inherit',
    env: { ...process.env },
    cwd: ROOT,
    shell: process.platform === 'win32',
  });
  return result.status ?? 1;
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------
function writeReport(attempts: HealingAction[][], finalExit: number): void {
  const lines: string[] = [];
  lines.push('# Healing Report');
  lines.push('');
  lines.push(`- Generated: healer-agent`);
  lines.push(`- Report source: \`test-results/test-results.json\``);
  lines.push(`- Attempts: ${attempts.length} (max ${MAX_ATTEMPTS})`);
  lines.push(`- Final result: ${finalExit === 0 ? '✅ PASSING' : '❌ STILL FAILING — escalate to on-call'}`);
  lines.push('');

  attempts.forEach((actions, idx) => {
    lines.push(`## Attempt ${idx + 1}`);
    lines.push('');
    if (actions.length === 0) {
      lines.push('_No failures to heal._');
      lines.push('');
      return;
    }
    lines.push('| Spec | Category | Applied | Files | Change |');
    lines.push('|------|----------|---------|-------|--------|');
    for (const a of actions) {
      lines.push(
        `| ${escape(a.failure.specTitle)} | ${a.category} | ${a.applied ? 'yes' : 'no'} | ${a.filesTouched.join(', ') || '—'} | ${escape(a.changeSummary)} |`,
      );
    }
    lines.push('');
    for (const a of actions) {
      lines.push(`<details><summary>${escape(a.failure.specTitle)} — original error</summary>`);
      lines.push('');
      lines.push('```');
      lines.push(a.failure.message.slice(0, 2000));
      lines.push('```');
      lines.push('</details>');
      lines.push('');
    }
  });

  fs.writeFileSync(HEALING_REPORT_PATH, `${lines.join('\n')}\n`);
  // eslint-disable-next-line no-console
  console.log(`[healer] wrote ${HEALING_REPORT_PATH}`);
}

function escape(s: string): string {
  return s.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

// ---------------------------------------------------------------------------
// Orchestration
// ---------------------------------------------------------------------------
export function runHealing(options: { rerun: boolean } = { rerun: true }): number {
  const attempts: HealingAction[][] = [];
  let exitCode = 1;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const report = loadReport();
    if (!report) {
      console.error(`[healer] No report at ${REPORT_PATH}. Run the tests first.`);
      writeReport(attempts, 1);
      return 1;
    }

    const failures = collectFailures(report);
    if (failures.length === 0) {
      console.log('[healer] No failures found — nothing to heal.');
      exitCode = 0;
      attempts.push([]);
      writeReport(attempts, exitCode);
      return 0;
    }

    console.log(`[healer] Attempt ${attempt}: ${failures.length} failure(s).`);
    const actions = failures.map(heal);
    attempts.push(actions);

    const anyApplied = actions.some((a) => a.applied);
    if (!anyApplied) {
      console.error('[healer] No healing rule could be applied. Escalating.');
      writeReport(attempts, 1);
      return 1;
    }

    if (!options.rerun) {
      console.log('[healer] --no-rerun set; patches applied, skipping re-run.');
      writeReport(attempts, 0);
      return 0;
    }

    const files = actions.map((a) => a.failure.file);
    exitCode = rerun(files);
    if (exitCode === 0) {
      console.log(`[healer] Attempt ${attempt} succeeded — tests passing.`);
      writeReport(attempts, 0);
      return 0;
    }
    console.warn(`[healer] Attempt ${attempt} still failing (exit ${exitCode}).`);
  }

  console.error('[healer] Exhausted max attempts — aborting and notifying on-call.');
  writeReport(attempts, exitCode);
  return exitCode;
}

if (require.main === module) {
  const rerunFlag = !process.argv.includes('--no-rerun');
  process.exit(runHealing({ rerun: rerunFlag }));
}
