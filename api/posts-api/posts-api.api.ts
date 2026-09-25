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

  /** GET https://jsonplaceholder.typicode.com/posts/99999999 */
  async return404ForGETPosts99999999WhenTheRequested(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/posts/99999999", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/posts/abc */
  async rejectGETPostsAbcWithA4xxWhenANonNumericIdIs(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/posts/abc", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/posts?bogusParam=xyz */
  async confirmGETPostsIgnoresAnUnknownQuery(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/posts?bogusParam=xyz", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/posts/1 */
  async verifyGETPosts1Returns200WithANonEmptyJSON(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/posts/1", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/posts/not-a-number */
  async rejectGETPostsNotANumberWithA4xxWhenANon(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/posts/not-a-number", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/posts/1?foo=bar */
  async confirmGETPosts1IgnoresAnUnknownQuery(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/posts/1?foo=bar", {
      headers: {"Accept":"application/json"},
    });
  }

  /** POST https://jsonplaceholder.typicode.com/posts */
  async verifyPOSTPostsCreatesAResourceAndReturns200(): Promise<APIResponse> {
    return this.send("POST", "https://jsonplaceholder.typicode.com/posts", {
      headers: {"Content-Type":"application/json; charset=UTF-8","Accept":"application/json"},
      data: "{\"title\":\"QA Automation Post\",\"body\":\"Created from Postman collection\",\"userId\":1}",
    });
  }

  /** POST https://jsonplaceholder.typicode.com/posts */
  async rejectPOSTPostsWithA4xxWhenTheRequiredTitle(): Promise<APIResponse> {
    return this.send("POST", "https://jsonplaceholder.typicode.com/posts", {
      headers: {"Content-Type":"application/json; charset=UTF-8","Accept":"application/json"},
      data: "{\"body\":\"Created from Postman collection\",\"userId\":1}",
    });
  }

  /** POST https://jsonplaceholder.typicode.com/posts */
  async return400ForPOSTPostsWhenTheRequestBodyIs(): Promise<APIResponse> {
    return this.send("POST", "https://jsonplaceholder.typicode.com/posts", {
      headers: {"Content-Type":"application/json; charset=UTF-8","Accept":"application/json"},
      data: "{\"title\":\"QA Automation Post\",\"body\":\"Created from Postman collection\",\"userId\":1",
    });
  }

  /** POST https://jsonplaceholder.typicode.com/posts */
  async rejectPOSTPostsWithA4xxWhenUserIdIsAString(): Promise<APIResponse> {
    return this.send("POST", "https://jsonplaceholder.typicode.com/posts", {
      headers: {"Content-Type":"application/json; charset=UTF-8","Accept":"application/json"},
      data: "{\"title\":\"QA Automation Post\",\"body\":\"Created from Postman collection\",\"userId\":\"one\"}",
    });
  }

  /** PUT https://jsonplaceholder.typicode.com/posts/1 */
  async verifyPUTPosts1Returns200WithAJSONBodyWhen(): Promise<APIResponse> {
    return this.send("PUT", "https://jsonplaceholder.typicode.com/posts/1", {
      headers: {"Content-Type":"application/json; charset=UTF-8","Accept":"application/json"},
      data: "{\"id\":1,\"title\":\"Updated Title\",\"body\":\"Updated body\",\"userId\":1}",
    });
  }

  /** PUT https://jsonplaceholder.typicode.com/posts/1 */
  async rejectPUTPosts1WithA4xxWhenTheRequestBodyIs(): Promise<APIResponse> {
    return this.send("PUT", "https://jsonplaceholder.typicode.com/posts/1", {
      headers: {"Content-Type":"application/json; charset=UTF-8","Accept":"application/json"},
      data: "{\"id\":1,\"title\":\"Updated Title\",",
    });
  }

  /** PUT https://jsonplaceholder.typicode.com/posts/abc */
  async rejectPUTPosts1WithA4xxWhenANonNumericIdPath(): Promise<APIResponse> {
    return this.send("PUT", "https://jsonplaceholder.typicode.com/posts/abc", {
      headers: {"Content-Type":"application/json; charset=UTF-8","Accept":"application/json"},
      data: "{\"id\":1,\"title\":\"Updated Title\",\"body\":\"Updated body\",\"userId\":1}",
    });
  }

  /** PUT https://jsonplaceholder.typicode.com/posts/99999999 */
  async return404ForPUTPosts99999999WhenUpdatingA(): Promise<APIResponse> {
    return this.send("PUT", "https://jsonplaceholder.typicode.com/posts/99999999", {
      headers: {"Content-Type":"application/json; charset=UTF-8","Accept":"application/json"},
      data: "{\"id\":99999999,\"title\":\"Updated Title\",\"body\":\"Updated body\",\"userId\":1}",
    });
  }

  /** PATCH https://jsonplaceholder.typicode.com/posts/1 */
  async verifyPATCHPosts1WithAValidTitleReturns200(): Promise<APIResponse> {
    return this.send("PATCH", "https://jsonplaceholder.typicode.com/posts/1", {
      headers: {"Content-Type":"application/json; charset=UTF-8","Accept":"application/json"},
      data: "{\"title\": \"Patched Title\"}",
    });
  }

  /** PATCH https://jsonplaceholder.typicode.com/posts/1 */
  async rejectPATCHPosts1With400WhenTheRequestBodyIs(): Promise<APIResponse> {
    return this.send("PATCH", "https://jsonplaceholder.typicode.com/posts/1", {
      headers: {"Content-Type":"application/json; charset=UTF-8","Accept":"application/json"},
      data: "{\"title\": \"Patched Title\"",
    });
  }

  /** PATCH https://jsonplaceholder.typicode.com/posts/99999999 */
  async return404ForPATCHPosts99999999WhenTheTarget(): Promise<APIResponse> {
    return this.send("PATCH", "https://jsonplaceholder.typicode.com/posts/99999999", {
      headers: {"Content-Type":"application/json; charset=UTF-8","Accept":"application/json"},
      data: "{\"title\": \"Patched Title\"}",
    });
  }

  /** PATCH https://jsonplaceholder.typicode.com/posts/not-a-number */
  async rejectPATCHPostsNotANumberWithA4xxWhenTheId(): Promise<APIResponse> {
    return this.send("PATCH", "https://jsonplaceholder.typicode.com/posts/not-a-number", {
      headers: {"Content-Type":"application/json; charset=UTF-8","Accept":"application/json"},
      data: "{\"title\": \"Patched Title\"}",
    });
  }

  /** DELETE https://jsonplaceholder.typicode.com/posts/1 */
  async verifyDELETEPosts1Returns200AndAJSONContent(): Promise<APIResponse> {
    return this.send("DELETE", "https://jsonplaceholder.typicode.com/posts/1", {
      headers: {"Accept":"application/json"},
    });
  }

  /** DELETE https://jsonplaceholder.typicode.com/posts/99999999 */
  async returnANon2xxStatusForDELETEPosts99999999(): Promise<APIResponse> {
    return this.send("DELETE", "https://jsonplaceholder.typicode.com/posts/99999999", {
      headers: {"Accept":"application/json"},
    });
  }

  /** DELETE https://jsonplaceholder.typicode.com/posts/not-a-number */
  async rejectDELETEPostsNotANumberWithA4xxWhenANon(): Promise<APIResponse> {
    return this.send("DELETE", "https://jsonplaceholder.typicode.com/posts/not-a-number", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/posts/9999 */
  async verifyGETPosts9999Returns200WithAJSONContent(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/posts/9999", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/posts/9999?foo=bar */
  async confirmGETPosts9999IgnoresAnUnknownQuery(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/posts/9999?foo=bar", {
      headers: {"Accept":"application/json"},
    });
  }
}
