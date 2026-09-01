/**
 * BookingService — the `/booking` resource object.
 *
 * Encapsulates the full booking lifecycle (list, read, create, replace, patch,
 * delete) plus the auth expectations for each verb. Tests express intent
 * ("create a booking", "delete without auth") and this class owns the wiring:
 * paths, verbs, default auth strategy, expected statuses and schema names.
 */

import {
  ApiResponse,
  Booking,
  BookingIdList,
  BookingPatch,
  CreateBookingResponse,
} from '../types';
import { BaseService, ServiceCallOptions } from './base.service';

export class BookingService extends BaseService {
  protected readonly resource = '/booking';

  /** List booking id refs, optionally filtered by name/date query params. */
  list(
    query?: Record<string, string | number | boolean | undefined>,
    opts: ServiceCallOptions = {},
  ): Promise<ApiResponse<BookingIdList>> {
    return this.client.get<BookingIdList>(this.path(), {
      query,
      expectedStatus: opts.expectedStatus ?? 200,
      responseSchema: opts.skipSchemaValidation ? undefined : 'BookingIdList',
      skipSchemaValidation: opts.skipSchemaValidation,
      headers: opts.headers,
      stepLabel: opts.stepLabel ?? 'list bookings',
    });
  }

  /** Read a single booking by id. */
  getById(id: number, opts: ServiceCallOptions = {}): Promise<ApiResponse<Booking>> {
    return this.client.get<Booking>(this.path(id), {
      expectedStatus: opts.expectedStatus ?? 200,
      responseSchema: opts.skipSchemaValidation ? undefined : 'Booking',
      skipSchemaValidation: opts.skipSchemaValidation,
      headers: opts.headers,
      stepLabel: opts.stepLabel ?? `get booking ${id}`,
    });
  }

  /** Create a booking from a fully-typed payload. */
  create(
    body: Booking,
    opts: ServiceCallOptions = {},
  ): Promise<ApiResponse<CreateBookingResponse>> {
    return this.client.post<Booking, CreateBookingResponse>(this.path(), body, {
      expectedStatus: opts.expectedStatus ?? 200,
      responseSchema: opts.skipSchemaValidation ? undefined : 'CreateBookingResponse',
      skipSchemaValidation: opts.skipSchemaValidation,
      headers: opts.headers,
      stepLabel: opts.stepLabel ?? 'create booking',
    });
  }

  /**
   * Create from an arbitrary (possibly malformed) payload — for negative tests
   * that intentionally violate the schema. Kept typed as a record, not `any`.
   */
  createRaw(
    body: Record<string, unknown>,
    opts: ServiceCallOptions = {},
  ): Promise<ApiResponse<string>> {
    return this.client.post<Record<string, unknown>, string>(this.path(), body, {
      expectedStatus: opts.expectedStatus ?? 200,
      skipSchemaValidation: opts.skipSchemaValidation ?? true,
      headers: opts.headers,
      stepLabel: opts.stepLabel ?? 'create booking (raw payload)',
    });
  }

  /** Full replace (PUT). Requires auth — defaults to the cookie strategy. */
  update(
    id: number,
    body: Booking,
    opts: ServiceCallOptions = {},
  ): Promise<ApiResponse<Booking>> {
    return this.client.put<Booking, Booking>(this.path(id), body, {
      auth: opts.auth ?? { kind: 'cookie' },
      expectedStatus: opts.expectedStatus ?? 200,
      responseSchema: opts.skipSchemaValidation ? undefined : 'Booking',
      skipSchemaValidation: opts.skipSchemaValidation,
      headers: opts.headers,
      stepLabel: opts.stepLabel ?? `update booking ${id} (PUT)`,
    });
  }

  /** Partial update (PATCH). Requires auth — defaults to the cookie strategy. */
  patch(
    id: number,
    body: BookingPatch,
    opts: ServiceCallOptions = {},
  ): Promise<ApiResponse<Booking>> {
    return this.client.patch<BookingPatch, Booking>(this.path(id), body, {
      auth: opts.auth ?? { kind: 'cookie' },
      expectedStatus: opts.expectedStatus ?? 200,
      responseSchema: opts.skipSchemaValidation ? undefined : 'Booking',
      skipSchemaValidation: opts.skipSchemaValidation,
      headers: opts.headers,
      stepLabel: opts.stepLabel ?? `patch booking ${id} (PATCH)`,
    });
  }

  /** Delete a booking (returns 201 on success). Requires auth by default. */
  remove(id: number, opts: ServiceCallOptions = {}): Promise<ApiResponse<string>> {
    return this.client.delete<string>(this.path(id), {
      auth: opts.auth ?? { kind: 'cookie' },
      expectedStatus: opts.expectedStatus ?? 201,
      skipSchemaValidation: opts.skipSchemaValidation ?? true,
      headers: opts.headers,
      stepLabel: opts.stepLabel ?? `delete booking ${id}`,
    });
  }
}
