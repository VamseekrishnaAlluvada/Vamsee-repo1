import type { APIResponse } from '@playwright/test';
import { BaseApi } from '../base.api';

/**
 * ProductsSearchApi — service object for the "products-search-api" endpoints.
 *
 * One method per distinct request. Specs call these methods and assert on the
 * response; the URL, headers and payload live here and nowhere else.
 */
export class ProductsSearchApi extends BaseApi {
  /** GET https://dummyjson.com/products/search?q=phone */
  async verifyGETProductsSearchQPhoneReturns200WithA(): Promise<APIResponse> {
    return this.send("GET", "https://dummyjson.com/products/search?q=phone", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://dummyjson.com/products/search?q=zzzznomatchqueryzzzz */
  async verifyGETProductsSearchWithANoMatchQuery(): Promise<APIResponse> {
    return this.send("GET", "https://dummyjson.com/products/search?q=zzzznomatchqueryzzzz", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://dummyjson.com/products/search?q=phone&bogusParam=xyz */
  async confirmGETProductsSearchIgnoresAnUnknown(): Promise<APIResponse> {
    return this.send("GET", "https://dummyjson.com/products/search?q=phone&bogusParam=xyz", {
      headers: {"Accept":"application/json"},
    });
  }

  /** POST https://dummyjson.com/products/search?q=phone */
  async rejectPOSTProductsSearchWithANon2xxStatus(): Promise<APIResponse> {
    return this.send("POST", "https://dummyjson.com/products/search?q=phone", {
      headers: {"Accept":"application/json"},
    });
  }
}
