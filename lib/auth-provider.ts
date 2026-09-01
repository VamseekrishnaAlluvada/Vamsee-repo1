/**
 * Token lifecycle manager. Fetches and caches the restful-booker auth token,
 * and re-fetches on demand (used by ApiClient's 401/403 retry path).
 */

import { APIRequestContext } from '@playwright/test';
import { Logger } from 'winston';
import { AuthProvider } from './api-client';
import { registerSecretValue } from './redact';
import { AuthRequest, AuthResponse } from './types';

export class BookerAuthProvider implements AuthProvider {
  private token: string | undefined;

  constructor(
    private readonly request: APIRequestContext,
    private readonly baseURL: string,
    private readonly credentials: { username: string; password: string },
    private readonly logger: Logger,
  ) {
    registerSecretValue(credentials.password);
  }

  async getToken(): Promise<string> {
    if (this.token) {
      return this.token;
    }
    return this.refreshToken();
  }

  async refreshToken(): Promise<string> {
    const body: AuthRequest = {
      username: this.credentials.username,
      password: this.credentials.password,
    };
    const res = await this.request.fetch(`${this.baseURL.replace(/\/$/, '')}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: JSON.stringify(body),
    });

    const parsed = (await res.json()) as AuthResponse;
    if (!parsed.token) {
      this.logger.error('Auth failed', { reason: parsed.reason ?? 'unknown' });
      throw new Error(
        `[auth] Failed to obtain token: ${parsed.reason ?? 'no token in response'}`,
      );
    }
    registerSecretValue(parsed.token);
    this.token = parsed.token;
    this.logger.info('Auth token acquired');
    return this.token;
  }

  getBasicCredentials(): { username: string; password: string } {
    return { ...this.credentials };
  }
}
