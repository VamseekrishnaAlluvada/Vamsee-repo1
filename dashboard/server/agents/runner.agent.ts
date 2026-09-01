/**
 * RunnerAgent — executes the generated spec via Playwright, then parses the
 * JSON report to produce structured test-case records (status, duration,
 * retries, assertion outcomes) for the Reporter.
 */

import fs from 'node:fs';
import path from 'node:path';
import { Agent, AgentContext, GeneratorOutput, RunnerOutput } from './types';
import { NPX, spawnInFramework } from './process';
import type { CustomApi, GeneratedAssertion, GeneratedTestCase, TestStatus } from '../../src/types';

interface PwResult {
  status: string;
  duration: number;
  error?: { message?: string };
}
interface PwTest {
  results: PwResult[];
}
interface PwSpec {
  title: string;
  ok: boolean;
  file?: string;
  tests: PwTest[];
}
interface PwSuite {
  title: string;
  file?: string;
  suites?: PwSuite[];
  specs?: PwSpec[];
}
interface PwReport {
  suites?: PwSuite[];
}

export class RunnerAgent extends Agent<
  { api: CustomApi; generator: GeneratorOutput },
  RunnerOutput
> {
  readonly name = 'runner';
  private readonly resultsPath: string;

  constructor(ctx: AgentContext) {
    super(ctx, 'runner');
    this.resultsPath = path.join(ctx.frameworkRoot, 'test-results', 'test-results.json');
  }

  async run({ api, generator }: { api: CustomApi; generator: GeneratorOutput }): Promise<RunnerOutput> {
    const start = Date.now();
    this.log.info('executing spec', { spec: generator.specFileRel });
    const exitCode = await spawnInFramework(NPX, ['playwright', 'test', generator.specFileRel], this.ctx.frameworkRoot);
    const passed = exitCode === 0;
    const durationMs = Date.now() - start;

    const testCases = this.parseResults(api, generator.specFileRel, generator.assertions);
    this.log.info('execution complete', { passed, exitCode, testCases: testCases.length, durationMs });

    return { passed, exitCode, testCases, durationMs };
  }

  /** Parse the Playwright JSON report into structured, per-test records. */
  private parseResults(
    api: CustomApi,
    specFileRel: string,
    assertions: GeneratedAssertion[],
  ): GeneratedTestCase[] {
    let report: PwReport | undefined;
    try {
      report = JSON.parse(fs.readFileSync(this.resultsPath, 'utf-8')) as PwReport;
    } catch {
      this.log.warn('no parseable test-results.json');
      return [];
    }

    const cases: GeneratedTestCase[] = [];
    const specBase = path.basename(specFileRel);

    const walk = (suite: PwSuite, file?: string): void => {
      const f = suite.file ?? file;
      for (const spec of suite.specs ?? []) {
        const specFile = spec.file ?? f ?? '';
        // Only include the spec we just generated/ran.
        if (specFile && !specFile.endsWith(specBase)) continue;
        const test = spec.tests?.[0];
        const results = test?.results ?? [];
        const final = results[results.length - 1];
        const retryCount = Math.max(0, results.length - 1);
        const status: TestStatus = !final
          ? 'skipped'
          : final.status === 'passed'
            ? retryCount > 0
              ? 'healed'
              : 'passed'
            : final.status === 'skipped'
              ? 'skipped'
              : 'failed';
        const passed = status === 'passed' || status === 'healed';
        cases.push({
          id: `${specBase}:${spec.title}`,
          name: spec.title.replace(/@\S+/g, '').trim() || spec.title,
          method: api.method,
          endpoint: api.path,
          specFile: specFileRel,
          status,
          durationMs: Math.round(final?.duration ?? 0),
          retryCount,
          assertions: assertions.map((a) => ({ ...a, passed })),
          error: results.find((r) => r.error)?.error?.message,
        });
      }
      for (const child of suite.suites ?? []) walk(child, f);
    };
    for (const s of report.suites ?? []) walk(s);

    // Fallback: if the report couldn't be matched, synthesise one case.
    if (cases.length === 0) {
      cases.push({
        id: `${specBase}:synthetic`,
        name: api.name,
        method: api.method,
        endpoint: api.path,
        specFile: specFileRel,
        status: 'pending',
        durationMs: 0,
        retryCount: 0,
        assertions: assertions.map((a) => ({ ...a })),
      });
    }
    return cases;
  }
}
