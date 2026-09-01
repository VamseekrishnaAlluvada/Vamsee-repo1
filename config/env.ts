/**
 * Singleton configuration loader.
 *
 * - Selects the active environment (dev/staging/prod) from TEST_ENV.
 * - Pulls all secrets exclusively from process.env (vault-injected in CI).
 * - Fails fast with a clear message if a required secret is missing.
 * - Exposes an immutable, fully-typed config object.
 */

import { ENVIRONMENTS, EnvName, EnvironmentDefinition } from './environments';

export interface AppConfig {
  readonly env: EnvironmentDefinition;
  readonly credentials: {
    readonly username: string;
    readonly password: string;
  };
  readonly throttle: {
    /** Minimum ms between outgoing requests per worker. */
    readonly minIntervalMs: number;
  };
  readonly logLevel: string;
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (value === undefined || value.trim() === '') {
    throw new Error(
      `[config] Required secret "${key}" is not set. ` +
        `In CI, inject it from the secret vault; locally, set it in .env.`,
    );
  }
  return value;
}

function resolveEnvName(): EnvName {
  const raw = (process.env.TEST_ENV ?? 'dev').toLowerCase();
  if (raw === 'dev' || raw === 'staging' || raw === 'prod') {
    return raw;
  }
  throw new Error(`[config] Invalid TEST_ENV="${raw}". Expected dev | staging | prod.`);
}

class ConfigLoader {
  private static instance: AppConfig | undefined;

  static get(): AppConfig {
    if (ConfigLoader.instance) {
      return ConfigLoader.instance;
    }

    const envName = resolveEnvName();
    const config: AppConfig = Object.freeze({
      env: ENVIRONMENTS[envName],
      credentials: Object.freeze({
        username: requireEnv('BOOKER_USERNAME'),
        password: requireEnv('BOOKER_PASSWORD'),
      }),
      throttle: Object.freeze({
        minIntervalMs: Number(process.env.REQUEST_MIN_INTERVAL_MS ?? '150'),
      }),
      logLevel: process.env.LOG_LEVEL ?? 'info',
    });

    ConfigLoader.instance = config;
    return config;
  }

  /** For tests of the loader itself; not used in normal flow. */
  static reset(): void {
    ConfigLoader.instance = undefined;
  }
}

export const getConfig = (): AppConfig => ConfigLoader.get();
export const resetConfig = (): void => ConfigLoader.reset();
