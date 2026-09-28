import type { APIResponse } from '@playwright/test';
import { BaseApi } from '../base.api';

/**
 * UsersApi — service object for the "users-api" endpoints.
 *
 * One method per distinct request. Specs call these methods and assert on the
 * response; the URL, headers and payload live here and nowhere else.
 */
export class UsersApi extends BaseApi {
  /** GET https://jsonplaceholder.typicode.com/users/1 */
  async verifyGETUsers1Returns200WithANonEmptyJSON(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/users/1", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/users/99999999 */
  async return404ForGETUsers99999999WhenTheUserId(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/users/99999999", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/users/abc */
  async rejectGETUsersAbcWithA4xxWhenTheIdIsNon(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/users/abc", {
      headers: {"Accept":"application/json"},
    });
  }

  /** POST https://jsonplaceholder.typicode.com/users/1 */
  async rejectPOSTUsers1WithA4xx405WhenUsingAn(): Promise<APIResponse> {
    return this.send("POST", "https://jsonplaceholder.typicode.com/users/1", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/users/1?foo=bar */
  async confirmGETUsers1IgnoresAnUnknownQuery(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/users/1?foo=bar", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/users/10 */
  async verifyGETUsers10Returns200ForTheHighestValid(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/users/10", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/users/0 */
  async return404ForGETUsers0WhenTheIdIsBelowThe(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/users/0", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/users/-1 */
  async rejectGETUsers1WithA4xx404WhenTheIdIs(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/users/-1", {
      headers: {"Accept":"application/json"},
    });
  }
}
