import type { APIResponse } from '@playwright/test';
import { BaseApi } from '../base.api';

/**
 * ProductsApi — service object for the "products-api" endpoints.
 *
 * One method per distinct request. Specs call these methods and assert on the
 * response; the URL, headers and payload live here and nowhere else.
 */
export class ProductsApi extends BaseApi {
  /** GET https://dummyjson.com/products?limit=10&skip=10&select=title,price */
  async verifyGETProductsLimit10Skip10SelectTitle(): Promise<APIResponse> {
    return this.send("GET", "https://dummyjson.com/products?limit=10&skip=10&select=title,price", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://dummyjson.com/products?limit=abc&skip=10&select=title,price */
  async rejectGETProductsWithA4xxWhenTheLimit(): Promise<APIResponse> {
    return this.send("GET", "https://dummyjson.com/products?limit=abc&skip=10&select=title,price", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://dummyjson.com/products?limit=-5&skip=10&select=title,price */
  async rejectGETProductsWithA4xxWhenLimitIsNegative(): Promise<APIResponse> {
    return this.send("GET", "https://dummyjson.com/products?limit=-5&skip=10&select=title,price", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://dummyjson.com/products/99999999 */
  async return404ForGETProducts99999999WhenThe(): Promise<APIResponse> {
    return this.send("GET", "https://dummyjson.com/products/99999999", {
      headers: {"Accept":"application/json"},
    });
  }
}
