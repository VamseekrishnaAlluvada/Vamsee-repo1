import type { APIResponse } from '@playwright/test';
import { BaseApi } from '../base.api';

/**
 * RootResourceReadApi — service object for the "root-resource-read" endpoints.
 *
 * One method per distinct request. Specs call these methods and assert on the
 * response; the URL, headers and payload live here and nowhere else.
 */
export class RootResourceReadApi extends BaseApi {
  /** GET https://postman-echo.com/99999999 */
  async verifyGETHttpsPostmanEchoCom99999999Returns(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/99999999", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://postman-echo.com/not-a-real-id */
  async verifyGET99999999WithANonNumericIdSegment(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/not-a-real-id", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://postman-echo.com/99999999?foo=bar */
  async confirmGET99999999IgnoresAnUnknownQuery(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/99999999?foo=bar", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://postman-echo.com/99999999/ */
  async verifyGET99999999WithATrailingSlashDoesNot(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/99999999/", {
      headers: {"Accept":"application/json"},
    });
  }

  /** POST https://postman-echo.com/99999999 */
  async confirmPOSTTo99999999AgainstTheReadURLIs(): Promise<APIResponse> {
    return this.send("POST", "https://postman-echo.com/99999999", {
      headers: {"Accept":"application/json"},
    });
  }

  /** HEAD https://postman-echo.com/99999999 */
  async confirmHEAD99999999MirrorsTheGET404WithoutA(): Promise<APIResponse> {
    return this.send("HEAD", "https://postman-echo.com/99999999", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://postman-echo.com/99999999 */
  async confirmGET99999999WithAcceptApplicationXml(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/99999999", {
      headers: {"Accept":"application/xml"},
    });
  }

  /** GET https://postman-echo.com/1%27%20OR%20%271%27%3D%271 */
  async confirmGET99999999WithASQLInjectionShapedId(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/1%27%20OR%20%271%27%3D%271", {
      headers: {"Accept":"application/json"},
    });
  }
}
