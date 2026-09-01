/**
 * Child-process helper for agents that shell out to the framework (Playwright,
 * healer). Captures the exit code; stdio is inherited-silent by default.
 */

import { spawn } from 'node:child_process';

const IS_WIN = process.platform === 'win32';
export const NPX = IS_WIN ? 'npx.cmd' : 'npx';
export const NPM = IS_WIN ? 'npm.cmd' : 'npm';

export function spawnInFramework(cmd: string, args: string[], cwd: string): Promise<number> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, {
      cwd,
      shell: IS_WIN,
      stdio: 'ignore',
      env: {
        ...process.env,
        TEST_ENV: process.env.TEST_ENV ?? 'dev',
        BOOKER_USERNAME: process.env.BOOKER_USERNAME ?? 'admin',
        BOOKER_PASSWORD: process.env.BOOKER_PASSWORD ?? 'password123',
        REQUEST_MIN_INTERVAL_MS: process.env.REQUEST_MIN_INTERVAL_MS ?? '100',
      },
    });
    child.on('close', (code) => resolve(code ?? 1));
    child.on('error', () => resolve(1));
  });
}
