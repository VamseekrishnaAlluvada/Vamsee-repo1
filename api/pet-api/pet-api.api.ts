import type { APIResponse } from '@playwright/test';
import { BaseApi } from '../base.api';

/**
 * PetApi — service object for the "pet-api" endpoints.
 *
 * One method per distinct request. Specs call these methods and assert on the
 * response; the URL, headers and payload live here and nowhere else.
 */
export class PetApi extends BaseApi {
  /** POST https://petstore.swagger.io/v2/pet */
  async verifyPOSTV2PetCreatesAPetAndReturns200WithA(): Promise<APIResponse> {
    return this.send("POST", "https://petstore.swagger.io/v2/pet", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"id\":987654321,\"category\":{\"id\":1,\"name\":\"Dogs\"},\"name\":\"QA-Doggo\",\"photoUrls\":[\"https://example.com/dog.png\"],\"tags\":[{\"id\":1,\"name\":\"automation\"}],\"status\":\"available\"}",
    });
  }

  /** POST https://petstore.swagger.io/v2/pet */
  async rejectPOSTV2PetWith400WhenTheRequestBodyIs(): Promise<APIResponse> {
    return this.send("POST", "https://petstore.swagger.io/v2/pet", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"id\":987654321,\"name\":\"QA-Doggo\",\"status\":\"available\"",
    });
  }

  /** POST https://petstore.swagger.io/v2/pet */
  async rejectPOSTV2PetWithA4xxWhenTheIdFieldIsA(): Promise<APIResponse> {
    return this.send("POST", "https://petstore.swagger.io/v2/pet", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"id\":\"not-a-number\",\"category\":{\"id\":1,\"name\":\"Dogs\"},\"name\":\"QA-Doggo\",\"photoUrls\":[\"https://example.com/dog.png\"],\"status\":\"available\"}",
    });
  }

  /** GET https://petstore.swagger.io/v2/pet */
  async rejectGETV2PetWith405BecauseTheCreate(): Promise<APIResponse> {
    return this.send("GET", "https://petstore.swagger.io/v2/pet", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
    });
  }
}
