/**
 * HealerAgent — on a failed run, invokes the framework's self-healing engine
 * (`npm run heal`), which classifies the failure, applies a bounded patch
 * (max 2 attempts) and re-runs. Reports whether the run recovered to green.
 */

import { Agent, AgentContext, HealerOutput, RunnerOutput } from './types';
import { NPM, spawnInFramework } from './process';

export class HealerAgent extends Agent<{ runner: RunnerOutput }, HealerOutput> {
  readonly name = 'healer';

  constructor(ctx: AgentContext) {
    super(ctx, 'healer');
  }

  async run({ runner }: { runner: RunnerOutput }): Promise<HealerOutput> {
    if (runner.passed) {
      this.log.info('nothing to heal');
      return { attempted: false, healed: false, detail: 'no failures to heal' };
    }
    this.log.warn('attempting self-heal', { exitCode: runner.exitCode });
    const code = await spawnInFramework(NPM, ['run', 'heal'], this.ctx.frameworkRoot);
    const healed = code === 0;
    this.log.info('heal complete', { healed });
    return {
      attempted: true,
      healed,
      detail: healed ? 'recovered — see healing-report.md' : 'escalated to on-call',
    };
  }
}
