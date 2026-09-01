/**
 * CI/CD pipeline hook.
 *
 * 1. Run the full suite with json + allure reporters.
 * 2. If exit code == 0 -> done.
 * 3. If exit code != 0 -> trigger the Healer (max 2 attempts, internal).
 * 4. If the Healer cannot make it pass -> abort with non-zero and leave
 *    healing-report.md for the on-call notification step.
 */

import { spawnSync } from 'child_process';
import * as path from 'path';
import { runHealing } from '../healer/healer';

const ROOT = process.cwd();

function runTests(): number {
  const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const result = spawnSync(
    npx,
    ['playwright', 'test', '--reporter=list,json,allure-playwright'],
    { stdio: 'inherit', cwd: ROOT, shell: process.platform === 'win32', env: { ...process.env } },
  );
  return result.status ?? 1;
}

function main(): void {
  console.log('[pipeline] Running Playwright suite...');
  const testExit = runTests();

  if (testExit === 0) {
    console.log('[pipeline] ✅ All tests passed on first run.');
    process.exit(0);
  }

  console.warn(`[pipeline] ❌ Tests failed (exit ${testExit}). Triggering Healer...`);
  const healExit = runHealing({ rerun: true });

  if (healExit === 0) {
    console.log('[pipeline] ✅ Healer resolved the failures. See healing-report.md.');
    process.exit(0);
  }

  console.error(
    `[pipeline] 🚨 Healer failed after max attempts. ` +
      `Aborting pipeline. Notify on-call with ${path.join(ROOT, 'healing-report.md')}.`,
  );
  process.exit(healExit);
}

main();
