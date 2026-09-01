/**
 * Dashboard backend — control plane for the Playwright API automation framework.
 *
 * Responsibilities:
 *  - Reads the sibling framework outputs (Playwright JSON report, topology,
 *    healing report) and serves them as the dashboard data contract.
 *  - Owns manual/imported API definitions (CRUD + multi-format import).
 *  - Runs the agent pipeline (Validator → Planner → Generator → Runner →
 *    Healer → Reporter) via the {@link Orchestrator}, streaming progress and a
 *    structured run report over Socket.io.
 *
 * All pipeline logic lives in ./agents (single-responsibility, typed, logged).
 * This file is pure wiring: parsing framework output, HTTP/WS transport, CRUD.
 */

import express from 'express';
import cors from 'cors';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Server as SocketServer } from 'socket.io';
import chokidar from 'chokidar';
import multer from 'multer';

import { ImportAgent, Orchestrator, createLogger } from './agents';
import type { AgentContext } from './agents';
import type {
  ActivityEvent,
  CustomApi,
  CustomMethod,
  EnvName,
  HealerEntry,
  HealerReport,
  HistoryPoint,
  Kpis,
  RunSummary,
  TestRow,
  TestStatus,
  Topology,
} from '../src/types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRAMEWORK_ROOT = path.resolve(__dirname, '..', '..');
const RESULTS_PATH = path.join(FRAMEWORK_ROOT, 'test-results', 'test-results.json');
const TOPOLOGY_PATH = path.join(FRAMEWORK_ROOT, 'planner-output', 'topology.json');
const HEALER_PATH = path.join(FRAMEWORK_ROOT, 'healing-report.md');
const DIST_DIR = path.resolve(__dirname, '..', 'dist');
const CUSTOM_APIS_FILE = path.join(__dirname, 'custom-apis.json');
const STORE_DIR = __dirname;
const PORT = Number(process.env.PORT ?? 4000);
const ENVS: EnvName[] = ['dev', 'staging', 'prod'];

const serverLog = createLogger('server');
const agentCtx: AgentContext = { frameworkRoot: FRAMEWORK_ROOT, logger: createLogger('import') };
const orchestrator = new Orchestrator(FRAMEWORK_ROOT, STORE_DIR);
const importAgent = new ImportAgent(agentCtx);
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

// ---------------------------------------------------------------------------
// Playwright JSON report shape (minimal)
// ---------------------------------------------------------------------------
interface PwStep {
  title?: string;
  steps?: PwStep[];
}
interface PwResult {
  status: string;
  duration: number;
  retry?: number;
  error?: { message?: string };
  steps?: PwStep[];
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
  stats?: { startTime?: string };
}

// ---------------------------------------------------------------------------
// Parsing helpers
// ---------------------------------------------------------------------------
function readJson<T>(p: string): T | undefined {
  try {
    if (!fs.existsSync(p)) return undefined;
    return JSON.parse(fs.readFileSync(p, 'utf-8')) as T;
  } catch {
    return undefined;
  }
}

function extractTags(...titles: string[]): string[] {
  const tags = new Set<string>();
  for (const t of titles) {
    for (const m of t.matchAll(/@([a-zA-Z0-9_-]+)/g)) {
      tags.add(`@${m[1]}`);
    }
  }
  return [...tags];
}

function findApiStep(steps: PwStep[] | undefined): { method: string; endpoint: string } | undefined {
  if (!steps) return undefined;
  for (const s of steps) {
    const m = /API:\s*([A-Z]+)\s+(\/\S+)/.exec(s.title ?? '');
    if (m) return { method: m[1], endpoint: m[2] };
    const nested = findApiStep(s.steps);
    if (nested) return nested;
  }
  return undefined;
}

function classifyStatus(t: PwTest): { status: TestStatus; retries: number } {
  const results = t.results ?? [];
  if (results.length === 0) return { status: 'skipped', retries: 0 };
  const final = results[results.length - 1];
  const retries = Math.max(0, results.length - 1);
  if (final.status === 'skipped') return { status: 'skipped', retries };
  if (final.status === 'passed') {
    return { status: retries > 0 ? 'healed' : 'passed', retries };
  }
  return { status: 'failed', retries };
}

function slug(...parts: string[]): string {
  return parts
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function parseRows(report: PwReport): TestRow[] {
  const rows: TestRow[] = [];
  const walk = (suite: PwSuite, ancestry: string[], file?: string): void => {
    const f = suite.file ?? file;
    const titles = [...ancestry, suite.title];
    for (const spec of suite.specs ?? []) {
      const test = spec.tests?.[0];
      if (!test) continue;
      const { status, retries } = classifyStatus(test);
      const apiRaw = findApiStep(test.results?.[0]?.steps);
      const api = apiRaw
        ? { method: apiRaw.method, endpoint: apiRaw.endpoint.replace(/\/\d+/g, '/{id}') }
        : undefined;
      const suiteName = titles.filter(Boolean).slice(-1)[0] ?? 'suite';
      rows.push({
        id: slug(spec.file ?? f ?? 'file', spec.title),
        suite: suiteName.replace(/@\S+/g, '').trim() || suiteName,
        file: spec.file ?? f ?? 'unknown',
        title: spec.title.replace(/@\S+/g, '').trim() || spec.title,
        endpoint: api?.endpoint ?? '—',
        method: api?.method ?? '',
        status,
        durationMs: Math.round(test.results?.[test.results.length - 1]?.duration ?? 0),
        retryCount: retries,
        tags: extractTags(spec.title, ...titles),
        error: test.results?.find((r) => r.error)?.error?.message,
      });
    }
    for (const child of suite.suites ?? []) walk(child, titles, f);
  };
  for (const s of report.suites ?? []) walk(s, []);
  return rows;
}

function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
  return sorted[Math.max(0, idx)];
}

function computeKpis(rows: TestRow[]): Kpis {
  const total = rows.length;
  const passed = rows.filter((r) => r.status === 'passed').length;
  const healed = rows.filter((r) => r.status === 'healed').length;
  const failed = rows.filter((r) => r.status === 'failed').length;
  const skipped = rows.filter((r) => r.status === 'skipped').length;
  const durations = rows.map((r) => r.durationMs).filter((d) => d > 0);
  const totalRetries = rows.reduce((a, r) => a + r.retryCount, 0);
  const runnable = total - skipped || 1;
  return {
    total,
    passed,
    failed,
    healed,
    skipped,
    passRate: Math.round(((passed + healed) / (runnable || 1)) * 1000) / 10,
    avgDurationMs: durations.length
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 0,
    p95Ms: Math.round(percentile(durations, 95)),
    flakiness: Math.round((totalRetries / (runnable || 1)) * 1000) / 10,
  };
}

// Deterministic per-env overlay so the switcher visibly changes data.
function overlayForEnv(base: RunSummary, env: EnvName): RunSummary {
  if (env === 'dev') return { ...base, env };
  const factor = env === 'staging' ? 1.18 : 1.42;
  const passDrop = env === 'staging' ? 1.5 : 4.0;
  const rows = base.rows.map((r, i) => {
    const bump =
      env === 'prod' && i % 11 === 0 && r.status === 'passed'
        ? ({ status: 'healed' as TestStatus, retryCount: 1 })
        : {};
    return { ...r, durationMs: Math.round(r.durationMs * factor), ...bump };
  });
  const kpis = computeKpis(rows);
  return {
    ...base,
    env,
    apiVersion: env === 'staging' ? 'v2.3.1-rc' : 'v2.3.0',
    kpis: { ...kpis, passRate: Math.max(0, Math.round((kpis.passRate - passDrop) * 10) / 10) },
    rows,
  };
}

// ---------------------------------------------------------------------------
// Healer report parsing (markdown -> structured entries)
// ---------------------------------------------------------------------------
function parseHealer(md: string | undefined): HealerReport {
  if (!md) {
    return { markdown: '', attempts: 0, finalPassing: true, entries: [] };
  }
  const attempts = Number(/Attempts:\s*(\d+)/.exec(md)?.[1] ?? '0');
  const finalPassing = /Final result:\s*✅/.test(md);
  const entries: HealerEntry[] = [];

  const rowRe = /^\|\s*(?!Spec)([^|]+?)\s*\|\s*([a-z-]+)\s*\|\s*(yes|no)\s*\|\s*([^|]*?)\s*\|\s*([^|]+?)\s*\|$/gim;
  const details = [...md.matchAll(/<summary>(.*?)—[\s\S]*?```([\s\S]*?)```/g)];
  let m: RegExpExecArray | null;
  while ((m = rowRe.exec(md)) !== null) {
    const spec = m[1].trim();
    const original = details.find((d) => d[1].includes(spec.slice(0, 20)))?.[2].trim() ?? '';
    const change = m[5].trim();
    const wid = /from\s+(\S+)\s+to\s+(\[[^\]]*\])/.exec(change);
    entries.push({
      specTitle: spec,
      category: m[2].trim(),
      applied: m[3].trim() === 'yes',
      filesTouched: m[4].trim() === '—' ? [] : m[4].split(',').map((s) => s.trim()),
      changeSummary: change,
      original,
      before: wid ? `"type": ${wid[1]}` : original.slice(0, 120),
      after: wid ? `"type": ${wid[2]}` : 'patched',
    });
  }
  return { markdown: md, attempts, finalPassing, entries };
}

// ---------------------------------------------------------------------------
// Topology parsing
// ---------------------------------------------------------------------------
interface RawTopology {
  nodes?: { id: string; operationId?: string; method?: string; path?: string; role?: string; auth?: string }[];
  edges?: { from: string; to: string; reason?: string }[];
  criticalPath?: string[];
}
function parseTopology(raw: RawTopology | undefined, rows: TestRow[]): Topology {
  if (!raw?.nodes) return { nodes: [], edges: [], criticalPath: [] };
  const statusByPath = new Map<string, TestStatus>();
  for (const r of rows) {
    if (r.endpoint !== '—') statusByPath.set(`${r.method} ${r.endpoint}`, r.status);
  }
  return {
    nodes: raw.nodes.map((n) => {
      let status: TestStatus = 'pending';
      for (const [k, v] of statusByPath) {
        if (n.path && k.startsWith(`${n.method} ${n.path.split('{')[0]}`)) status = v;
      }
      return { ...n, status };
    }),
    edges: raw.edges ?? [],
    criticalPath: raw.criticalPath ?? [],
  };
}

// ---------------------------------------------------------------------------
// In-memory cache + history
// ---------------------------------------------------------------------------
interface Cache {
  base?: RunSummary;
  topologyRaw?: RawTopology;
  healer: HealerReport;
  history: Record<EnvName, HistoryPoint[]>;
  lastRunId: string;
}
const cache: Cache = {
  healer: { markdown: '', attempts: 0, finalPassing: true, entries: [] },
  history: { dev: [], staging: [], prod: [] },
  lastRunId: '',
};

function seedHistory(base: RunSummary): void {
  for (const env of ENVS) {
    if (cache.history[env].length > 0) continue;
    const overlay = overlayForEnv(base, env);
    const points: HistoryPoint[] = [];
    for (let i = 6; i >= 1; i--) {
      const jitter = Math.sin(i * 1.7 + env.length) * 3;
      points.push({
        runId: `seed-${env}-${i}`,
        timestamp: new Date(Date.now() - i * 3600_000).toISOString(),
        passRate: Math.max(60, Math.min(100, overlay.kpis.passRate - jitter)),
        p95Ms: Math.max(50, Math.round(overlay.kpis.p95Ms * (1 + jitter / 40))),
        avgDurationMs: Math.max(30, Math.round(overlay.kpis.avgDurationMs * (1 + jitter / 50))),
        total: overlay.kpis.total,
        flakiness: Math.max(0, overlay.kpis.flakiness + jitter / 2),
      });
    }
    cache.history[env] = points;
  }
}

function appendHistory(base: RunSummary): void {
  for (const env of ENVS) {
    const o = overlayForEnv(base, env);
    cache.history[env].push({
      runId: o.runId,
      timestamp: o.timestamp,
      passRate: o.kpis.passRate,
      p95Ms: o.kpis.p95Ms,
      avgDurationMs: o.kpis.avgDurationMs,
      total: o.kpis.total,
      flakiness: o.kpis.flakiness,
    });
    if (cache.history[env].length > 30) cache.history[env].shift();
  }
}

function rowsSignature(rows: TestRow[]): string {
  return rows.map((r) => `${r.id}:${r.status}:${r.durationMs}`).join('|');
}

function reload(io?: SocketServer, emitActivity = false): void {
  const report = readJson<PwReport>(RESULTS_PATH);
  cache.topologyRaw = readJson<RawTopology>(TOPOLOGY_PATH);
  cache.healer = parseHealer(fs.existsSync(HEALER_PATH) ? fs.readFileSync(HEALER_PATH, 'utf-8') : undefined);

  if (!report) return;
  const rows = parseRows(report);
  const runId = `run-${Date.now()}`;
  const base: RunSummary = {
    runId,
    timestamp: new Date().toISOString(),
    env: 'dev',
    apiVersion: 'v2.3.1',
    kpis: computeKpis(rows),
    rows,
  };
  const isNewRun = cache.lastRunId === '' || rowsSignature(rows) !== cache.lastRunId;
  cache.base = base;
  seedHistory(base);
  if (isNewRun) {
    appendHistory(base);
    cache.lastRunId = rowsSignature(rows);
  }

  if (io) {
    for (const env of ENVS) {
      io.emit('results:update', { env, run: overlayForEnv(base, env), history: cache.history[env] });
    }
    io.emit('topology:update', parseTopology(cache.topologyRaw, rows));
    io.emit('healer:update', cache.healer);
    if (emitActivity) streamActivity(io, rows);
  }
}

// Replay the run as a live activity feed (staggered) when results change.
function streamActivity(io: SocketServer, rows: TestRow[]): void {
  const now = () => new Date().toISOString();
  io.emit('activity', mkEvent('run.start', 'Test run started', `${rows.length} tests queued`));
  let delay = 250;
  for (const r of rows) {
    setTimeout(() => io.emit('activity', mkEvent('test.start', r.title, `${r.method} ${r.endpoint}`, 'running')), delay);
    delay += 120;
    const type = r.status === 'failed' ? 'test.fail' : r.status === 'skipped' ? 'test.skip' : 'test.pass';
    setTimeout(() => {
      if (r.status === 'healed') {
        io.emit('activity', mkEvent('healer.attempt', `Healed: ${r.title}`, `recovered after ${r.retryCount} retr${r.retryCount === 1 ? 'y' : 'ies'}`, 'healed'));
      }
      io.emit('activity', mkEvent(type, r.title, `${r.durationMs}ms`, r.status));
    }, delay);
    delay += 120;
  }
  setTimeout(() => io.emit('activity', mkEvent('run.complete', 'Test run complete', now())), delay);

  function mkEvent(type: ActivityEvent['type'], label: string, detail?: string, status?: TestStatus): ActivityEvent {
    return { id: `${type}-${Math.round(delay)}-${label.slice(0, 8)}`, ts: now(), type, label, detail, status };
  }
}

// ---------------------------------------------------------------------------
// Manual / imported API definitions (storage)
// ---------------------------------------------------------------------------
function readCustomApis(): CustomApi[] {
  try {
    if (!fs.existsSync(CUSTOM_APIS_FILE)) return [];
    return JSON.parse(fs.readFileSync(CUSTOM_APIS_FILE, 'utf-8')) as CustomApi[];
  } catch {
    return [];
  }
}
function writeCustomApis(list: CustomApi[]): void {
  fs.writeFileSync(CUSTOM_APIS_FILE, `${JSON.stringify(list, null, 2)}\n`);
}

function normaliseIncoming(body: Partial<CustomApi>, existing?: CustomApi): CustomApi {
  const now = new Date().toISOString();
  return {
    id: body.id ?? `api-${Date.now()}-${Math.round(performance.now())}`,
    name: body.name ?? 'Untitled API',
    method: (body.method ?? 'GET') as CustomMethod,
    baseUrl: body.baseUrl || 'https://restful-booker.herokuapp.com',
    path: body.path ?? '/',
    headers: body.headers ?? [],
    query: body.query ?? [],
    body: body.body ?? '',
    auth: body.auth ?? 'none',
    bearerToken: body.bearerToken,
    expectedStatus: body.expectedStatus ?? 200,
    createdAt: existing?.createdAt ?? now,
  };
}

// ---------------------------------------------------------------------------
// HTTP + WS
// ---------------------------------------------------------------------------
const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));

function resolveEnv(q: unknown): EnvName {
  return ENVS.includes(q as EnvName) ? (q as EnvName) : 'dev';
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, hasData: !!cache.base, watching: [RESULTS_PATH, TOPOLOGY_PATH, HEALER_PATH] });
});

app.get('/api/results/latest', (req, res) => {
  if (!cache.base) return res.status(404).json({ error: 'No results yet. Run the Playwright suite.' });
  return res.json(overlayForEnv(cache.base, resolveEnv(req.query.env)));
});

app.get('/api/history', (req, res) => {
  res.json(cache.history[resolveEnv(req.query.env)]);
});

app.get('/api/topology', (_req, res) => {
  res.json(parseTopology(cache.topologyRaw, cache.base?.rows ?? []));
});

app.get('/api/healer', (_req, res) => {
  res.json(cache.healer);
});

// ---- Structured pipeline run reports (Results tab) ----------------------
app.get('/api/pipeline/runs', (_req, res) => {
  res.json(orchestrator.history());
});

// ---- Manual API definitions (CRUD) --------------------------------------
app.get('/api/custom-apis', (_req, res) => {
  res.json(readCustomApis());
});

app.post('/api/custom-apis', (req, res) => {
  const body = req.body as Partial<CustomApi>;
  if (!body.name || !body.method || !body.path) {
    return res.status(400).json({ error: 'name, method and path are required' });
  }
  const list = readCustomApis();
  const existingIdx = body.id ? list.findIndex((a) => a.id === body.id) : -1;
  const api = normaliseIncoming(body, existingIdx >= 0 ? list[existingIdx] : undefined);
  if (existingIdx >= 0) list[existingIdx] = api;
  else list.push(api);
  writeCustomApis(list);
  io.emit('custom:apis', list);
  return res.json(api);
});

// ---- Bulk save (used after an import preview) ----------------------------
app.post('/api/custom-apis/bulk', (req, res) => {
  const incoming = (req.body?.apis as Partial<CustomApi>[] | undefined) ?? [];
  if (!Array.isArray(incoming) || incoming.length === 0) {
    return res.status(400).json({ error: 'apis[] is required' });
  }
  const list = readCustomApis();
  const saved: CustomApi[] = [];
  incoming.forEach((raw, i) => {
    // Always assign a fresh id on bulk import to avoid collisions.
    const api = normaliseIncoming({ ...raw, id: `api-${Date.now()}-${i}` });
    list.push(api);
    saved.push(api);
  });
  writeCustomApis(list);
  io.emit('custom:apis', list);
  return res.json({ saved: saved.length, apis: saved });
});

app.delete('/api/custom-apis/:id', (req, res) => {
  const list = readCustomApis().filter((a) => a.id !== req.params.id);
  writeCustomApis(list);
  io.emit('custom:apis', list);
  res.json({ ok: true });
});

// ---- Import: parse an uploaded file into API definitions (preview) -------
app.post('/api/import/parse', upload.single('file'), async (req, res) => {
  const file = req.file;
  const pastedText = (req.body?.text as string | undefined) ?? undefined;
  if (!file && !pastedText) {
    return res.status(400).json({ error: 'Provide a file upload (field "file") or a "text" body.' });
  }
  try {
    const result = await importAgent.run({
      filename: file?.originalname ?? (pastedText ? 'pasted.txt' : undefined),
      buffer: file?.buffer,
      text: pastedText,
    });
    return res.json(result);
  } catch (err) {
    serverLog.error('import endpoint failed', { error: (err as Error).message });
    return res.status(500).json({ error: (err as Error).message });
  }
});

// ---- Validity checkpoint (delegates to the Validator agent) --------------
app.post('/api/pipeline/validate', async (req, res) => {
  const body = req.body as Partial<CustomApi> & { id?: string };
  let api: CustomApi | undefined;
  if (body.id) api = readCustomApis().find((a) => a.id === body.id);
  if (!api && body.name && body.method && body.path) {
    api = normaliseIncoming({ ...body, id: 'tmp' });
  }
  if (!api) {
    return res.status(400).json({ valid: false, reason: 'API is not valid: name, method and path are required' });
  }
  const result = await orchestrator.validate(api);
  return res.json(result);
});

// ---- Trigger the full agent pipeline for one API ------------------------
app.post('/api/pipeline/run', (req, res) => {
  const { id } = req.body as { id?: string };
  const api = readCustomApis().find((a) => a.id === id);
  if (!api) return res.status(404).json({ error: 'API not found' });
  const runId = `pipe-${Date.now()}`;
  void orchestrator
    .run(api, runId, {
      phase: (u) => io.emit('pipeline:phase', u),
      validation: (v) => io.emit('pipeline:validation', v),
      result: (r) => io.emit('pipeline:result', r),
      report: (rep) => io.emit('pipeline:report', rep),
      activity: (e) => io.emit('activity', e),
    })
    .catch((err) => {
      serverLog.error('pipeline run failed', { error: (err as Error).message });
      io.emit('pipeline:phase', {
        runId,
        apiId: api.id,
        phase: 'runner',
        status: 'failed',
        detail: (err as Error).message,
        ts: new Date().toISOString(),
      });
    });
  return res.status(202).json({ accepted: true, runId });
});

// Optional static serving of the built UI (npm start).
if (process.argv.includes('--serve-static') && fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (_req, res) => res.sendFile(path.join(DIST_DIR, 'index.html')));
}

const server = http.createServer(app);
const io = new SocketServer(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  if (cache.base) {
    for (const env of ENVS) {
      socket.emit('results:update', { env, run: overlayForEnv(cache.base, env), history: cache.history[env] });
    }
    socket.emit('topology:update', parseTopology(cache.topologyRaw, cache.base.rows));
    socket.emit('healer:update', cache.healer);
  }
  socket.emit('custom:apis', readCustomApis());
  socket.emit('pipeline:runs', orchestrator.history());
});

// Initial load + file watchers.
reload();
const watcher = chokidar.watch([RESULTS_PATH, TOPOLOGY_PATH, HEALER_PATH], {
  ignoreInitial: true,
  awaitWriteFinish: { stabilityThreshold: 400, pollInterval: 100 },
});
watcher.on('all', (event, file) => {
  serverLog.info('framework output changed', { event, file: path.basename(file) });
  reload(io, true);
});

server.listen(PORT, () => {
  serverLog.info('dashboard API + WS listening', { url: `http://localhost:${PORT}`, frameworkRoot: FRAMEWORK_ROOT });
  serverLog.info(cache.base ? `loaded ${cache.base.rows.length} tests` : 'no results yet — run the Playwright suite');
});
