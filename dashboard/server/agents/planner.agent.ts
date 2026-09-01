/**
 * PlannerAgent — analyses a validated API and produces an execution plan:
 * the endpoint, auth strategy, expected status and the set of assertions the
 * Generator must emit. (Status-only assertion policy, per framework config.)
 */

import { Agent, AgentContext, PlannerPlan } from './types';
import { absoluteUrl } from './util';
import type { CustomApi, GeneratedAssertion } from '../../src/types';

export class PlannerAgent extends Agent<CustomApi, PlannerPlan> {
  readonly name = 'planner';

  constructor(ctx: AgentContext) {
    super(ctx, 'planner');
  }

  run(api: CustomApi): PlannerPlan {
    const authNote = api.auth === 'none' ? 'no auth' : `${api.auth} auth`;
    const plannedAssertions: GeneratedAssertion[] = [
      { label: `response status === ${api.expectedStatus}`, kind: 'status' },
    ];
    const dependencies = api.auth !== 'none' ? ['auth-token'] : [];

    this.log.info('planned', {
      endpoint: `${api.method} ${api.path}`,
      expectedStatus: api.expectedStatus,
      authNote,
      assertions: plannedAssertions.length,
    });

    return {
      method: api.method,
      path: api.path,
      baseUrl: api.baseUrl,
      expectedStatus: api.expectedStatus,
      authNote,
      plannedAssertions,
      dependencies,
    };
  }

  /** Convenience: the absolute URL the plan targets. */
  targetUrl(api: CustomApi): string {
    return absoluteUrl(api);
  }
}
