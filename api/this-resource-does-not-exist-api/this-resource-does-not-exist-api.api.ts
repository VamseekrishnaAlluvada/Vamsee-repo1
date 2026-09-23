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
  async verifyGETThisResourceDoesNotExist99999999For(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/this-resource-does-not-exist/99999999", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://postman-echo.com/this-resource-does-not-exist/not-a-number */
  async verifyGETThisResourceDoesNotExistWithANon(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/this-resource-does-not-exist/not-a-number", {
      headers: {"Accept":"application/json"},
    });
  }

  /** POST https://postman-echo.com/this-resource-does-not-exist */
  async verifyPOSTToThisResourceDoesNotExistIs(): Promise<APIResponse> {
    return this.send("POST", "https://postman-echo.com/this-resource-does-not-exist", {
      headers: {"Accept":"application/json","Content-Type":"application/json"},
      data: "{}",
    });
  }

  /** DELETE https://postman-echo.com/this-resource-does-not-exist */
  async verifyDELETEAgainstThisResourceDoesNotExist(): Promise<APIResponse> {
    return this.send("DELETE", "https://postman-echo.com/this-resource-does-not-exist", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://postman-echo.com/this-resource-does-not-exist?foo=bar&limit=10 */
  async verifyGETThisResourceDoesNotExistWithAn(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/this-resource-does-not-exist?foo=bar&limit=10", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://postman-echo.com/this-resource-does-not-exist/ */
  async verifyGETThisResourceDoesNotExistWithA(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/this-resource-does-not-exist/", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://postman-echo.com/THIS-RESOURCE-DOES-NOT-EXIST */
  async verifyGETTHISRESOURCEDOESNOTEXISTWithAn(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/THIS-RESOURCE-DOES-NOT-EXIST", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://postman-echo.com/this-resource-does-not-exist */
  async verifyGETThisResourceDoesNotExistIgnoresAn(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/this-resource-does-not-exist", {
      headers: {"Accept":"application/xml"},
    });
  }

  /** GET https://postman-echo.com/this-resource-does-not-exist/1%27%20OR%20%271%27%3D%271 */
  async verifyGETThisResourceDoesNotExistWithASQL(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/this-resource-does-not-exist/1%27%20OR%20%271%27%3D%271", {
      headers: {"Accept":"application/json"},
    });
  }
}
