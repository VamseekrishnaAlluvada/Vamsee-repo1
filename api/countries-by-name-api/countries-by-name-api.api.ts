import type { APIResponse } from '@playwright/test';
import { BaseApi } from '../base.api';

/**
 * CountriesByNameApi — service object for the "countries-by-name-api" endpoints.
 *
 * One method per distinct request. Specs call these methods and assert on the
 * response; the URL, headers and payload live here and nowhere else.
 */
export class CountriesByNameApi extends BaseApi {
  /** GET https://restcountries.com/v3.1/name/india?fullText=true&fields=name,capital,population,currencies,region */
  async verifyGETV31NameIndiaFullTextTrueReturns200(): Promise<APIResponse> {
    return this.send("GET", "https://restcountries.com/v3.1/name/india?fullText=true&fields=name,capital,population,currencies,region", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://restcountries.com/v3.1/name/zzzznotacountry?fullText=true&fields=name,capital,population,currencies,region */
  async return404ForGETV31NameZzzznotacountryWhenThe(): Promise<APIResponse> {
    return this.send("GET", "https://restcountries.com/v3.1/name/zzzznotacountry?fullText=true&fields=name,capital,population,currencies,region", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://restcountries.com/v3.1/name/ind?fullText=true&fields=name,capital,population,currencies,region */
  async return404ForGETV31NameIndiaFullTextTrueWhen(): Promise<APIResponse> {
    return this.send("GET", "https://restcountries.com/v3.1/name/ind?fullText=true&fields=name,capital,population,currencies,region", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://restcountries.com/v3.1/name/india?fullText=true&fields=name,capital,population,currencies,region&bogusParam=xyz */
  async confirmGETV31NameIndiaIgnoresAnUnknownQuery(): Promise<APIResponse> {
    return this.send("GET", "https://restcountries.com/v3.1/name/india?fullText=true&fields=name,capital,population,currencies,region&bogusParam=xyz", {
      headers: {"Accept":"application/json"},
    });
  }
}
