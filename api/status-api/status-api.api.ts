import type { APIResponse } from '@playwright/test';
import { BaseApi } from '../base.api';

/**
 * StatusApi — service object for the "status-api" endpoints.
 *
 * One method per distinct request. Specs call these methods and assert on the
 * response; the URL, headers and payload live here and nowhere else.
 */
export class StatusApi extends BaseApi {
  /** GET https://httpbin.org/status/500 */
  async verifyGETStatus500Returns200AsTheConfigured(): Promise<APIResponse> {
    return this.send("GET", "https://httpbin.org/status/500", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://httpbin.org/status/99999999 */
  async rejectGETStatus99999999WithANon2xxStatusFor(): Promise<APIResponse> {
    return this.send("GET", "https://httpbin.org/status/99999999", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://httpbin.org/status/abc */
  async rejectGETStatusAbcWithA4xxWhenTheStatusCode(): Promise<APIResponse> {
    return this.send("GET", "https://httpbin.org/status/abc", {
      headers: {"Accept":"application/json"},
    });
  }
}
