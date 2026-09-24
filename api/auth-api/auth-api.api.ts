import type { APIResponse } from '@playwright/test';
import { BaseApi } from '../base.api';

/**
 * AuthApi — service object for the "auth-api" endpoints.
 *
 * One method per distinct request. Specs call these methods and assert on the
 * response; the URL, headers and payload live here and nowhere else.
 */
export class AuthApi extends BaseApi {
  /** POST https://restful-booker.herokuapp.com/auth */
  async verifyPOSTAuthWithValidAdminCredentials(): Promise<APIResponse> {
    return this.send("POST", "https://restful-booker.herokuapp.com/auth", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"username\":\"admin\",\"password\":\"password123\"}",
    });
  }

  /** POST https://restful-booker.herokuapp.com/auth */
  async rejectPOSTAuthWithA4xxWhenTheRequired(): Promise<APIResponse> {
    return this.send("POST", "https://restful-booker.herokuapp.com/auth", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"username\":\"admin\"}",
    });
  }

  /** POST https://restful-booker.herokuapp.com/auth */
  async return400ForPOSTAuthWhenTheRequestBodyIs(): Promise<APIResponse> {
    return this.send("POST", "https://restful-booker.herokuapp.com/auth", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"username\":\"admin\",\"password\":}",
    });
  }

  /** POST https://restful-booker.herokuapp.com/auth */
  async rejectPOSTAuthWithA4xxWhenSubmittingInvalid(): Promise<APIResponse> {
    return this.send("POST", "https://restful-booker.herokuapp.com/auth", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"username\":\"wronguser\",\"password\":\"wrongpass\"}",
    });
  }
}
