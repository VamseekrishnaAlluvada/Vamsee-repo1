/**
 * Shared agent contracts.
 *
 * Every agent is a small, single-responsibility unit with a typed `run(input)`
 * contract, its own logger, and no hidden side effects beyond those it declares.
 * The Orchestrator composes them into the Validator → Planner → Generator →
 * Runner → Healer → Reporter pipeline.
 */

import type {
  CustomApi,
  GeneratedAssertion,
  GeneratedScript,
  GeneratedTestCase,
  PipelinePhaseId,
  PhaseStatus,
  ValidationResult,
} from '../../src/types';
import type { AgentLogger } from './logger';

export interface AgentContext {
  /** Absolute path to the Playwright framework root. */
  frameworkRoot: string;
  logger: AgentLogger;
}

/** Base class giving every agent a name + scoped logger. */
export abstract class Agent<TInput, TOutput> {
  abstract readonly name: string;
  protected readonly ctx: AgentContext;
  protected readonly log: AgentLogger;

  constructor(ctx: AgentContext, name: string) {
    this.ctx = ctx;
    this.log = ctx.logger.child(name);
  }

  abstract run(input: TInput): Promise<TOutput> | TOutput;
}

// ---- Per-agent I/O contracts ----------------------------------------------

export interface PlannerPlan {
  method: string;
  path: string;
  baseUrl: string;
  expectedStatus: number;
  authNote: string;
  /** Assertions the plan mandates the generator to emit. */
  plannedAssertions: GeneratedAssertion[];
  dependencies: string[];
}

export interface GeneratorOutput {
  specFileAbs: string;
  specFileRel: string;
  source: string;
  script: GeneratedScript;
  assertions: GeneratedAssertion[];
}

export interface RunnerOutput {
  passed: boolean;
  exitCode: number;
  testCases: GeneratedTestCase[];
  durationMs: number;
}

export interface HealerOutput {
  attempted: boolean;
  healed: boolean;
  detail: string;
}

export type { ValidationResult, CustomApi, PipelinePhaseId, PhaseStatus };
