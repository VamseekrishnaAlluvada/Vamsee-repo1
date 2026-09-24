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
  async verifyGETHttpsHttpbinOrgDelay2Returns200With(): Promise<APIResponse> {
    return this.send("GET", "https://httpbin.org/delay/2", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://httpbin.org/delay/2?foo=bar */
  async confirmGETHttpsHttpbinOrgDelay2IgnoresAn(): Promise<APIResponse> {
    return this.send("GET", "https://httpbin.org/delay/2?foo=bar", {
      headers: {"Accept":"application/json"},
    });
  }

  /** POST https://httpbin.org/delay/2 */
  async rejectPOSTHttpsHttpbinOrgDelay2WithA405When(): Promise<APIResponse> {
    return this.send("POST", "https://httpbin.org/delay/2", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://httpbin.org/delay/abc */
  async rejectGETHttpsHttpbinOrgDelayAbcWithA4xxWhen(): Promise<APIResponse> {
    return this.send("GET", "https://httpbin.org/delay/abc", {
      headers: {"Accept":"application/json"},
    });
  }
}
