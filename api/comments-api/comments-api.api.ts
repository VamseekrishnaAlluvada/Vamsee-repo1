import type { APIResponse } from '@playwright/test';
import { BaseApi } from '../base.api';

/**
 * CommentsApi — service object for the "comments-api" endpoints.
 *
 * One method per distinct request. Specs call these methods and assert on the
 * response; the URL, headers and payload live here and nowhere else.
 */
export class CommentsApi extends BaseApi {
  /** GET https://jsonplaceholder.typicode.com/comments?postId=1 */
  async verifyGETCommentsPostId1Returns200WithANon(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/comments?postId=1", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/comments?postId=99999999 */
  async returnAnEmptyArrayWith200ForGETComments(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/comments?postId=99999999", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/comments?postId=abc */
  async ensureGETCommentsPostIdAbcWithANonNumeric(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/comments?postId=abc", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/comments?postId=1&unknownParam=foo */
  async confirmGETCommentsPostId1UnknownParamFoo(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/comments?postId=1&unknownParam=foo", {
      headers: {"Accept":"application/json"},
    });
  }
}
