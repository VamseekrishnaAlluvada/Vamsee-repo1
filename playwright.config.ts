import { defineConfig } from '@playwright/test';
import { getConfig } from './config/env';

/**
 * Loads the singleton config so the base URL / env are resolved once.
 * Secrets come from process.env (vault in CI, .env locally).
 */
const app = getConfig();

export default defineConfig({
  testDir: './tests/api',
  // Every test is designed to be isolated -> safe to fully parallelize.
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Zero-flake posture: retry transient failures; the healer handles the rest.
  retries: process.env.CI ? 2 : 1,
  // 8 shards in CI; locally use available cores.
  workers: process.env.CI ? 8 : undefined,
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  globalSetup: undefined,
  use: {
    baseURL: app.env.baseURL,
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
    trace: 'retain-on-failure',
    // API-only project; no browser context needed.
    ignoreHTTPSErrors: false,
  },
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results/test-results.json' }],
    ['allure-playwright', { resultsDir: 'allure-results', detail: true }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  projects: [
    {
      name: 'api',
      testMatch: /.*\.spec\.ts/,
    },
  ],
});
