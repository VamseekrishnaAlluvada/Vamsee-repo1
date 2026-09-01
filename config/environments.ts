/**
 * Static, non-secret environment topology.
 * Secrets (credentials) are NEVER stored here — they come from process.env,
 * which in CI is populated by the secret vault.
 */

export type EnvName = 'dev' | 'staging' | 'prod';

export interface EnvironmentDefinition {
  readonly name: EnvName;
  readonly baseURL: string;
  /** Path used by the healer for endpoint-version drift detection (v1 -> v2). */
  readonly apiVersionPrefix: string;
}

export const ENVIRONMENTS: Readonly<Record<EnvName, EnvironmentDefinition>> = {
  dev: {
    name: 'dev',
    baseURL: process.env.BASE_URL_DEV ?? 'https://restful-booker.herokuapp.com',
    apiVersionPrefix: '',
  },
  staging: {
    name: 'staging',
    baseURL: process.env.BASE_URL_STAGING ?? 'https://restful-booker.herokuapp.com',
    apiVersionPrefix: '',
  },
  prod: {
    name: 'prod',
    baseURL: process.env.BASE_URL_PROD ?? 'https://restful-booker.herokuapp.com',
    apiVersionPrefix: '',
  },
} as const;
