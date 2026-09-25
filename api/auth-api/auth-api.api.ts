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
  async confirmPOSTAuthWithAnInvalidPasswordReturns(): Promise<APIResponse> {
    return this.send("POST", "https://restful-booker.herokuapp.com/auth", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"username\":\"admin\",\"password\":\"wrong-password\"}",
    });
  }

  /** POST https://restful-booker.herokuapp.com/auth */
  async rejectPOSTAuthWithAMalformedJSONBodyBy(): Promise<APIResponse> {
    return this.send("POST", "https://restful-booker.herokuapp.com/auth", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"username\":\"admin\",\"password\":}",
    });
  }

  /** POST https://restful-booker.herokuapp.com/auth */
  async confirmPOSTAuthWithThePasswordFieldOmitted(): Promise<APIResponse> {
    return this.send("POST", "https://restful-booker.herokuapp.com/auth", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"username\":\"admin\"}",
    });
  }

  /** GET https://restful-booker.herokuapp.com/auth */
  async rejectAGETRequestAgainstPOSTOnlyAuthWithA404(): Promise<APIResponse> {
    return this.send("GET", "https://restful-booker.herokuapp.com/auth", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
    });
  }
}
