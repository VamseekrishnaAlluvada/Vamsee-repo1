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
  async verifyGETUsers1Returns200WithAJSONContent(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/users/1", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/users/99999999 */
  async return404ForGETUsers99999999WhenTheRequested(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/users/99999999", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/users/abc */
  async rejectGETUsersAbcWithA4xxWhenANonNumericIdIs(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/users/abc", {
      headers: {"Accept":"application/json"},
    });
  }

  /** POST https://jsonplaceholder.typicode.com/users/1 */
  async rejectPOSTUsers1WithA4xx405SinceTheResource(): Promise<APIResponse> {
    return this.send("POST", "https://jsonplaceholder.typicode.com/users/1", {
      headers: {"Accept":"application/json"},
    });
  }

  /** DELETE https://jsonplaceholder.typicode.com/users */
  async rejectDELETEAgainstTheUsersCollectionUsers(): Promise<APIResponse> {
    return this.send("DELETE", "https://jsonplaceholder.typicode.com/users", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/users/1?foo=bar */
  async confirmGETUsers1IgnoresAnUnknownQuery(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/users/1?foo=bar", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/users/1/ */
  async confirmGETUsers1WithATrailingSlashDoesNot(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/users/1/", {
      headers: {"Accept":"application/json"},
    });
  }
}
