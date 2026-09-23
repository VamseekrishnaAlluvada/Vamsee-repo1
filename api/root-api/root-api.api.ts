import type { APIResponse } from '@playwright/test';
import { BaseApi } from '../base.api';

/**
 * RootApi — service object for the "root-api" endpoints.
 *
 * One method per distinct request. Specs call these methods and assert on the
 * response; the URL, headers and payload live here and nowhere else.
 */
export class RootApi extends BaseApi {
  /** GET https://postman-echo.com/ */
  async verifyGETHttpsPostmanEchoComReturns200OnThe(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/", {
      headers: {"Accept":"*/*"},
    });
  }

  /** GET https://postman-echo.com/?nonExistentParam=abc123 */
  async confirmGETHttpsPostmanEchoComIgnoresAn(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/?nonExistentParam=abc123", {
      headers: {"Accept":"*/*"},
    });
  }

  /** GET https://postman-echo.com/ */
  async confirmGETHttpsPostmanEchoComToleratesAn(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/", {
      headers: {"Accept":"application/xml"},
    });
  }

  /** GET https://postman-echo.com/99999999 */
  async returnA4xxForGETHttpsPostmanEchoCom99999999(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/99999999", {
      headers: {"Accept":"*/*"},
    });
  }

  /** GET https://postman-echo.com/not-a-real-id */
  async returnA4xxForGETHttpsPostmanEchoComNotAReal(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/not-a-real-id", {
      headers: {"Accept":"*/*"},
    });
  }

  /** DELETE https://postman-echo.com/ */
  async confirmDELETEHttpsPostmanEchoComDoesNot(): Promise<APIResponse> {
    return this.send("DELETE", "https://postman-echo.com/", {
      headers: {"Accept":"*/*"},
    });
  }

  /** GET https://postman-echo.com */
  async confirmGETHttpsPostmanEchoComNoTrailingSlash(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com", {
      headers: {"Accept":"*/*"},
    });
  }

  /** GET https://postman-echo.com/?q=%3Cscript%3Ealert(1)%3C%2Fscript%3E */
  async confirmGETHttpsPostmanEchoComQScriptAlert1(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/?q=%3Cscript%3Ealert(1)%3C%2Fscript%3E", {
      headers: {"Accept":"*/*"},
    });
  }

  /** HEAD https://postman-echo.com/ */
  async confirmHEADHttpsPostmanEchoComReturnsA2xx(): Promise<APIResponse> {
    return this.send("HEAD", "https://postman-echo.com/", {
      headers: {"Accept":"*/*"},
    });
  }

  /** GET https://postman-echo.com/nonexistent-resource-xyz */
  async return404ForGETNonexistentResourceXyzWhenA(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/nonexistent-resource-xyz", {
      headers: {"Accept":"*/*"},
    });
  }

  /** PUT https://postman-echo.com/ */
  async rejectPUTWithA4xx405SincePUTIsNotASupported(): Promise<APIResponse> {
    return this.send("PUT", "https://postman-echo.com/", {
      headers: {"Accept":"*/*"},
    });
  }

  /** GET https://postman-echo.com/?debug=true */
  async confirmGETDebugTrueIgnoresAnUnknownQuery(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/?debug=true", {
      headers: {"Accept":"*/*"},
    });
  }

  /** GET https://postman-echo.com/?foo=1&bar=baz&x=y */
  async confirmGETWithMultipleUnknownQueryParameters(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/?foo=1&bar=baz&x=y", {
      headers: {"Accept":"*/*"},
    });
  }

  /** GET https://postman-echo.com?foo=bar */
  async verifyGETHttpsPostmanEchoComFooBarReturns200(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com?foo=bar", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://postman-echo.com/99999999 */
  async return404ForGETHttpsPostmanEchoCom99999999(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/99999999", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://postman-echo.com/not-a-number */
  async returnA4xxForGETHttpsPostmanEchoComNotA(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/not-a-number", {
      headers: {"Accept":"application/json"},
    });
  }

  /** PUT https://postman-echo.com?foo=bar */
  async rejectPUTHttpsPostmanEchoComFooBarWithA4xxAs(): Promise<APIResponse> {
    return this.send("PUT", "https://postman-echo.com?foo=bar", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://postman-echo.com?foo=bar&unknownParam=xyz */
  async confirmGETHttpsPostmanEchoComFooBar(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com?foo=bar&unknownParam=xyz", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://postman-echo.com?foo= */
  async confirmGETHttpsPostmanEchoComFooHandlesAn(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com?foo=", {
      headers: {"Accept":"application/json"},
    });
  }

  /** HEAD https://postman-echo.com?foo=bar */
  async verifyHEADHttpsPostmanEchoComFooBarReturns(): Promise<APIResponse> {
    return this.send("HEAD", "https://postman-echo.com?foo=bar", {
      headers: {"Accept":"application/json"},
    });
  }

  /** POST https://postman-echo.com/99999999 */
  async returnANon2xxStatusForPOST99999999UsingThe(): Promise<APIResponse> {
    return this.send("POST", "https://postman-echo.com/99999999", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://postman-echo.com/99999999?debug=true */
  async confirmGET99999999DebugTrueIgnoresAnUnknown(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/99999999?debug=true", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://postman-echo.com/99999999/ */
  async confirmGET99999999WithATrailingSlashDoesNot(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/99999999/", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://postman-echo.com/99999999 */
  async verifyGET99999999WithAcceptApplicationXml(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/99999999", {
      headers: {"Accept":"application/xml"},
    });
  }

  /** GET https://postman-echo.com/99999999?q=%27%20OR%201%3D1%20-- */
  async returnAClean4xxForGET99999999WithASQL(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/99999999?q=%27%20OR%201%3D1%20--", {
      headers: {"Accept":"application/json"},
    });
  }

  /** HEAD https://postman-echo.com/ */
  async verifyHEADReturns200WithAContentTypeHeaderOn(): Promise<APIResponse> {
    return this.send("HEAD", "https://postman-echo.com/");
  }

  /** HEAD https://postman-echo.com/99999999 */
  async return4xxForHEAD99999999WhenTheIdCannotExist(): Promise<APIResponse> {
    return this.send("HEAD", "https://postman-echo.com/99999999");
  }

  /** HEAD https://postman-echo.com/not-a-real-path */
  async return4xxForHEADNotARealPathWhenThePath(): Promise<APIResponse> {
    return this.send("HEAD", "https://postman-echo.com/not-a-real-path");
  }

  /** HEAD https://postman-echo.com/?debug=true */
  async confirmHEADDebugTrueIgnoresAnUnknownQuery(): Promise<APIResponse> {
    return this.send("HEAD", "https://postman-echo.com/?debug=true");
  }

  /** HEAD https://postman-echo.com/ */
  async confirmHEADWithAcceptApplicationXmlStill(): Promise<APIResponse> {
    return this.send("HEAD", "https://postman-echo.com/", {
      headers: {"Accept":"application/xml"},
    });
  }

  /** HEAD https://postman-echo.com/ */
  async confirmHEADToleratesAnArbitraryCustomRequest(): Promise<APIResponse> {
    return this.send("HEAD", "https://postman-echo.com/", {
      headers: {"X-Custom-Probe":"test-value"},
    });
  }

  /** HEAD https://postman-echo.com/99999999?foo=bar */
  async confirmHEAD99999999FooBarKeepsReturning4xx(): Promise<APIResponse> {
    return this.send("HEAD", "https://postman-echo.com/99999999?foo=bar");
  }

  /** HEAD https://postman-echo.com/NoSuchResource */
  async confirmCaseVariantPathHEADNoSuchResourceDoes(): Promise<APIResponse> {
    return this.send("HEAD", "https://postman-echo.com/NoSuchResource");
  }
}
