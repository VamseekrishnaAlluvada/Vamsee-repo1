import type { APIResponse } from '@playwright/test';
import { BaseApi } from '../base.api';

/**
 * ForecastApi — service object for the "forecast-api" endpoints.
 *
 * One method per distinct request. Specs call these methods and assert on the
 * response; the URL, headers and payload live here and nowhere else.
 */
export class ForecastApi extends BaseApi {
  /** GET https://api.open-meteo.com/v1/forecast?latitude=19.07&longitude=72.87&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=Asia/Kolkata */
  async verifyGETV1ForecastReturns200WithANonEmpty(): Promise<APIResponse> {
    return this.send("GET", "https://api.open-meteo.com/v1/forecast?latitude=19.07&longitude=72.87&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=Asia/Kolkata", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://api.open-meteo.com/v1/forecast?latitude=abc&longitude=72.87&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=Asia/Kolkata */
  async rejectGETV1ForecastWith400WhenLatitudeIsANon(): Promise<APIResponse> {
    return this.send("GET", "https://api.open-meteo.com/v1/forecast?latitude=abc&longitude=72.87&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=Asia/Kolkata", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://api.open-meteo.com/v1/forecast?longitude=72.87&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=Asia/Kolkata */
  async rejectGETV1ForecastWith400WhenTheRequired(): Promise<APIResponse> {
    return this.send("GET", "https://api.open-meteo.com/v1/forecast?longitude=72.87&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=Asia/Kolkata", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://api.open-meteo.com/v1/forecast?latitude=19.07&longitude=72.87&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=Asia/Kolkata&foo=bar */
  async confirmGETV1ForecastIgnoresAnUnknownQuery(): Promise<APIResponse> {
    return this.send("GET", "https://api.open-meteo.com/v1/forecast?latitude=19.07&longitude=72.87&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=Asia/Kolkata&foo=bar", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://api.open-meteo.com/v1/forecast?latitude=12.97&longitude=77.59&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia/Kolkata */
  async verifyGETV1ForecastReturns200WithANonEmpty2(): Promise<APIResponse> {
    return this.send("GET", "https://api.open-meteo.com/v1/forecast?latitude=12.97&longitude=77.59&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia/Kolkata", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://api.open-meteo.com/v1/forecast?latitude=999&longitude=77.59&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia/Kolkata */
  async rejectGETV1ForecastWith4xxWhenLatitudeIsOut(): Promise<APIResponse> {
    return this.send("GET", "https://api.open-meteo.com/v1/forecast?latitude=999&longitude=77.59&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia/Kolkata", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://api.open-meteo.com/v1/forecast?longitude=77.59&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia/Kolkata */
  async rejectGETV1ForecastWith400WhenTheRequired2(): Promise<APIResponse> {
    return this.send("GET", "https://api.open-meteo.com/v1/forecast?longitude=77.59&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia/Kolkata", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://api.open-meteo.com/v1/forecast?latitude=abc&longitude=77.59&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia/Kolkata */
  async rejectGETV1ForecastWith4xxWhenLatitudeIsANon(): Promise<APIResponse> {
    return this.send("GET", "https://api.open-meteo.com/v1/forecast?latitude=abc&longitude=77.59&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia/Kolkata", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://api.open-meteo.com/v1/forecast?latitude=12.97&longitude=77.59&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia/Kolkata&bogus_param=xyz */
  async confirmGETV1ForecastIgnoresAnUnknownQuery2(): Promise<APIResponse> {
    return this.send("GET", "https://api.open-meteo.com/v1/forecast?latitude=12.97&longitude=77.59&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia/Kolkata&bogus_param=xyz", {
      headers: {"Accept":"application/json"},
    });
  }
}
