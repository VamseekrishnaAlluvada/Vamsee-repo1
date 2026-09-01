/**
 * ReporterAgent — assembles the structured PipelineRunReport from every other
 * agent's output and persists a rolling history to disk. This is the single
 * source of truth for the dashboard "Results" tab.
 */

import fs from 'node:fs';
import path from 'node:path';
import { Agent, AgentContext, GeneratorOutput, HealerOutput, PlannerPlan, RunnerOutput } from './types';
import type {
  CustomApi,
  GeneratedTestCase,
  PhaseTiming,
  PipelineRunReport,
} from '../../src/types';

const MAX_HISTORY = 100;

export interface ReporterInput {
  runId: string;
  api: CustomApi;
  plan?: PlannerPlan;
  generator?: GeneratorOutput;
  runner?: RunnerOutput;
  healer?: HealerOutput;
  phases: PhaseTiming[];
  passed: boolean;
  healed: boolean;
  durationMs: number;
  summary: string;
}

export class ReporterAgent extends Agent<ReporterInput, PipelineRunReport> {
  readonly name = 'reporter';
  private readonly runsFile: string;

  constructor(ctx: AgentContext, storeDir: string) {
    super(ctx, 'reporter');
    this.runsFile = path.join(storeDir, 'pipeline-runs.json');
  }

  run(input: ReporterInput): PipelineRunReport {
    const { api, generator, runner } = input;
    const testCases: GeneratedTestCase[] = runner?.testCases ?? [];
    const scriptsGenerated = generator ? [generator.script] : [];

    const passed = testCases.filter((t) => t.status === 'passed').length;
    const healedCount = testCases.filter((t) => t.status === 'healed').length;
    const failed = testCases.filter((t) => t.status === 'failed').length;
    const assertions = testCases.reduce((a, t) => a + t.assertions.length, 0);

    const report: PipelineRunReport = {
      runId: input.runId,
      apiId: api.id,
      apiName: api.name,
      method: api.method,
      endpoint: api.path,
      baseUrl: api.baseUrl,
      ts: new Date().toISOString(),
      passed: input.passed,
      healed: input.healed,
      durationMs: input.durationMs,
      summary: input.summary,
      specFile: generator?.specFileRel ?? '',
      phases: input.phases,
      testCases,
      scriptsGenerated,
      counts: {
        testCasesGenerated: testCases.length,
        scriptsGenerated: scriptsGenerated.length,
        passed,
        failed,
        healed: healedCount,
        assertions,
      },
    };

    this.persist(report);
    this.log.info('report assembled', { runId: report.runId, counts: report.counts });
    return report;
  }

  /** Append to the rolling on-disk history (newest first). */
  private persist(report: PipelineRunReport): void {
    const list = this.readAll().filter((r) => r.runId !== report.runId);
    list.unshift(report);
    const trimmed = list.slice(0, MAX_HISTORY);
    try {
      fs.writeFileSync(this.runsFile, `${JSON.stringify(trimmed, null, 2)}\n`);
    } catch (err) {
      this.log.error('failed to persist runs', { error: (err as Error).message });
    }
  }

  readAll(): PipelineRunReport[] {
    try {
      if (!fs.existsSync(this.runsFile)) return [];
      return JSON.parse(fs.readFileSync(this.runsFile, 'utf-8')) as PipelineRunReport[];
    } catch {
      return [];
    }
  }
}
