import type { APIResponse } from '@playwright/test';
import { BaseApi } from '../base.api';

/**
 * SimplePriceApi — service object for the "simple-price-api" endpoints.
 *
 * One method per distinct request. Specs call these methods and assert on the
 * response; the URL, headers and payload live here and nowhere else.
 */
export class SimplePriceApi extends BaseApi {
  /** GET https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,inr */
  async verifyGETSimplePriceForBitcoinEthereumInUsd(): Promise<APIResponse> {
    return this.send("GET", "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,inr", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum */
  async rejectGETSimplePriceWith4xxWhenTheRequiredVs(): Promise<APIResponse> {
    return this.send("GET", "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum", {
      headers: {"Accept":"application/json"},
    });
  }

  /** POST https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,inr */
  async rejectPOSTSimplePriceWith4xx405SinceOnlyGET(): Promise<APIResponse> {
    return this.send("POST", "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,inr", {
      headers: {"Accept":"application/json"},
    });
  }
}
