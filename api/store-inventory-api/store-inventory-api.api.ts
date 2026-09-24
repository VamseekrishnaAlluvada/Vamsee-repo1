import type { APIResponse } from '@playwright/test';
import { BaseApi } from '../base.api';

/**
 * StoreInventoryApi — service object for the "store-inventory-api" endpoints.
 *
 * One method per distinct request. Specs call these methods and assert on the
 * response; the URL, headers and payload live here and nowhere else.
 */
export class StoreInventoryApi extends BaseApi {
  /** GET https://petstore.swagger.io/v2/store/inventory */
  async verifyGETV2StoreInventoryReturns200WithAJSON(): Promise<APIResponse> {
    return this.send("GET", "https://petstore.swagger.io/v2/store/inventory", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://petstore.swagger.io/v2/store/inventory?bogus=abc123 */
  async confirmGETV2StoreInventoryIgnoresAnUnknown(): Promise<APIResponse> {
    return this.send("GET", "https://petstore.swagger.io/v2/store/inventory?bogus=abc123", {
      headers: {"Accept":"application/json"},
    });
  }

  /** POST https://petstore.swagger.io/v2/store/inventory */
  async rejectPOSTV2StoreInventoryWithA4xx405Since(): Promise<APIResponse> {
    return this.send("POST", "https://petstore.swagger.io/v2/store/inventory", {
      headers: {"Accept":"application/json"},
    });
  }
}
