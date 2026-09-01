/**
 * Reusable, typed API client wrapping Playwright's APIRequestContext.
 *
 * Responsibilities:
 *  - Throttling (per-worker rate limiting).
 *  - Auth injection (cookie token / basic) + automatic refresh & single retry on 401/403.
 *  - Contract validation on 2xx (via AJV) before the caller asserts.
 *  - Full request/response logging inside test.step, redacted, attached to Allure on failure.
 *  - Latency measurement for Allure trend reporting.
 *
 * MANDATE: no `any`. Callers parameterize the response type; validation guards the shape.
 */

import { APIRequestContext, test, TestInfo } from '@playwright/test';
import { Logger } from 'winston';
import { Throttle } from './throttle';
import { redact, redactHeaders, registerSecretValue } from './redact';
import { validateSchema } from './schema-validator';
import {
  ApiResponse,
  AuthStrategy,
  RequestOptions,
} from './types';

export interface AuthProvider {
  /** Return a valid token, fetching one if needed. */
  getToken(): Promise<string>;
  /** Force a fresh token (used after 401/403). */
  refreshToken(): Promise<string>;
  /** Basic-auth credentials for the `basic` strategy. */
  getBasicCredentials(): { username: string; password: string };
}

export interface ApiClientDeps {
  request: APIRequestContext;
  baseURL: string;
  logger: Logger;
  throttle: Throttle;
  auth: AuthProvider;
  testInfo: TestInfo;
}

export class ApiClient {
  constructor(private readonly deps: ApiClientDeps) {}

  // Typed verb helpers ------------------------------------------------------
  get<T>(path: string, opts: Partial<RequestOptions<never>> = {}): Promise<ApiResponse<T>> {
    return this.send<never, T>({ ...opts, method: 'GET', path });
  }

  post<TBody, T>(path: string, body: TBody, opts: Partial<RequestOptions<TBody>> = {}): Promise<ApiResponse<T>> {
    return this.send<TBody, T>({ ...opts, method: 'POST', path, body });
  }

  put<TBody, T>(path: string, body: TBody, opts: Partial<RequestOptions<TBody>> = {}): Promise<ApiResponse<T>> {
    return this.send<TBody, T>({ ...opts, method: 'PUT', path, body });
  }

  patch<TBody, T>(path: string, body: TBody, opts: Partial<RequestOptions<TBody>> = {}): Promise<ApiResponse<T>> {
    return this.send<TBody, T>({ ...opts, method: 'PATCH', path, body });
  }

  delete<T>(path: string, opts: Partial<RequestOptions<never>> = {}): Promise<ApiResponse<T>> {
    return this.send<never, T>({ ...opts, method: 'DELETE', path });
  }

  // Core --------------------------------------------------------------------
  private async send<TBody, TData>(
    options: RequestOptions<TBody>,
  ): Promise<ApiResponse<TData>> {
    const auth: AuthStrategy = options.auth ?? { kind: 'none' };
    // Always name the step with the endpoint (method + path) so traces, Allure,
    // and downstream tooling can attribute each step to a concrete request.
    // Any human-friendly stepLabel is appended after a separator.
    const label = options.stepLabel
      ? `${options.method} ${options.path} · ${options.stepLabel}`
      : `${options.method} ${options.path}`;

    return test.step(`API: ${label}`, async () => {
      // First attempt.
      let response = await this.execute<TBody, TData>(options, auth);

      // Auth refresh + single retry on 401 (spec) or 403 (restful-booker's form).
      const authFailed =
        (response.status === 401 || response.status === 403) &&
        auth.kind !== 'none' &&
        options.expectedStatus !== 401 &&
        options.expectedStatus !== 403;

      if (authFailed) {
        this.deps.logger.warn('Auth failure — refreshing token and retrying once', {
          status: response.status,
          path: options.path,
        });
        await this.deps.auth.refreshToken();
        response = await this.execute<TBody, TData>(options, auth);
      }

      // Contract validation on 2xx.
      if (
        response.ok &&
        !options.skipSchemaValidation &&
        options.responseSchema
      ) {
        const result = validateSchema(options.responseSchema, response.data);
        if (!result.valid) {
          const message =
            `[contract] Response for ${label} violates schema ` +
            `"${options.responseSchema}":\n  - ${result.errors.join('\n  - ')}`;
          await this.attach('schema-violation', message);
          this.deps.logger.error('Schema validation failed', {
            schema: options.responseSchema,
            errors: result.errors,
          });
          throw new Error(message);
        }
      }

      return response;
    });
  }

  private async execute<TBody, TData>(
    options: RequestOptions<TBody>,
    auth: AuthStrategy,
  ): Promise<ApiResponse<TData>> {
    await this.deps.throttle.gate();

    const headers = await this.buildHeaders(options.headers ?? {}, auth);
    const url = this.buildUrl(options.path, options.query);

    const start = Date.now();
    const res = await this.deps.request.fetch(url, {
      method: options.method,
      headers,
      data: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
    const durationMs = Date.now() - start;

    const rawBody = await res.text();
    const data = this.parseBody<TData>(rawBody);
    const respHeaders = res.headers();

    const logPayload = {
      method: options.method,
      url,
      requestHeaders: redactHeaders(headers),
      requestBody: options.body !== undefined ? redact(options.body) : undefined,
      status: res.status(),
      durationMs,
      responseHeaders: redactHeaders(respHeaders),
      responseBody: redact(data),
    };

    if (res.ok()) {
      this.deps.logger.info('request.ok', logPayload);
    } else {
      this.deps.logger.warn('request.non2xx', logPayload);
      // Attach full detail to Allure so failures are debuggable.
      await this.attach(
        `http-${res.status()}-${options.method}`,
        JSON.stringify(logPayload, null, 2),
      );
    }

    return {
      status: res.status(),
      ok: res.ok(),
      data,
      headers: respHeaders,
      durationMs,
      rawBody,
    };
  }

  private async buildHeaders(
    base: Record<string, string>,
    auth: AuthStrategy,
  ): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...base,
    };

    if (auth.kind === 'cookie') {
      const token = await this.deps.auth.getToken();
      registerSecretValue(token);
      headers['Cookie'] = `token=${token}`;
    } else if (auth.kind === 'basic') {
      const { username, password } = this.deps.auth.getBasicCredentials();
      registerSecretValue(password);
      const encoded = Buffer.from(`${username}:${password}`).toString('base64');
      headers['Authorization'] = `Basic ${encoded}`;
    }

    return headers;
  }

  private buildUrl(
    path: string,
    query?: Record<string, string | number | boolean | undefined>,
  ): string {
    const base = this.deps.baseURL.replace(/\/$/, '');
    // Allow absolute URLs (used by dashboard-generated custom-API specs) to pass
    // through untouched; otherwise resolve the path against the configured base.
    const isAbsolute = /^https?:\/\//i.test(path);
    const full = isAbsolute
      ? path
      : `${base}${path.startsWith('/') ? path : `/${path}`}`;
    if (!query) {
      return full;
    }
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined) {
        params.append(k, String(v));
      }
    }
    const qs = params.toString();
    return qs ? `${full}?${qs}` : full;
  }

  private parseBody<TData>(raw: string): TData {
    if (!raw) {
      return undefined as unknown as TData;
    }
    try {
      return JSON.parse(raw) as TData;
    } catch {
      // Non-JSON body (e.g. "Created", "Forbidden") — return as-is, typed by caller.
      return raw as unknown as TData;
    }
  }

  private async attach(name: string, content: string): Promise<void> {
    await this.deps.testInfo.attach(name, {
      body: content,
      contentType: 'application/json',
    });
  }
}
