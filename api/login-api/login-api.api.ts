import type { APIResponse } from '@playwright/test';
import { BaseApi } from '../base.api';

/**
 * LoginApi — service object for the "login-api" endpoints.
 *
 * One method per distinct request. Specs call these methods and assert on the
 * response; the URL, headers and payload live here and nowhere else.
 */
export class LoginApi extends BaseApi {
  /** POST https://dummyjson.com/auth/login */
  async verifyPOSTAuthLoginWithValidCredentials(): Promise<APIResponse> {
    return this.send("POST", "https://dummyjson.com/auth/login", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"username\":\"emilys\",\"password\":\"emilyspass\",\"expiresInMins\":30}",
    });
  }

  /** POST https://dummyjson.com/auth/login */
  async rejectPOSTAuthLoginWithA4xxWhenThePassword(): Promise<APIResponse> {
    return this.send("POST", "https://dummyjson.com/auth/login", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"username\":\"emilys\",\"expiresInMins\":30}",
    });
  }

  /** POST https://dummyjson.com/auth/login */
  async rejectPOSTAuthLoginWith400WhenTheRequestBody(): Promise<APIResponse> {
    return this.send("POST", "https://dummyjson.com/auth/login", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"username\":\"emilys\",\"password\":}",
    });
  }

  /** POST https://dummyjson.com/auth/login */
  async rejectPOSTAuthLoginWithA4xxWhenThePasswordIs(): Promise<APIResponse> {
    return this.send("POST", "https://dummyjson.com/auth/login", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"username\":\"emilys\",\"password\":\"wrongpassword\",\"expiresInMins\":30}",
    });
  }

  /** POST https://dummyjson.com/auth/login */
  async rejectPOSTAuthLoginWithA4xxWhenAnEmptyJSON(): Promise<APIResponse> {
    return this.send("POST", "https://dummyjson.com/auth/login", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{}",
    });
  }
}
