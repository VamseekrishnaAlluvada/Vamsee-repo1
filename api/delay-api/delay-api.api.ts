import type { APIResponse } from '@playwright/test';
import { BaseApi } from '../base.api';

/**
 * DelayApi — service object for the "delay-api" endpoints.
 *
 * One method per distinct request. Specs call these methods and assert on the
 * response; the URL, headers and payload live here and nowhere else.
 */
export class DelayApi extends BaseApi {
  /** GET https://httpbin.org/delay/2 */
  async verifyGETDelay2Returns200WithAJSONContent(): Promise<APIResponse> {
    return this.send("GET", "https://httpbin.org/delay/2", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://httpbin.org/delay/abc */
  async rejectGETDelayAbcWithA404WhenTheDelaySegment(): Promise<APIResponse> {
    return this.send("GET", "https://httpbin.org/delay/abc", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://httpbin.org/delay/2?foo=bar */
  async confirmGETDelay2IgnoresAnUnknownQuery(): Promise<APIResponse> {
    return this.send("GET", "https://httpbin.org/delay/2?foo=bar", {
      headers: {"Accept":"application/json"},
    });
  }
}
