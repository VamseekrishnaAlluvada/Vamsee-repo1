import type { APIResponse } from '@playwright/test';
import { BaseApi } from '../base.api';

/**
 * PetFindbystatusApi — service object for the "pet-findbystatus-api" endpoints.
 *
 * One method per distinct request. Specs call these methods and assert on the
 * response; the URL, headers and payload live here and nowhere else.
 */
export class PetFindbystatusApi extends BaseApi {
  /** GET https://petstore.swagger.io/v2/pet/findByStatus?status=available */
  async verifyGETV2PetFindByStatusStatusAvailable(): Promise<APIResponse> {
    return this.send("GET", "https://petstore.swagger.io/v2/pet/findByStatus?status=available", {
      headers: {"Accept":"application/json"},
    });
  }

  /** POST https://petstore.swagger.io/v2/pet/findByStatus?status=available */
  async rejectPOSTAgainstV2PetFindByStatusWithA405(): Promise<APIResponse> {
    return this.send("POST", "https://petstore.swagger.io/v2/pet/findByStatus?status=available", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://petstore.swagger.io/v2/pet/findByStatus?status=available&foo=bar */
  async confirmGETV2PetFindByStatusIgnoresAnUnknown(): Promise<APIResponse> {
    return this.send("GET", "https://petstore.swagger.io/v2/pet/findByStatus?status=available&foo=bar", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://petstore.swagger.io/v2/pet/findByStatus?status=not_a_real_status */
  async verifyGETV2PetFindByStatusWithAnInvalid(): Promise<APIResponse> {
    return this.send("GET", "https://petstore.swagger.io/v2/pet/findByStatus?status=not_a_real_status", {
      headers: {"Accept":"application/json"},
    });
  }
}
