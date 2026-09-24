import type { APIResponse } from '@playwright/test';
import { BaseApi, fill, fillHeaders, type Vars } from '../base.api';

/**
 * PostsFlowsApi — service object for the "posts-flows" endpoints.
 *
 * One method per distinct request. Specs call these methods and assert on the
 * response; the URL, headers and payload live here and nowhere else.
 */
export class PostsFlowsApi extends BaseApi {
  /** POST https://jsonplaceholder.typicode.com/posts */
  async createPosts(): Promise<APIResponse> {
    return this.send("POST", "https://jsonplaceholder.typicode.com/posts", {
      headers: {"Content-Type":"application/json; charset=UTF-8"},
      data: "{\"title\":\"QA Automation Post\",\"body\":\"Created from Postman collection\",\"userId\":1}",
    });
  }

  /** GET https://jsonplaceholder.typicode.com/posts/{{postId}} */
  async readPosts(vars: Vars = {}): Promise<APIResponse> {
    return this.send("GET", fill("https://jsonplaceholder.typicode.com/posts/{{postId}}", vars));
  }

  /** PUT https://jsonplaceholder.typicode.com/posts/{{postId}} */
  async updatePosts(vars: Vars = {}): Promise<APIResponse> {
    return this.send("PUT", fill("https://jsonplaceholder.typicode.com/posts/{{postId}}", vars), {
      headers: fillHeaders({"Content-Type":"application/json; charset=UTF-8"}, vars),
      data: fill("{\"id\":{{postId}},\"title\":\"Updated Title\",\"body\":\"Updated body\",\"userId\":1}", vars),
    });
  }

  /** DELETE https://jsonplaceholder.typicode.com/posts/{{postId}} */
  async deletePosts(vars: Vars = {}): Promise<APIResponse> {
    return this.send("DELETE", fill("https://jsonplaceholder.typicode.com/posts/{{postId}}", vars));
  }
}
