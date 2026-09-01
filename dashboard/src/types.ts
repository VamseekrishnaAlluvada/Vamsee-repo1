// Shared data contract between the Express server and the React client.

export type TestStatus =
  | 'passed'
  | 'failed'
  | 'healed'
  | 'skipped'
  | 'running'
  | 'pending';

export type EnvName = 'dev' | 'staging' | 'prod';

export interface TestRow {
  id: string;
  suite: string;
  file: string;
  title: string;
  endpoint: string;
  method: string;
  status: TestStatus;
  durationMs: number;
  retryCount: number;
  tags: string[];
  error?: string;
  raw?: unknown;
}

export interface Kpis {
  total: number;
  passed: number;
  failed: number;
  healed: number;
  skipped: number;
  passRate: number; // 0..100
  avgDurationMs: number;
  p95Ms: number;
  flakiness: number; // 0..100, from retries/healing
}

export interface RunSummary {
  runId: string;
  timestamp: string;
  env: EnvName;
  apiVersion: string;
  kpis: Kpis;
  rows: TestRow[];
}

export interface HistoryPoint {
  runId: string;
  timestamp: string;
  passRate: number;
  p95Ms: number;
  avgDurationMs: number;
  total: number;
  flakiness: number;
}

export interface TopologyNode {
  id: string;
  operationId?: string;
  method?: string;
  path?: string;
  role?: string;
  auth?: string;
  status: TestStatus;
}

export interface TopologyEdge {
  from: string;
  to: string;
  reason?: string;
}

export interface Topology {
  nodes: TopologyNode[];
  edges: TopologyEdge[];
  criticalPath: string[];
}

export interface HealerEntry {
  specTitle: string;
  category: string;
  applied: boolean;
  filesTouched: string[];
  changeSummary: string;
  original: string;
  before: string;
  after: string;
}

export interface HealerReport {
  markdown: string;
  attempts: number;
  finalPassing: boolean;
  entries: HealerEntry[];
}

export type ActivityType =
  | 'run.start'
  | 'run.complete'
  | 'test.start'
  | 'test.pass'
  | 'test.fail'
  | 'test.skip'
  | 'healer.attempt';

export interface ActivityEvent {
  id: string;
  ts: string;
  type: ActivityType;
  label: string;
  detail?: string;
  status?: TestStatus;
}

// ---------------------------------------------------------------------------
// Manual API definitions + the Planner→Generator→Healer pipeline
// ---------------------------------------------------------------------------
export interface KeyVal {
  key: string;
  value: string;
}

export type CustomAuth = 'none' | 'cookie' | 'basic' | 'bearer';
export type CustomMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface CustomApi {
  id: string;
  name: string;
  method: CustomMethod;
  baseUrl: string;
  path: string;
  headers: KeyVal[];
  query: KeyVal[];
  body: string; // raw JSON text
  auth: CustomAuth;
  bearerToken?: string;
  expectedStatus: number;
  createdAt: string;
}

export type PipelinePhaseId = 'validator' | 'planner' | 'generator' | 'runner' | 'healer';
export type PhaseStatus = 'pending' | 'running' | 'passed' | 'failed' | 'skipped';

/** Result of the API-validity checkpoint. */
export interface ValidationResult {
  valid: boolean;
  /** Human-readable reason shown to the user when invalid. */
  reason: string;
  /** HTTP status the endpoint responded with, when reachable. */
  status?: number;
  /** Normalised, absolute URL that was checked. */
  url?: string;
  responseTimeMs?: number;
}

export interface PipelinePhaseUpdate {
  runId: string;
  apiId: string;
  phase: PipelinePhaseId;
  status: PhaseStatus;
  detail?: string;
  ts: string;
}

export interface PipelineResult {
  runId: string;
  apiId: string;
  apiName: string;
  specFile: string;
  passed: boolean;
  healed: boolean;
  durationMs: number;
  summary: string;
  ts: string;
}

// ---------------------------------------------------------------------------
// Structured pipeline run report (the "Results" tab data contract)
// ---------------------------------------------------------------------------

/** A single assertion the Generator wrote into a spec, plus its live outcome. */
export interface GeneratedAssertion {
  /** Human-readable assertion, e.g. "response status === 200". */
  label: string;
  /** Assertion family — currently status-only. */
  kind: 'status' | 'schema' | 'responseTime' | 'body';
  /** Outcome once the runner has executed (undefined before it runs). */
  passed?: boolean;
}

/** One generated & executed test case. */
export interface GeneratedTestCase {
  id: string;
  name: string;
  method: string;
  endpoint: string;
  specFile: string;
  status: TestStatus;
  /** Wall-clock time the test itself took (from Playwright). */
  durationMs: number;
  retryCount: number;
  assertions: GeneratedAssertion[];
  error?: string;
}

/** A generated automation script artifact on disk. */
export interface GeneratedScript {
  file: string;
  lines: number;
  bytes: number;
  language: 'typescript';
}

/** Per-phase timing for the pipeline. */
export interface PhaseTiming {
  id: PipelinePhaseId;
  status: PhaseStatus;
  detail?: string;
  durationMs: number;
}

/** The full structured record of one automation run — powers the Results tab. */
export interface PipelineRunReport {
  runId: string;
  apiId: string;
  apiName: string;
  method: CustomMethod;
  endpoint: string;
  baseUrl: string;
  ts: string;
  passed: boolean;
  healed: boolean;
  /** Total pipeline wall-clock. */
  durationMs: number;
  summary: string;
  specFile: string;
  phases: PhaseTiming[];
  testCases: GeneratedTestCase[];
  scriptsGenerated: GeneratedScript[];
  /** Roll-up counts for quick display. */
  counts: {
    testCasesGenerated: number;
    scriptsGenerated: number;
    passed: number;
    failed: number;
    healed: number;
    assertions: number;
  };
}
