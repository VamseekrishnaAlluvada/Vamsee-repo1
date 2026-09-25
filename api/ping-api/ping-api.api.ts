import type { APIResponse } from '@playwright/test';
import { BaseApi } from '../base.api';

/**
 * PingApi — service object for the "ping-api" endpoints.
 *
 * One method per distinct request. Specs call these methods and assert on the
 * response; the URL, headers and payload live here and nowhere else.
 */
export class PingApi extends BaseApi {
  /** GET https://restful-booker.herokuapp.com/ping */
  async verifyGETPingReturns200ConfirmingTheService(): Promise<APIResponse> {
    return this.send("GET", "https://restful-booker.herokuapp.com/ping", {
      headers: {"Accept":"*/*"},
    });
  }

  /** GET https://restful-booker.herokuapp.com/ping?foo=bar */
  async confirmGETPingIgnoresAnUnknownQueryParameter(): Promise<APIResponse> {
    return this.send("GET", "https://restful-booker.herokuapp.com/ping?foo=bar", {
      headers: {"Accept":"*/*"},
    });
  }

  /** POST https://restful-booker.herokuapp.com/ping */
  async rejectPOSTPingWithA4xx405BecauseTheHealth(): Promise<APIResponse> {
    return this.send("POST", "https://restful-booker.herokuapp.com/ping", {
      headers: {"Accept":"*/*"},
    });
  }
}
