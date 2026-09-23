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
  async verifyGETOnPostmanEchoReturns200WithAContent(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/", {
      headers: {"Accept":"*/*"},
    });
  }

  /** GET https://postman-echo.com/99999999 */
  async return404ForGET99999999WhenTheResourceId(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/99999999", {
      headers: {"Accept":"*/*"},
    });
  }

  /** GET https://postman-echo.com/nonexistent-resource-xyz */
  async return404ForGETNonexistentResourceXyzOnAn(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/nonexistent-resource-xyz", {
      headers: {"Accept":"*/*"},
    });
  }

  /** PUT https://postman-echo.com/ */
  async rejectPUTOnPostmanEchoWithANon2xxStatusForAn(): Promise<APIResponse> {
    return this.send("PUT", "https://postman-echo.com/", {
      headers: {"Accept":"*/*"},
    });
  }

  /** PATCH https://postman-echo.com/ */
  async rejectPATCHOnPostmanEchoWithANon2xxStatusFor(): Promise<APIResponse> {
    return this.send("PATCH", "https://postman-echo.com/", {
      headers: {"Accept":"*/*"},
    });
  }

  /** GET https://postman-echo.com/?debug=true */
  async verifyGETDebugTrueIsSafelyIgnoredAndStill(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/?debug=true", {
      headers: {"Accept":"*/*"},
    });
  }

  /** GET https://postman-echo.com/?foo=1&bar=2&baz=three */
  async verifyGETWithMultipleUnknownQueryParameters(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/?foo=1&bar=2&baz=three", {
      headers: {"Accept":"*/*"},
    });
  }

  /** GET https://postman-echo.com/ */
  async verifyGETWithACustomUnknownRequestHeader(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/", {
      headers: {"Accept":"*/*","X-Custom-Test":"regression-suite"},
    });
  }

  /** GET https://postman-echo.com/?q=%27%20OR%20%271%27%3D%271 */
  async verifyGETWithAnInjectionShapedQueryValue(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/?q=%27%20OR%20%271%27%3D%271", {
      headers: {"Accept":"*/*"},
    });
  }

  /** GET https://postman-echo.com/ */
  async verifyGETOnPostmanEchoReturns200WithAContent2(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://postman-echo.com/index */
  async confirmGETWithATrailingPathSegmentIndexDoes(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/index", {
      headers: {"Accept":"*/*"},
    });
  }

  /** GET https://postman-echo.com/not-a-real-path */
  async returnANon2xxStatusForGETNotARealPathWithA(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/not-a-real-path", {
      headers: {"Accept":"*/*"},
    });
  }

  /** GET https://postman-echo.com/?unknownParam=abc123 */
  async confirmGETIgnoresAnUnknownQueryParameterAnd(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/?unknownParam=abc123", {
      headers: {"Accept":"*/*"},
    });
  }

  /** DELETE https://postman-echo.com/ */
  async confirmDELETEAgainstTheRootURLDoesNotReturnA(): Promise<APIResponse> {
    return this.send("DELETE", "https://postman-echo.com/", {
      headers: {"Accept":"*/*"},
    });
  }

  /** GET https://postman-echo.com/ */
  async confirmGETWithAcceptApplicationXmlStill(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/", {
      headers: {"Accept":"application/xml"},
    });
  }

  /** GET https://postman-echo.com/?q=%27%20OR%201%3D1-- */
  async confirmGETWithAnInjectionShapedQueryValue(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/?q=%27%20OR%201%3D1--", {
      headers: {"Accept":"*/*"},
    });
  }

  /** HEAD https://postman-echo.com/ */
  async verifyHEADAgainstTheRootURLReturnsA2xxStatus(): Promise<APIResponse> {
    return this.send("HEAD", "https://postman-echo.com/", {
      headers: {"Accept":"*/*"},
    });
  }

  /** GET https://postman-echo.com?foo=bar */
  async verifyGETHttpsPostmanEchoComFooBarReturns200(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com?foo=bar", {
      headers: {"Accept":"*/*"},
    });
  }

  /** GET https://postman-echo.com/not-a-number */
  async rejectGETHttpsPostmanEchoComNotANumberWithA(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/not-a-number", {
      headers: {"Accept":"*/*"},
    });
  }

  /** PUT https://postman-echo.com?foo=bar */
  async rejectPUTHttpsPostmanEchoComFooBarWithANon(): Promise<APIResponse> {
    return this.send("PUT", "https://postman-echo.com?foo=bar", {
      headers: {"Accept":"*/*"},
    });
  }

  /** PATCH https://postman-echo.com?foo=bar */
  async rejectPATCHHttpsPostmanEchoComFooBarWithANon(): Promise<APIResponse> {
    return this.send("PATCH", "https://postman-echo.com?foo=bar", {
      headers: {"Accept":"*/*"},
    });
  }

  /** GET https://postman-echo.com?foo=bar&unknownParam=xyz */
  async confirmGETHttpsPostmanEchoComFooBar(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com?foo=bar&unknownParam=xyz", {
      headers: {"Accept":"*/*"},
    });
  }

  /** GET https://postman-echo.com */
  async confirmGETHttpsPostmanEchoComWithNoQuery(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com", {
      headers: {"Accept":"*/*"},
    });
  }

  /** GET https://postman-echo.com?foo=%3Cscript%3E */
  async ensureGETHttpsPostmanEchoComFoo3Cscript3E(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com?foo=%3Cscript%3E", {
      headers: {"Accept":"*/*"},
    });
  }

  /** HEAD https://postman-echo.com?foo=bar */
  async verifyHEADHttpsPostmanEchoComFooBarReturns(): Promise<APIResponse> {
    return this.send("HEAD", "https://postman-echo.com?foo=bar", {
      headers: {"Accept":"*/*"},
    });
  }

  /** POST https://postman-echo.com/ */
  async verifyPOSTReturns405MethodNotAllowedOnThe(): Promise<APIResponse> {
    return this.send("POST", "https://postman-echo.com/", {
      headers: {"Accept":"application/json"},
    });
  }

  /** POST https://postman-echo.com/ */
  async confirmThe405ResponseForPOSTCarriesAContent(): Promise<APIResponse> {
    return this.send("POST", "https://postman-echo.com/", {
      headers: {"Accept":"text/html"},
    });
  }

  /** POST https://postman-echo.com/99999999 */
  async rejectPOST99999999ForANonExistentIdWithA4xx(): Promise<APIResponse> {
    return this.send("POST", "https://postman-echo.com/99999999", {
      headers: {"Accept":"application/json"},
    });
  }

  /** POST https://postman-echo.com/not-a-number */
  async rejectPOSTNotANumberForANonNumericIdPathWith(): Promise<APIResponse> {
    return this.send("POST", "https://postman-echo.com/not-a-number", {
      headers: {"Accept":"application/json"},
    });
  }

  /** PUT https://postman-echo.com/ */
  async rejectPUTOnTheRootResourceWithA4xxAsAn(): Promise<APIResponse> {
    return this.send("PUT", "https://postman-echo.com/", {
      headers: {"Accept":"application/json"},
    });
  }

  /** PATCH https://postman-echo.com/ */
  async rejectPATCHOnTheRootResourceWithA4xxAsAn(): Promise<APIResponse> {
    return this.send("PATCH", "https://postman-echo.com/", {
      headers: {"Accept":"application/json"},
    });
  }

  /** POST https://postman-echo.com/?debug=true */
  async confirmPOSTDebugTrueIgnoresAnUnknownQuery(): Promise<APIResponse> {
    return this.send("POST", "https://postman-echo.com/?debug=true", {
      headers: {"Accept":"application/json"},
    });
  }

  /** POST https://postman-echo.com/ */
  async confirmPOSTWithAnEmptyJSONBodyIsStill(): Promise<APIResponse> {
    return this.send("POST", "https://postman-echo.com/", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{}",
    });
  }

  /** POST https://postman-echo.com/ */
  async confirmPOSTWithAMalformedJSONBodyIsRejected(): Promise<APIResponse> {
    return this.send("POST", "https://postman-echo.com/", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{ \"broken\": ",
    });
  }

  /** POST https://postman-echo.com/?q=1%27%20OR%20%271%27%3D%271 */
  async confirmPOSTWithASQLInjectionShapedQueryValue(): Promise<APIResponse> {
    return this.send("POST", "https://postman-echo.com/?q=1%27%20OR%20%271%27%3D%271", {
      headers: {"Accept":"application/json"},
    });
  }

  /** DELETE https://postman-echo.com/ */
  async verifyDELETEReturns405MethodNotAllowedOnThe(): Promise<APIResponse> {
    return this.send("DELETE", "https://postman-echo.com/", {
      headers: {"Accept":"application/json"},
    });
  }

  /** DELETE https://postman-echo.com/99999999 */
  async verifyDELETE99999999ForANonExistentIdReturns(): Promise<APIResponse> {
    return this.send("DELETE", "https://postman-echo.com/99999999", {
      headers: {"Accept":"application/json"},
    });
  }

  /** DELETE https://postman-echo.com/not-a-number */
  async verifyDELETENotANumberWithANonNumericId(): Promise<APIResponse> {
    return this.send("DELETE", "https://postman-echo.com/not-a-number", {
      headers: {"Accept":"application/json"},
    });
  }

  /** DELETE https://postman-echo.com/?debug=true */
  async verifyDELETEDebugTrueIgnoresAnUnknownQuery(): Promise<APIResponse> {
    return this.send("DELETE", "https://postman-echo.com/?debug=true", {
      headers: {"Accept":"application/json"},
    });
  }

  /** DELETE https://postman-echo.com/ */
  async verifyDELETEWithARequestBodyIsRejectedWith(): Promise<APIResponse> {
    return this.send("DELETE", "https://postman-echo.com/", {
      headers: {"Accept":"application/json","Content-Type":"application/json"},
      data: "{\"id\":1}",
    });
  }

  /** DELETE https://postman-echo.com/ */
  async verifyDELETEWithAcceptApplicationXmlStill(): Promise<APIResponse> {
    return this.send("DELETE", "https://postman-echo.com/", {
      headers: {"Accept":"application/xml"},
    });
  }

  /** DELETE https://postman-echo.com/?id=1%27%20OR%20%271%27%3D%271 */
  async verifyDELETEId12720OR20271273D271ReturnsA(): Promise<APIResponse> {
    return this.send("DELETE", "https://postman-echo.com/?id=1%27%20OR%20%271%27%3D%271", {
      headers: {"Accept":"application/json"},
    });
  }

  /** HEAD https://postman-echo.com/ */
  async verifyHEADReturns200WithResponseHeadersAndNo(): Promise<APIResponse> {
    return this.send("HEAD", "https://postman-echo.com/");
  }

  /** HEAD https://postman-echo.com/99999999 */
  async return404ForHEAD99999999WhenTheResourceId(): Promise<APIResponse> {
    return this.send("HEAD", "https://postman-echo.com/99999999");
  }

  /** HEAD https://postman-echo.com/not-a-number */
  async rejectHEADNotANumberWithA4xxForANonNumeric(): Promise<APIResponse> {
    return this.send("HEAD", "https://postman-echo.com/not-a-number");
  }

  /** PATCH https://postman-echo.com/ */
  async rejectPATCHAgainstTheRootURLAsAnUnsupported(): Promise<APIResponse> {
    return this.send("PATCH", "https://postman-echo.com/");
  }

  /** HEAD https://postman-echo.com/?foo=bar */
  async confirmHEADFooBarIgnoresAnUnknownQuery(): Promise<APIResponse> {
    return this.send("HEAD", "https://postman-echo.com/?foo=bar");
  }

  /** HEAD https://postman-echo.com/ */
  async confirmHEADWithAcceptApplicationXmlStill(): Promise<APIResponse> {
    return this.send("HEAD", "https://postman-echo.com/", {
      headers: {"Accept":"application/xml"},
    });
  }
}
