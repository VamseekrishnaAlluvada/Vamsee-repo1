/**
 * Orchestrator — composes the agents into the industrial pipeline:
 *
 *   Validator → Planner → Generator → Runner → Healer → Reporter
 *
 * It owns phase timing and streams progress through a transport-agnostic
 * {@link PipelineEmitter} (the server wires this to Socket.io). Each phase is
 * isolated: a thrown agent marks its phase failed and the run ends cleanly with
 * a persisted report rather than crashing the server.
 */

import { AgentContext } from './types';
import { createLogger } from './logger';
import { ValidatorAgent } from './validator.agent';
import { PlannerAgent } from './planner.agent';
import { GeneratorAgent } from './generator.agent';
import { RunnerAgent } from './runner.agent';
import { HealerAgent } from './healer.agent';
import { ReporterAgent } from './reporter.agent';
import type {
  ActivityEvent,
  CustomApi,
  PhaseStatus,
  PhaseTiming,
  PipelinePhaseId,
  PipelineResult,
  PipelineRunReport,
  ValidationResult,
} from '../../src/types';

export interface PipelineEmitter {
  phase(u: {
    runId: string;
    apiId: string;
    phase: PipelinePhaseId;
    status: PhaseStatus;
    detail?: string;
    ts: string;
  }): void;
  validation(v: ValidationResult & { runId: string; apiId: string }): void;
  result(r: PipelineResult): void;
  report(rep: PipelineRunReport): void;
  activity(e: ActivityEvent): void;
}

export class Orchestrator {
  private readonly ctx: AgentContext;
  private readonly validator: ValidatorAgent;
  private readonly planner: PlannerAgent;
  private readonly generator: GeneratorAgent;
  private readonly runner: RunnerAgent;
  private readonly healer: HealerAgent;
  private readonly reporter: ReporterAgent;

  constructor(frameworkRoot: string, storeDir: string) {
    this.ctx = { frameworkRoot, logger: createLogger('orchestrator') };
    this.validator = new ValidatorAgent(this.ctx);
    this.planner = new PlannerAgent(this.ctx);
    this.generator = new GeneratorAgent(this.ctx);
    this.runner = new RunnerAgent(this.ctx);
    this.healer = new HealerAgent(this.ctx);
    this.reporter = new ReporterAgent(this.ctx, storeDir);
  }

  /** Expose persisted history for REST hydration. */
  history(): PipelineRunReport[] {
    return this.reporter.readAll();
  }

  /** Standalone validity check (used by the /validate endpoint). */
  validate(api: CustomApi): Promise<ValidationResult> {
    return this.validator.run(api);
  }

  async run(api: CustomApi, runId: string, emit: PipelineEmitter): Promise<PipelineRunReport> {
    const started = Date.now();
    const phases: PhaseTiming[] = [];
    const ts = (): string => new Date().toISOString();

    const runPhase = async <T>(
      id: PipelinePhaseId,
      runningDetail: string,
      fn: () => Promise<T> | T,
      doneDetail: (out: T) => { status: PhaseStatus; detail: string },
    ): Promise<T> => {
      const phaseStart = Date.now();
      emit.phase({ runId, apiId: api.id, phase: id, status: 'running', detail: runningDetail, ts: ts() });
      const out = await fn();
      const { status, detail } = doneDetail(out);
      phases.push({ id, status, detail, durationMs: Date.now() - phaseStart });
      emit.phase({ runId, apiId: api.id, phase: id, status, detail, ts: ts() });
      return out;
    };

    const skipRest = (from: PipelinePhaseId[], detail: string): void => {
      for (const p of from) {
        phases.push({ id: p, status: 'skipped', detail, durationMs: 0 });
        emit.phase({ runId, apiId: api.id, phase: p, status: 'skipped', detail, ts: ts() });
      }
    };

    emit.activity({
      id: `${runId}-start`,
      ts: ts(),
      type: 'run.start',
      label: `Pipeline started: ${api.name}`,
      detail: `${api.method} ${api.path}`,
    });

    // VALIDATOR ---------------------------------------------------------------
    const validation = await runPhase(
      'validator',
      'checking API validity & reachability',
      () => this.validator.run(api),
      (v) => ({ status: v.valid ? 'passed' : 'failed', detail: v.reason }),
    );
    emit.validation({ runId, apiId: api.id, ...validation });

    if (!validation.valid) {
      skipRest(['planner', 'generator', 'runner', 'healer'], 'skipped — API failed validation');
      return this.finish(api, runId, emit, {
        started,
        phases,
        passed: false,
        healed: false,
        summary: validation.reason,
      });
    }

    // PLANNER -----------------------------------------------------------------
    const plan = await runPhase(
      'planner',
      'analysing endpoint, auth & dependencies',
      () => this.planner.run(api),
      (p) => ({ status: 'passed', detail: `${p.method} ${p.path} · expect ${p.expectedStatus} · ${p.authNote}` }),
    );

    // GENERATOR ---------------------------------------------------------------
    const generator = await runPhase(
      'generator',
      'synthesising typed Playwright spec',
      () => this.generator.run({ api, plan }),
      (g) => ({ status: 'passed', detail: g.specFileRel }),
    );

    // RUNNER ------------------------------------------------------------------
    emit.activity({ id: `${runId}-run`, ts: ts(), type: 'test.start', label: api.name, detail: `${api.method} ${api.path}`, status: 'running' });
    const runner = await runPhase(
      'runner',
      `npx playwright test ${generator.specFileRel}`,
      () => this.runner.run({ api, generator }),
      (r) => ({ status: r.passed ? 'passed' : 'failed', detail: r.passed ? 'all assertions passed' : `playwright exit ${r.exitCode}` }),
    );
    emit.activity({ id: `${runId}-ran`, ts: ts(), type: runner.passed ? 'test.pass' : 'test.fail', label: api.name, detail: `${runner.durationMs}ms`, status: runner.passed ? 'passed' : 'failed' });

    // HEALER ------------------------------------------------------------------
    const healer = await runPhase(
      'healer',
      'classifying failure, patching & re-running',
      () => this.healer.run({ runner }),
      (h) => ({
        status: !h.attempted ? 'skipped' : h.healed ? 'passed' : 'failed',
        detail: h.detail,
      }),
    );

    const passed = runner.passed || healer.healed;
    const summary = passed
      ? healer.healed
        ? 'Failed then auto-healed to green'
        : 'Passed on first run'
      : 'Failed — healer could not recover';

    return this.finish(api, runId, emit, {
      started,
      phases,
      plan,
      generator,
      runner,
      healer,
      passed,
      healed: healer.healed,
      summary,
    });
  }

  private finish(
    api: CustomApi,
    runId: string,
    emit: PipelineEmitter,
    input: {
      started: number;
      phases: PhaseTiming[];
      plan?: ReturnType<PlannerAgent['run']>;
      generator?: Awaited<ReturnType<GeneratorAgent['run']>>;
      runner?: Awaited<ReturnType<RunnerAgent['run']>>;
      healer?: Awaited<ReturnType<HealerAgent['run']>>;
      passed: boolean;
      healed: boolean;
      summary: string;
    },
  ): PipelineRunReport {
    const durationMs = Date.now() - input.started;
    const report = this.reporter.run({
      runId,
      api,
      plan: input.plan,
      generator: input.generator,
      runner: input.runner,
      healer: input.healer,
      phases: input.phases,
      passed: input.passed,
      healed: input.healed,
      durationMs,
      summary: input.summary,
    });

    const result: PipelineResult = {
      runId,
      apiId: api.id,
      apiName: api.name,
      specFile: report.specFile,
      passed: input.passed,
      healed: input.healed,
      durationMs,
      summary: input.summary,
      ts: report.ts,
    };
    emit.result(result);
    emit.report(report);
    emit.activity({
      id: `${runId}-done`,
      ts: report.ts,
      type: 'run.complete',
      label: `Pipeline complete: ${api.name}`,
      detail: input.summary,
      status: input.passed ? 'passed' : 'failed',
    });
    return report;
  }
}
