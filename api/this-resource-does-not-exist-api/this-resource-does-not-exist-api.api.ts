import type { APIResponse } from '@playwright/test';
import { BaseApi } from '../base.api';

/**
 * ThisResourceDoesNotExistApi — service object for the "this-resource-does-not-exist-api" endpoints.
 *
 * One method per distinct request. Specs call these methods and assert on the
 * response; the URL, headers and payload live here and nowhere else.
 */
export class ThisResourceDoesNotExistApi extends BaseApi {
  /** GET https://postman-echo.com/this-resource-does-not-exist */
  async verifyGETThisResourceDoesNotExistReturns(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/this-resource-does-not-exist", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://postman-echo.com/this-resource-does-not-exist/99999999 */
  async return404ForGETThisResourceDoesNotExist(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/this-resource-does-not-exist/99999999", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://postman-echo.com/this-resource-does-not-exist/abc */
  async return404ForGETThisResourceDoesNotExistAbc(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/this-resource-does-not-exist/abc", {
      headers: {"Accept":"application/json"},
    });
  }

  /** POST https://postman-echo.com/this-resource-does-not-exist */
  async returnADocumented4xxForPOSTThisResourceDoes(): Promise<APIResponse> {
    return this.send("POST", "https://postman-echo.com/this-resource-does-not-exist", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://postman-echo.com/this-resource-does-not-exist?foo=bar */
  async confirmGETThisResourceDoesNotExistFooBar(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/this-resource-does-not-exist?foo=bar", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://postman-echo.com/this-resource-does-not-exist/ */
  async confirmGETThisResourceDoesNotExistWithA(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/this-resource-does-not-exist/", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://postman-echo.com/This-Resource-Does-Not-Exist */
  async confirmGETThisResourceDoesNotExistWith(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/This-Resource-Does-Not-Exist", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://postman-echo.com/this-resource-does-not-exist */
  async confirmGETThisResourceDoesNotExistWithAccept(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/this-resource-does-not-exist", {
      headers: {"Accept":"application/xml"},
    });
  }

  /** GET https://postman-echo.com/this-resource-does-not-exist?q=%3Cscript%3Ealert(1)%3C%2Fscript%3E */
  async confirmGETThisResourceDoesNotExistDoesNot(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/this-resource-does-not-exist?q=%3Cscript%3Ealert(1)%3C%2Fscript%3E", {
      headers: {"Accept":"application/json"},
    });
  }
}
