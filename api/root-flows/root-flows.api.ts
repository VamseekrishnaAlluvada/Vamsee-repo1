import type { APIResponse } from '@playwright/test';
import { BaseApi } from '../base.api';

/**
 * RootFlowsApi — service object for the "root-flows" endpoints.
 *
 * One method per distinct request. Specs call these methods and assert on the
 * response; the URL, headers and payload live here and nowhere else.
 */
export class RootFlowsApi extends BaseApi {
  /** POST https://postman-echo.com */
  async createRoot(): Promise<APIResponse> {
    return this.send("POST", "https://postman-echo.com");
  }

  /** GET https://postman-echo.com/99999999 */
  async readRoot(): Promise<APIResponse> {
    return this.send("GET", "https://postman-echo.com/99999999");
  }
}
