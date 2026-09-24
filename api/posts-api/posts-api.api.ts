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
  async return404ForGETPosts99999999WhenThePostId(): Promise<APIResponse> {
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

  /** GET https://jsonplaceholder.typicode.com/posts/1 */
  async verifyGETPosts1Returns200WithANonEmptyJSON(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/posts/1", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/posts/not-a-number */
  async rejectGETPostsNotANumberWithA4xxWhenTheIdIs(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/posts/not-a-number", {
      headers: {"Accept":"application/json"},
    });
  }

  /** POST https://jsonplaceholder.typicode.com/posts/1 */
  async rejectDELETELessWriteViaPOSTPosts1WithA4xxAs(): Promise<APIResponse> {
    return this.send("POST", "https://jsonplaceholder.typicode.com/posts/1", {
      headers: {"Accept":"application/json","Content-Type":"application/json"},
      data: "{}",
    });
  }

  /** POST https://jsonplaceholder.typicode.com/posts */
  async verifyPOSTPostsWithTheDocumentedBodyReturns(): Promise<APIResponse> {
    return this.send("POST", "https://jsonplaceholder.typicode.com/posts", {
      headers: {"Content-Type":"application/json; charset=UTF-8","Accept":"application/json"},
      data: "{\"title\":\"QA Automation Post\",\"body\":\"Created from Postman collection\",\"userId\":1}",
    });
  }

  /** POST https://jsonplaceholder.typicode.com/posts */
  async rejectPOSTPostsRequestThatOmitsTheRequired(): Promise<APIResponse> {
    return this.send("POST", "https://jsonplaceholder.typicode.com/posts", {
      headers: {"Content-Type":"application/json; charset=UTF-8","Accept":"application/json"},
      data: "{\"body\":\"Created from Postman collection\",\"userId\":1}",
    });
  }

  /** POST https://jsonplaceholder.typicode.com/posts */
  async rejectPOSTPostsWithA4xxWhenTheRequestBodyIs(): Promise<APIResponse> {
    return this.send("POST", "https://jsonplaceholder.typicode.com/posts", {
      headers: {"Content-Type":"application/json; charset=UTF-8","Accept":"application/json"},
      data: "{\"title\":\"QA Automation Post\",\"body\":\"broken\",\"userId\":1",
    });
  }

  /** DELETE https://jsonplaceholder.typicode.com/posts */
  async rejectDELETEAgainstPOSTOnlyCollectionURL(): Promise<APIResponse> {
    return this.send("DELETE", "https://jsonplaceholder.typicode.com/posts", {
      headers: {"Content-Type":"application/json; charset=UTF-8","Accept":"application/json"},
    });
  }

  /** PUT https://jsonplaceholder.typicode.com/posts/1 */
  async verifyPUTPosts1WithTheFullDocumentedBody(): Promise<APIResponse> {
    return this.send("PUT", "https://jsonplaceholder.typicode.com/posts/1", {
      headers: {"Content-Type":"application/json; charset=UTF-8","Accept":"application/json"},
      data: "{\"id\":1,\"title\":\"Updated Title\",\"body\":\"Updated body\",\"userId\":1}",
    });
  }

  /** PUT https://jsonplaceholder.typicode.com/posts/1 */
  async rejectPUTPosts1WithA4xxWhenTheBodyOmitsThe(): Promise<APIResponse> {
    return this.send("PUT", "https://jsonplaceholder.typicode.com/posts/1", {
      headers: {"Content-Type":"application/json; charset=UTF-8","Accept":"application/json"},
      data: "{\"id\":1,\"body\":\"Updated body\",\"userId\":1}",
    });
  }

  /** PUT https://jsonplaceholder.typicode.com/posts/1 */
  async rejectPUTPosts1WithA4xxWhenTheRequestBodyIs(): Promise<APIResponse> {
    return this.send("PUT", "https://jsonplaceholder.typicode.com/posts/1", {
      headers: {"Content-Type":"application/json; charset=UTF-8","Accept":"application/json"},
      data: "{\"id\":1,\"title\":\"Updated Title\",\"body\":",
    });
  }

  /** PUT https://jsonplaceholder.typicode.com/posts/99999999 */
  async return404ForPUTPosts99999999TargetingAPostId(): Promise<APIResponse> {
    return this.send("PUT", "https://jsonplaceholder.typicode.com/posts/99999999", {
      headers: {"Content-Type":"application/json; charset=UTF-8","Accept":"application/json"},
      data: "{\"id\":99999999,\"title\":\"Updated Title\",\"body\":\"Updated body\",\"userId\":1}",
    });
  }

  /** PUT https://jsonplaceholder.typicode.com/posts/not-a-number */
  async rejectPUTPostsNotANumberWithA4xxWhenThePath(): Promise<APIResponse> {
    return this.send("PUT", "https://jsonplaceholder.typicode.com/posts/not-a-number", {
      headers: {"Content-Type":"application/json; charset=UTF-8","Accept":"application/json"},
      data: "{\"id\":1,\"title\":\"Updated Title\",\"body\":\"Updated body\",\"userId\":1}",
    });
  }

  /** PATCH https://jsonplaceholder.typicode.com/posts/1 */
  async verifyPATCHPosts1Returns200WithAJSONBodyWhen(): Promise<APIResponse> {
    return this.send("PATCH", "https://jsonplaceholder.typicode.com/posts/1", {
      headers: {"Content-Type":"application/json; charset=UTF-8","Accept":"application/json"},
      data: "{\"title\":\"Patched Title\"}",
    });
  }

  /** PATCH https://jsonplaceholder.typicode.com/posts/1 */
  async rejectPATCHPosts1WithA4xxWhenTheRequestBody(): Promise<APIResponse> {
    return this.send("PATCH", "https://jsonplaceholder.typicode.com/posts/1", {
      headers: {"Content-Type":"application/json; charset=UTF-8","Accept":"application/json"},
      data: "{\"title\": \"Patched Title\"",
    });
  }

  /** PATCH https://jsonplaceholder.typicode.com/posts/99999999 */
  async verifyPATCHPosts99999999ForANonExistentPost(): Promise<APIResponse> {
    return this.send("PATCH", "https://jsonplaceholder.typicode.com/posts/99999999", {
      headers: {"Content-Type":"application/json; charset=UTF-8","Accept":"application/json"},
      data: "{\"title\":\"Patched Title\"}",
    });
  }

  /** PATCH https://jsonplaceholder.typicode.com/posts/abc */
  async rejectPATCHPostsAbcWithA4xxWhenANonNumericId(): Promise<APIResponse> {
    return this.send("PATCH", "https://jsonplaceholder.typicode.com/posts/abc", {
      headers: {"Content-Type":"application/json; charset=UTF-8","Accept":"application/json"},
      data: "{\"title\":\"Patched Title\"}",
    });
  }

  /** DELETE https://jsonplaceholder.typicode.com/posts/1 */
  async verifyDELETEPosts1Returns200ConfirmingThe(): Promise<APIResponse> {
    return this.send("DELETE", "https://jsonplaceholder.typicode.com/posts/1", {
      headers: {"Accept":"application/json"},
    });
  }

  /** DELETE https://jsonplaceholder.typicode.com/posts/99999999 */
  async confirmDELETEPosts99999999DoesNotReturnA5xx(): Promise<APIResponse> {
    return this.send("DELETE", "https://jsonplaceholder.typicode.com/posts/99999999", {
      headers: {"Accept":"application/json"},
    });
  }

  /** DELETE https://jsonplaceholder.typicode.com/posts/not-a-number */
  async rejectDELETEPostsNotANumberWithA4xxForANon(): Promise<APIResponse> {
    return this.send("DELETE", "https://jsonplaceholder.typicode.com/posts/not-a-number", {
      headers: {"Accept":"application/json"},
    });
  }

  /** TRACE https://jsonplaceholder.typicode.com/posts/1 */
  async returnA4xxForAnUnsupportedHTTPTRACEMethod(): Promise<APIResponse> {
    return this.send("TRACE", "https://jsonplaceholder.typicode.com/posts/1", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/posts/9999 */
  async verifyGETPosts9999Returns200WithANonEmpty(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/posts/9999", {
      headers: {"Accept":"application/json"},
    });
  }
}
