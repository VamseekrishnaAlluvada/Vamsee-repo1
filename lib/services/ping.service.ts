/**
 * PingService — health-check endpoint object (`GET /ping`).
 *
 * restful-booker returns 201 for a healthy ping.
 */

import { ApiResponse } from '../types';
import { BaseService, ServiceCallOptions } from './base.service';

export class PingService extends BaseService {
  protected readonly resource = '/ping';

  /** Liveness probe. Expects 201 by default. */
  healthCheck(opts: ServiceCallOptions = {}): Promise<ApiResponse<string>> {
    return this.client.get<string>(this.path(), {
      expectedStatus: opts.expectedStatus ?? 201,
      skipSchemaValidation: opts.skipSchemaValidation ?? true,
      headers: opts.headers,
      stepLabel: opts.stepLabel ?? 'health check',
    });
  }
}
