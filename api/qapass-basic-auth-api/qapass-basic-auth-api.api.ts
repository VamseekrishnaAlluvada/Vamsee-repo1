import type { APIResponse } from '@playwright/test';
import { BaseApi } from '../base.api';

/**
 * QapassBasicAuthApi — service object for the "qapass-basic-auth-api" endpoints.
 *
 * One method per distinct request. Specs call these methods and assert on the
 * response; the URL, headers and payload live here and nowhere else.
 */
export class QapassBasicAuthApi extends BaseApi {
  /** GET https://httpbin.org/basic-auth/qauser/qapass */
  async verifyGETBasicAuthQauserQapassReturns200With(): Promise<APIResponse> {
    return this.send("GET", "https://httpbin.org/basic-auth/qauser/qapass", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://httpbin.org/basic-auth/qauser/wrongpass */
  async return401ForGETBasicAuthQauserWrongpassWhen(): Promise<APIResponse> {
    return this.send("GET", "https://httpbin.org/basic-auth/qauser/wrongpass", {
      headers: {"Accept":"application/json"},
    });
  }

  /** POST https://httpbin.org/basic-auth/qauser/qapass */
  async rejectPOSTBasicAuthQauserQapassWithA4xx405(): Promise<APIResponse> {
    return this.send("POST", "https://httpbin.org/basic-auth/qauser/qapass", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://httpbin.org/basic-auth/qauser/qapass?foo=bar */
  async confirmGETBasicAuthQauserQapassIgnoresAn(): Promise<APIResponse> {
    return this.send("GET", "https://httpbin.org/basic-auth/qauser/qapass?foo=bar", {
      headers: {"Accept":"application/json"},
    });
  }
}
