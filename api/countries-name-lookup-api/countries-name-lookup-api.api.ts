import type { APIResponse } from '@playwright/test';
import { BaseApi } from '../base.api';

/**
 * CountriesNameLookupApi — service object for the "countries-name-lookup-api" endpoints.
 *
 * One method per distinct request. Specs call these methods and assert on the
 * response; the URL, headers and payload live here and nowhere else.
 */
export class CountriesNameLookupApi extends BaseApi {
  /** GET https://restcountries.com/v3.1/name/india?fullText=true&fields=name,capital,population,currencies,region */
  async verifyGETV31NameIndiaWithFullTextTrueReturns(): Promise<APIResponse> {
    return this.send("GET", "https://restcountries.com/v3.1/name/india?fullText=true&fields=name,capital,population,currencies,region", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://restcountries.com/v3.1/name/zzzzzznotacountry?fullText=true&fields=name,capital,population,currencies,region */
  async return404ForGETV31NameWithANonExistent(): Promise<APIResponse> {
    return this.send("GET", "https://restcountries.com/v3.1/name/zzzzzznotacountry?fullText=true&fields=name,capital,population,currencies,region", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://restcountries.com/v3.1/name/12345?fullText=true&fields=name,capital,population,currencies,region */
  async return404ForGETV31NameIndiaFullTextTrueWhenA(): Promise<APIResponse> {
    return this.send("GET", "https://restcountries.com/v3.1/name/12345?fullText=true&fields=name,capital,population,currencies,region", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://restcountries.com/v3.1/name/india?fullText=true&fields=notarealfield */
  async rejectGETV31NameIndiaWithA4xxWhenTheFields(): Promise<APIResponse> {
    return this.send("GET", "https://restcountries.com/v3.1/name/india?fullText=true&fields=notarealfield", {
      headers: {"Accept":"application/json"},
    });
  }
}
