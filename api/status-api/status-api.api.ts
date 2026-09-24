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
  async verifyGETStatus500ReturnsTheConfigured200(): Promise<APIResponse> {
    return this.send("GET", "https://httpbin.org/status/500", {
      headers: {"Accept":"*/*"},
    });
  }

  /** GET https://httpbin.org/status/abc */
  async rejectGETStatusAbcWithA4xxWhenANonNumeric(): Promise<APIResponse> {
    return this.send("GET", "https://httpbin.org/status/abc", {
      headers: {"Accept":"*/*"},
    });
  }

  /** GET https://httpbin.org/status/99999999 */
  async returnANon2xxForGETStatus99999999WhenAnOutOf(): Promise<APIResponse> {
    return this.send("GET", "https://httpbin.org/status/99999999", {
      headers: {"Accept":"*/*"},
    });
  }
}
