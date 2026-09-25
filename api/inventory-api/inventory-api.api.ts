import type { APIResponse } from '@playwright/test';
import { BaseApi } from '../base.api';

/**
 * InventoryApi — service object for the "inventory-api" endpoints.
 *
 * One method per distinct request. Specs call these methods and assert on the
 * response; the URL, headers and payload live here and nowhere else.
 */
export class InventoryApi extends BaseApi {
  /** GET https://petstore.swagger.io/v2/store/inventory */
  async verifyGETV2StoreInventoryReturns200WithAJSON(): Promise<APIResponse> {
    return this.send("GET", "https://petstore.swagger.io/v2/store/inventory", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://petstore.swagger.io/v2/store/inventory?foo=bar */
  async ignoreAnUnknownQueryParameterOnGETV2Store(): Promise<APIResponse> {
    return this.send("GET", "https://petstore.swagger.io/v2/store/inventory?foo=bar", {
      headers: {"Accept":"application/json"},
    });
  }

  /** POST https://petstore.swagger.io/v2/store/inventory */
  async rejectPOSTV2StoreInventoryWithA405Because(): Promise<APIResponse> {
    return this.send("POST", "https://petstore.swagger.io/v2/store/inventory", {
      headers: {"Accept":"application/json"},
    });
  }
}
