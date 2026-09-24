import type { APIResponse } from '@playwright/test';
import { BaseApi } from '../base.api';

/**
 * AuthMeApi — service object for the "auth-me-api" endpoints.
 *
 * One method per distinct request. Specs call these methods and assert on the
 * response; the URL, headers and payload live here and nowhere else.
 */
export class AuthMeApi extends BaseApi {
  /** GET https://dummyjson.com/auth/me */
  async verifyGETAuthMeReturns200WithANonEmptyJSON(): Promise<APIResponse> {
    return this.send("GET", "https://dummyjson.com/auth/me", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://dummyjson.com/auth/me?foo=bar */
  async confirmGETAuthMeIgnoresAnUnknownQuery(): Promise<APIResponse> {
    return this.send("GET", "https://dummyjson.com/auth/me?foo=bar", {
      headers: {"Accept":"application/json"},
    });
  }

  /** POST https://dummyjson.com/auth/me */
  async rejectPOSTAuthMeWithANon2xxStatusBecauseOnly(): Promise<APIResponse> {
    return this.send("POST", "https://dummyjson.com/auth/me", {
      headers: {"Accept":"application/json"},
    });
  }
}
