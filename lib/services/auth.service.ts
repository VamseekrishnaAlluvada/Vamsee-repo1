/**
 * AuthService — token endpoint object (`POST /auth`).
 *
 * Quirk (verified live): restful-booker returns HTTP 200 for BOTH a successful
 * token creation and bad credentials (the latter carries `{ reason }` and no
 * `token`). Callers assert on the body, not the status.
 */

import { ApiResponse, AuthRequest, AuthResponse } from '../types';
import { BaseService, ServiceCallOptions } from './base.service';

export class AuthService extends BaseService {
  protected readonly resource = '/auth';

  /** Create an auth token from credentials. */
  createToken(
    credentials: AuthRequest,
    opts: ServiceCallOptions = {},
  ): Promise<ApiResponse<AuthResponse>> {
    return this.client.post<AuthRequest, AuthResponse>(this.path(), credentials, {
      expectedStatus: opts.expectedStatus ?? 200,
      responseSchema: opts.skipSchemaValidation ? undefined : 'AuthResponse',
      skipSchemaValidation: opts.skipSchemaValidation,
      headers: opts.headers,
      stepLabel: opts.stepLabel ?? 'create token',
    });
  }
}
