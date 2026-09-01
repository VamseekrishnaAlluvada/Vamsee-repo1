/**
 * ValidatorAgent — the pipeline checkpoint.
 *
 * Decides whether an entered/imported API is valid:
 *   1. Structural checks (name, supported method, well-formed URL, valid JSON body).
 *   2. Reachability probe: ANY HTTP response (even 4xx/5xx) proves the endpoint
 *      is a real API. A network error / timeout means NOT valid.
 *
 * A failed validation short-circuits the whole pipeline.
 */

import { Agent, AgentContext, ValidationResult } from './types';
import { resolveApiUrl, SUPPORTED_METHODS, hasRequestBody } from './util';
import type { CustomApi } from '../../src/types';

const PROBE_TIMEOUT_MS = 8000;

export class ValidatorAgent extends Agent<CustomApi, ValidationResult> {
  readonly name = 'validator';

  constructor(ctx: AgentContext) {
    super(ctx, 'validator');
  }

  async run(api: CustomApi): Promise<ValidationResult> {
    this.log.info('validating API', { name: api.name, method: api.method, path: api.path });

    if (!api.name?.trim()) return this.invalid('a name is required');
    if (!SUPPORTED_METHODS.includes(api.method)) {
      return this.invalid(`unsupported HTTP method "${api.method}"`);
    }
    if (!api.path?.trim()) return this.invalid('a path or URL is required');

    let url: URL;
    try {
      url = resolveApiUrl(api);
    } catch {
      return this.invalid('the base URL + path is not a well-formed URL');
    }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return this.invalid('only http and https protocols are supported');
    }

    const hasBody = hasRequestBody(api.method);
    if (hasBody && api.body?.trim()) {
      try {
        JSON.parse(api.body);
      } catch {
        return this.invalid('the request body is not valid JSON');
      }
    }

    // Reachability probe.
    const headers: Record<string, string> = {};
    for (const h of api.headers ?? []) if (h.key.trim()) headers[h.key] = h.value;
    if (api.auth === 'bearer' && api.bearerToken) headers['Authorization'] = `Bearer ${api.bearerToken}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
    const start = Date.now();
    try {
      const res = await fetch(url.toString(), {
        method: api.method,
        headers: hasBody ? { 'Content-Type': 'application/json', ...headers } : headers,
        body: hasBody && api.body?.trim() ? api.body : undefined,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const responseTimeMs = Date.now() - start;
      this.log.info('probe ok', { status: res.status, responseTimeMs });
      return {
        valid: true,
        reason: `Valid API — endpoint responded with HTTP ${res.status}`,
        status: res.status,
        url: url.toString(),
        responseTimeMs,
      };
    } catch (err) {
      clearTimeout(timeout);
      const isTimeout = (err as Error).name === 'AbortError';
      this.log.warn('probe failed', { error: (err as Error).message, isTimeout });
      return {
        valid: false,
        reason: isTimeout
          ? 'API is not valid: the endpoint did not respond within 8s (timeout)'
          : `API is not valid: the host is unreachable (${(err as Error).message})`,
        url: url.toString(),
      };
    }
  }

  private invalid(reason: string): ValidationResult {
    this.log.warn('structural check failed', { reason });
    return { valid: false, reason: `API is not valid: ${reason}` };
  }
}
