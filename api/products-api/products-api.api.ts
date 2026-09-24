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
  async verifyGETProductsWithLimit10Skip10Select(): Promise<APIResponse> {
    return this.send("GET", "https://dummyjson.com/products?limit=10&skip=10&select=title,price", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://dummyjson.com/products?limit=abc&skip=10&select=title,price */
  async verifyGETProductsWithANonNumericLimitDoesNot(): Promise<APIResponse> {
    return this.send("GET", "https://dummyjson.com/products?limit=abc&skip=10&select=title,price", {
      headers: {"Accept":"application/json"},
    });
  }

  /** POST https://dummyjson.com/products?limit=10&skip=10&select=title,price */
  async rejectPOSTProductsAgainstTheListURLWithANon(): Promise<APIResponse> {
    return this.send("POST", "https://dummyjson.com/products?limit=10&skip=10&select=title,price", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://dummyjson.com/products?limit=10&skip=10&select=title,price&bogusParam=xyz */
  async verifyGETProductsIgnoresAnUnknownQuery(): Promise<APIResponse> {
    return this.send("GET", "https://dummyjson.com/products?limit=10&skip=10&select=title,price&bogusParam=xyz", {
      headers: {"Accept":"application/json"},
    });
  }
}
