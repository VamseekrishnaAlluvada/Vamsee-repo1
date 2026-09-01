/** Minimal shape of the Playwright JSON reporter output we rely on. */
export interface PwJsonReport {
  suites: PwSuite[];
  stats?: { expected: number; unexpected: number; flaky: number; skipped: number };
}

export interface PwSuite {
  title: string;
  file?: string;
  suites?: PwSuite[];
  specs: PwSpec[];
}

export interface PwSpec {
  title: string;
  ok: boolean;
  file?: string;
  tests: PwTest[];
}

export interface PwTest {
  status?: string;
  results: PwResult[];
}

export interface PwResult {
  status: 'passed' | 'failed' | 'timedOut' | 'skipped' | 'interrupted';
  duration: number;
  error?: { message?: string; stack?: string };
  errors?: { message?: string; stack?: string }[];
}

export type HealingCategory =
  | 'schema-drift'
  | 'endpoint-versioning'
  | 'missing-seed-data'
  | 'flaky-timeout'
  | 'unknown';

export interface Failure {
  specTitle: string;
  file: string;
  message: string;
  stack: string;
}

export interface HealingAction {
  category: HealingCategory;
  failure: Failure;
  applied: boolean;
  changeSummary: string;
  filesTouched: string[];
}
