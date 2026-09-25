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

  /** GET https://dummyjson.com/products/search?q=zzzznonexistentproductxyz */
  async verifyGETProductsSearchWithANoMatchQuery(): Promise<APIResponse> {
    return this.send("GET", "https://dummyjson.com/products/search?q=zzzznonexistentproductxyz", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://dummyjson.com/products/search?q=phone&limit=5 */
  async verifyGETProductsSearchQPhoneLimit5Honours(): Promise<APIResponse> {
    return this.send("GET", "https://dummyjson.com/products/search?q=phone&limit=5", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://dummyjson.com/products/search?q=phone&limit=abc */
  async verifyGETProductsSearchQPhoneLimitAbcWithA(): Promise<APIResponse> {
    return this.send("GET", "https://dummyjson.com/products/search?q=phone&limit=abc", {
      headers: {"Accept":"application/json"},
    });
  }
}
