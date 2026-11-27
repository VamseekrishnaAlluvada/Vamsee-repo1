import type { APIResponse } from '@playwright/test';
import { BaseApi } from '../base.api';

/**
 * PostsApi — service object for the "posts-api" endpoints.
 *
 * One method per distinct request. Specs call these methods and assert on the
 * response; the URL, headers and payload live here and nowhere else.
 */
export class PostsApi extends BaseApi {
  /** GET https://jsonplaceholder.typicode.com/posts */
  async verifyGETPostsReturns200WithANonEmptyJSON(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/posts", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/posts?userId=1 */
  async verifyGETPostsFilteredByUserId1Returns200(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/posts?userId=1", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/posts?userId=99999999 */
  async verifyGETPostsWithUserId99999999Returns200(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/posts?userId=99999999", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/posts?foo=bar */
  async verifyGETPostsWithAnUnknownQueryParameterIs(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/posts?foo=bar", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/posts?userId=abc */
  async verifyGETPostsWithANonNumericUserIdValue(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/posts?userId=abc", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/posts/99999999 */
  async verifyGETPosts99999999ForANonExistentPost(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/posts/99999999", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/posts/abc */
  async verifyGETPostsAbcWithANonNumericIdDoesNot(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/posts/abc", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/posts/0 */
  async verifyGETPosts0WithAZeroIdReturns404WithoutA(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/posts/0", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/posts/-1 */
  async verifyGETPosts1WithANegativeIdReturns404(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/posts/-1", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/posts/99999999999 */
  async verifyGETPosts99999999999WithAnOversizedId(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/posts/99999999999", {
      headers: {"Accept":"application/json"},
    });
  }

  /** DELETE https://jsonplaceholder.typicode.com/posts */
  async verifyDELETEPostsAgainstTheCollectionURLIs(): Promise<APIResponse> {
    return this.send("DELETE", "https://jsonplaceholder.typicode.com/posts", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/posts/ */
  async verifyGETPostsWithATrailingSlashDoesNot(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/posts/", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/posts?userId=1%20OR%201%3D1 */
  async verifyGETPostsWithASQLInjectionShapedUserId(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/posts?userId=1%20OR%201%3D1", {
      headers: {"Accept":"application/json"},
    });
  }
}
