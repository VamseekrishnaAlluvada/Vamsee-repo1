/**
 * Service Object Model barrel.
 *
 * The POM layer for this API framework: one service class per REST resource.
 * Tests import services (via fixtures) and never touch raw paths/verbs.
 */

export { BaseService } from './base.service';
export type { ServiceCallOptions } from './base.service';
export { PingService } from './ping.service';
export { AuthService } from './auth.service';
export { BookingService } from './booking.service';
