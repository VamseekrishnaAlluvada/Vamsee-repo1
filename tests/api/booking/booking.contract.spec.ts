import { test, expect } from '../../../fixtures';
import { buildBooking, uniqueIdentity } from '../../../data/booking.factory';
import { validateSchema } from '../../../lib/schema-validator';

/**
 * Suite: booking-contract (P1). Categories: contract.
 * Explicit schema-conformance checks (beyond the service's automatic 2xx
 * validation) and verification that both auth strategies satisfy the contract.
 * Driven through the BookingService (POM).
 */
test.describe('@parallel booking contract', () => {
  test('GET /booking list conforms to BookingIdList schema @contract', async ({
    bookingService,
  }) => {
    const res = await bookingService.list(undefined, { stepLabel: 'list booking ids' });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
    // Redundant explicit assertion documents the contract at the test level.
    const result = validateSchema('BookingIdList', res.data);
    expect(result.valid, result.errors.join('; ')).toBe(true);
  });

  test('created booking is findable by name filter @contract', async ({
    bookingService,
    testDataContext,
  }) => {
    const identity = uniqueIdentity();
    const created = await bookingService.create(buildBooking(identity));
    testDataContext.track({ kind: 'booking', id: created.data.bookingid, label: 'contract-filter' });

    const list = await bookingService.list(
      { firstname: identity.firstname, lastname: identity.lastname },
      { stepLabel: 'filter by unique name' },
    );
    expect(list.data.some((r) => r.bookingid === created.data.bookingid)).toBe(true);
  });

  test('basic-auth strategy satisfies the update contract @contract', async ({
    bookingService,
    testDataContext,
  }) => {
    const created = await bookingService.create(buildBooking());
    testDataContext.track({ kind: 'booking', id: created.data.bookingid, label: 'contract-basic' });

    const replacement = buildBooking();
    const updated = await bookingService.update(created.data.bookingid, replacement, {
      auth: { kind: 'basic' },
      stepLabel: 'update via basic auth',
    });
    expect(updated.status).toBe(200);
    expect(updated.data).toMatchObject(replacement as unknown as Record<string, unknown>);
  });
});
