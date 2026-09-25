import type { APIResponse } from '@playwright/test';
import { BaseApi } from '../base.api';

/**
 * CartsApi — service object for the "carts-api" endpoints.
 *
 * One method per distinct request. Specs call these methods and assert on the
 * response; the URL, headers and payload live here and nowhere else.
 */
export class CartsApi extends BaseApi {
  /** POST https://dummyjson.com/carts/add */
  async verifyPOSTCartsAddReturns200WithANonEmpty(): Promise<APIResponse> {
    return this.send("POST", "https://dummyjson.com/carts/add", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"userId\":1,\"products\":[{\"id\":144,\"quantity\":4},{\"id\":98,\"quantity\":1}]}",
    });
  }

  /** POST https://dummyjson.com/carts/add */
  async rejectPOSTCartsAddWithA4xxWhenTheRequired(): Promise<APIResponse> {
    return this.send("POST", "https://dummyjson.com/carts/add", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"userId\":1}",
    });
  }

  /** POST https://dummyjson.com/carts/add */
  async return400ForPOSTCartsAddWhenTheRequestBodyIs(): Promise<APIResponse> {
    return this.send("POST", "https://dummyjson.com/carts/add", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"userId\":1,\"products\":[{\"id\":144,\"quantity\":4}",
    });
  }

  /** POST https://dummyjson.com/carts/add */
  async rejectPOSTCartsAddWithA4xxWhenUserIdIsA(): Promise<APIResponse> {
    return this.send("POST", "https://dummyjson.com/carts/add", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"userId\":\"one\",\"products\":[{\"id\":144,\"quantity\":4}]}",
    });
  }
}
