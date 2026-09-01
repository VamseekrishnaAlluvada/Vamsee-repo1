/**
 * BaseService — the root of the Page Object Model (Service Object Model) layer.
 *
 * In an API framework the "page object" is a *service object*: one class per
 * REST resource that encapsulates every request against that resource, hiding
 * paths, verbs, auth strategy and step labels behind intention-revealing
 * methods. Tests talk to services, never to raw URLs — the same discipline a
 * UI POM enforces for selectors.
 *
 * MANDATE: no `any`. Callers get fully-typed `ApiResponse<T>` back. All shared
 * request plumbing (throttle, auth, contract validation, logging) lives in the
 * injected {@link ApiClient}; services only describe *what* to call.
 */

import { ApiClient } from '../api-client';
import { ApiResponse, AuthStrategy } from '../types';

/** Per-call overrides a service method exposes to tests (e.g. negative cases). */
export interface ServiceCallOptions {
  /** Override the auth strategy for this single call. */
  auth?: AuthStrategy;
  /** Override the expected happy-path status (drives logging + schema gating). */
  expectedStatus?: number;
  /** Skip automatic OpenAPI schema validation (negative / non-JSON responses). */
  skipSchemaValidation?: boolean;
  /** Extra headers merged over the service defaults. */
  headers?: Record<string, string>;
  /** Override / extend the human-friendly step label. */
  stepLabel?: string;
}

export abstract class BaseService {
  /** Absolute or base-relative resource root, e.g. `/booking`. */
  protected abstract readonly resource: string;

  constructor(protected readonly client: ApiClient) {}

  /** Build the resource path, optionally with an id or sub-path suffix. */
  protected path(suffix?: string | number): string {
    if (suffix === undefined || suffix === '') return this.resource;
    const s = String(suffix);
    return s.startsWith('/') ? `${this.resource}${s}` : `${this.resource}/${s}`;
  }

  /** Expose the raw client for advanced/edge scenarios (kept typed). */
  get raw(): ApiClient {
    return this.client;
  }

  /** Re-export for consumers that only import the service. */
  protected asResponse<T>(res: ApiResponse<T>): ApiResponse<T> {
    return res;
  }
}
