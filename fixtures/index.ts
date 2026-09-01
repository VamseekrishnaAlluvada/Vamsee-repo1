/**
 * Custom Playwright fixtures — the ONLY sanctioned way to share state.
 *
 * MANDATE: fixtures over globals. No beforeAll cross-test state.
 *
 * Scopes:
 *   worker  -> appConfig, workerRequestContext, authProvider   (one auth per worker)
 *   test    -> testLogger, testDataContext, apiClient           (fully isolated per test)
 *
 * Teardown of testDataContext performs reverse-order (LIFO) cleanup of every
 * resource the test created, so shards never leak data into each other.
 */

import {
  test as base,
  APIRequestContext,
  request as playwrightRequest,
} from '@playwright/test';
import { Logger } from 'winston';

import { AppConfig, getConfig } from '../config/env';
import { ApiClient } from '../lib/api-client';
import { BookerAuthProvider } from '../lib/auth-provider';
import { createTestLogger } from '../lib/logger';
import { Throttle } from '../lib/throttle';
import { TestDataContext } from '../lib/test-data-context';
import { AuthService, BookingService, PingService } from '../lib/services';

interface WorkerFixtures {
  appConfig: AppConfig;
  workerRequestContext: APIRequestContext;
  authProvider: BookerAuthProvider;
  throttle: Throttle;
}

interface TestFixtures {
  testLogger: Logger;
  testDataContext: TestDataContext;
  apiClient: ApiClient;
  /** Convenience: a ready-to-use auth token for tests that need it directly. */
  authToken: string;
  // ---- Service Object Model (POM) — one endpoint object per resource -------
  pingService: PingService;
  authService: AuthService;
  bookingService: BookingService;
}

export const test = base.extend<TestFixtures, WorkerFixtures>({
  // ---- Worker-scoped ------------------------------------------------------
  appConfig: [
    async ({}, use) => {
      await use(getConfig());
    },
    { scope: 'worker' },
  ],

  throttle: [
    async ({ appConfig }, use) => {
      await use(new Throttle(appConfig.throttle.minIntervalMs));
    },
    { scope: 'worker' },
  ],

  workerRequestContext: [
    async ({ appConfig }, use) => {
      const ctx = await playwrightRequest.newContext({
        baseURL: appConfig.env.baseURL,
      });
      await use(ctx);
      await ctx.dispose();
    },
    { scope: 'worker' },
  ],

  authProvider: [
    async ({ appConfig, workerRequestContext }, use, workerInfo) => {
      const logger = createTestLogger({
        testId: `worker-${workerInfo.workerIndex}-auth`,
        worker: workerInfo.workerIndex,
        env: appConfig.env.name,
      });
      const provider = new BookerAuthProvider(
        workerRequestContext,
        appConfig.env.baseURL,
        appConfig.credentials,
        logger,
      );
      await use(provider);
    },
    { scope: 'worker' },
  ],

  // ---- Test-scoped --------------------------------------------------------
  testLogger: async ({ appConfig }, use, testInfo) => {
    const logger = createTestLogger({
      testId: testInfo.testId,
      worker: testInfo.workerIndex,
      env: appConfig.env.name,
    });
    logger.info('test.start', { title: testInfo.title });
    await use(logger);
    logger.info('test.end', {
      title: testInfo.title,
      status: testInfo.status,
      durationMs: testInfo.duration,
    });
  },

  apiClient: async (
    { request, appConfig, testLogger, throttle, authProvider },
    use,
    testInfo,
  ) => {
    const client = new ApiClient({
      request,
      baseURL: appConfig.env.baseURL,
      logger: testLogger,
      throttle,
      auth: authProvider,
      testInfo,
    });
    await use(client);
  },

  testDataContext: async ({ apiClient, testLogger }, use) => {
    const context = new TestDataContext(testLogger);

    await use(context);

    // ---- Reverse-order cleanup (LIFO) via the BookingService (POM) ----------
    const bookingService = new BookingService(apiClient);
    const toDelete = context.drain();
    for (const resource of toDelete) {
      if (resource.kind !== 'booking') {
        continue;
      }
      try {
        const res = await bookingService.remove(resource.id, {
          stepLabel: `cleanup DELETE booking ${resource.id}`,
        });
        testLogger.info('cleanup.deleted', {
          id: resource.id,
          status: res.status,
        });
      } catch (err) {
        // Cleanup failures must not fail the test, but must be visible.
        testLogger.warn('cleanup.failed', {
          id: resource.id,
          error: (err as Error).message,
        });
      }
    }
    context.clear();
  },

  authToken: async ({ authProvider }, use) => {
    const token = await authProvider.getToken();
    await use(token);
  },

  // ---- Service Object Model fixtures (test-scoped, wrap apiClient) ---------
  pingService: async ({ apiClient }, use) => {
    await use(new PingService(apiClient));
  },

  authService: async ({ apiClient }, use) => {
    await use(new AuthService(apiClient));
  },

  bookingService: async ({ apiClient }, use) => {
    await use(new BookingService(apiClient));
  },
});

export const expect = test.expect;
export { TestDataContext } from '../lib/test-data-context';
