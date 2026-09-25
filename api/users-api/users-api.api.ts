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
  async rejectGETUsersAbcWithA4xxWhenTheIdPath(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/users/abc", {
      headers: {"Accept":"application/json"},
    });
  }

  /** POST https://jsonplaceholder.typicode.com/users/1 */
  async return404ForPOSTUsers1WhenAnUnsupported(): Promise<APIResponse> {
    return this.send("POST", "https://jsonplaceholder.typicode.com/users/1", {
      headers: {"Accept":"application/json"},
    });
  }
}
