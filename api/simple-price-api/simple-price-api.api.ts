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
  async verifyGETSimplePriceWithIdsBitcoinEthereum(): Promise<APIResponse> {
    return this.send("GET", "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,inr", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum */
  async rejectGETSimplePriceWithA4xxWhenTheRequired(): Promise<APIResponse> {
    return this.send("GET", "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd,inr */
  async rejectGETSimplePriceWithA4xxWhenTheRequired2(): Promise<APIResponse> {
    return this.send("GET", "https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd,inr", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,inr&bogusParam=abc123 */
  async confirmGETSimplePriceReturns200AndIgnoresAn(): Promise<APIResponse> {
    return this.send("GET", "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,inr&bogusParam=abc123", {
      headers: {"Accept":"application/json"},
    });
  }

  /** POST https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,inr */
  async rejectPOSTSimplePriceWithA4xxBecauseOnlyGET(): Promise<APIResponse> {
    return this.send("POST", "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,inr", {
      headers: {"Accept":"application/json"},
    });
  }
}
