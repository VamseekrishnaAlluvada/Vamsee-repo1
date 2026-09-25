import type { APIResponse } from '@playwright/test';
import { BaseApi } from '../base.api';

/**
 * HeadersApi — service object for the "headers-api" endpoints.
 *
 * One method per distinct request. Specs call these methods and assert on the
 * response; the URL, headers and payload live here and nowhere else.
 */
export class HeadersApi extends BaseApi {
  /** GET https://httpbin.org/headers */
  async verifyGETHeadersReturns200WithAJSONContent(): Promise<APIResponse> {
    return this.send("GET", "https://httpbin.org/headers", {
      headers: {"X-QA-Team":"Automation","Accept":"application/json"},
    });
  }

  /** GET https://httpbin.org/headers?foo=bar&limit=9999 */
  async confirmGETHeadersIgnoresAnUnknownQuery(): Promise<APIResponse> {
    return this.send("GET", "https://httpbin.org/headers?foo=bar&limit=9999", {
      headers: {"X-QA-Team":"Automation","Accept":"application/json"},
    });
  }

  /** POST https://httpbin.org/headers */
  async rejectPOSTHeadersWith405BecauseTheEndpoint(): Promise<APIResponse> {
    return this.send("POST", "https://httpbin.org/headers", {
      headers: {"X-QA-Team":"Automation","Accept":"application/json"},
    });
  }
}
