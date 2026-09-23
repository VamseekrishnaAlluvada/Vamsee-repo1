import type { APIResponse } from '@playwright/test';
import { BaseApi } from '../base.api';

/**
 * RootResourceApi — service object for the "root-resource-api" endpoints.
 *
 * One method per distinct request. Specs call these methods and assert on the
 * response; the URL, headers and payload live here and nowhere else.
 */
export class RootResourceApi extends BaseApi {
  /** POST https://postman-echo.com */
  async verifyPOSTHttpsPostmanEchoComReturns405(): Promise<APIResponse> {
    return this.send("POST", "https://postman-echo.com", {
      headers: {"Accept":"application/json"},
    });
  }

  /** POST https://postman-echo.com */
  async rejectPOSTHttpsPostmanEchoComWith405EvenWhen(): Promise<APIResponse> {
    return this.send("POST", "https://postman-echo.com", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"name\":\"probe\"}",
    });
  }

  /** POST https://postman-echo.com */
  async rejectPOSTHttpsPostmanEchoComWithA4xxWhenThe(): Promise<APIResponse> {
    return this.send("POST", "https://postman-echo.com", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"name\":",
    });
  }

  /** POST https://postman-echo.com */
  async rejectPOSTHttpsPostmanEchoComWith405WhenAn(): Promise<APIResponse> {
    return this.send("POST", "https://postman-echo.com", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{}",
    });
  }

  /** POST https://postman-echo.com?debug=true */
  async confirmPOSTHttpsPostmanEchoComDoesNot500When(): Promise<APIResponse> {
    return this.send("POST", "https://postman-echo.com?debug=true", {
      headers: {"Accept":"application/json"},
    });
  }

  /** POST https://postman-echo.com/ */
  async confirmPOSTHttpsPostmanEchoComWithATrailing(): Promise<APIResponse> {
    return this.send("POST", "https://postman-echo.com/", {
      headers: {"Accept":"application/json"},
    });
  }

  /** POST https://postman-echo.com/99999999 */
  async return404ForPOSTHttpsPostmanEchoCom99999999(): Promise<APIResponse> {
    return this.send("POST", "https://postman-echo.com/99999999", {
      headers: {"Accept":"application/json"},
    });
  }

  /** POST https://postman-echo.com/not-a-number */
  async confirmPOSTHttpsPostmanEchoComNotANumberDoes(): Promise<APIResponse> {
    return this.send("POST", "https://postman-echo.com/not-a-number", {
      headers: {"Accept":"application/json"},
    });
  }

  /** POST https://postman-echo.com */
  async verifyPOSTHttpsPostmanEchoComReturnsAClean(): Promise<APIResponse> {
    return this.send("POST", "https://postman-echo.com", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"name\":\"<script>alert(1)</script>\"}",
    });
  }

  /** DELETE https://postman-echo.com */
  async verifyDELETEOnPostmanEchoReturns405MethodNot(): Promise<APIResponse> {
    return this.send("DELETE", "https://postman-echo.com");
  }

  /** DELETE https://postman-echo.com */
  async confirmDELETEWithAnAcceptApplicationJson(): Promise<APIResponse> {
    return this.send("DELETE", "https://postman-echo.com", {
      headers: {"Accept":"application/json"},
    });
  }

  /** DELETE https://postman-echo.com/99999999 */
  async rejectDELETE99999999ForANonExistentIdWithA(): Promise<APIResponse> {
    return this.send("DELETE", "https://postman-echo.com/99999999");
  }

  /** DELETE https://postman-echo.com/not-a-number */
  async rejectDELETENotANumberForAMalformedNon(): Promise<APIResponse> {
    return this.send("DELETE", "https://postman-echo.com/not-a-number");
  }

  /** DELETE https://postman-echo.com/?debug=true */
  async confirmDELETEDebugTrueIgnoresAnUnknownQuery(): Promise<APIResponse> {
    return this.send("DELETE", "https://postman-echo.com/?debug=true");
  }

  /** DELETE https://postman-echo.com/ */
  async confirmDELETEWithATrailingSlashPathVariant(): Promise<APIResponse> {
    return this.send("DELETE", "https://postman-echo.com/");
  }

  /** DELETE https://postman-echo.com */
  async confirmDELETEWithAnUnexpectedRequestBodyIs(): Promise<APIResponse> {
    return this.send("DELETE", "https://postman-echo.com", {
      headers: {"Content-Type":"application/json"},
      data: "{\"unexpected\":\"payload\"}",
    });
  }

  /** GET https://postman-echo.com */
  async confirmGETOnTheSameRootURLSucceeds2xxProving(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com");
  }

  /** DELETE https://postman-echo.com/?q=1%27%20OR%20%271%27%3D%271 */
  async ensureDELETEWithASQLInjectionShapedQuery(): Promise<APIResponse> {
    return this.send("DELETE", "https://postman-echo.com/?q=1%27%20OR%20%271%27%3D%271");
  }
}
