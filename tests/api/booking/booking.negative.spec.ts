import { test, expect } from '../../../fixtures';
import { buildBooking } from '../../../data/booking.factory';

/**
 * Suite: booking-negative (P1). Categories: negative.
 * Verifies the API rejects bad input and unauthenticated mutations correctly.
 * Note: restful-booker uses 403 (not 401) for missing auth, and 500 for
 * malformed create payloads — both verified against the live service.
 * Driven through the BookingService (POM).
 */
test.describe('@parallel booking negative', () => {
  test('GET non-existent booking returns 404 @negative', async ({
    bookingService,
  }) => {
    const res = await bookingService.getById(99999999, {
      expectedStatus: 404,
      skipSchemaValidation: true,
      stepLabel: 'get missing booking',
    });
    expect(res.status).toBe(404);
  });

  test('PUT without auth returns 403 @negative', async ({
    bookingService,
    testDataContext,
  }) => {
    // Seed a real booking to target so the 403 is about auth, not a missing id.
    const created = await bookingService.create(buildBooking(), { stepLabel: 'seed booking' });
    testDataContext.track({ kind: 'booking', id: created.data.bookingid, label: 'neg-put' });

    const res = await bookingService.update(created.data.bookingid, buildBooking(), {
      auth: { kind: 'none' },
      expectedStatus: 403,
      skipSchemaValidation: true,
      stepLabel: 'update without auth',
    });
    expect(res.status).toBe(403);
  });

  test('DELETE without auth returns 403 @negative', async ({
    bookingService,
    testDataContext,
  }) => {
    const created = await bookingService.create(buildBooking(), { stepLabel: 'seed booking' });
    testDataContext.track({ kind: 'booking', id: created.data.bookingid, label: 'neg-del' });

    const res = await bookingService.remove(created.data.bookingid, {
      auth: { kind: 'none' },
      expectedStatus: 403,
      skipSchemaValidation: true,
      stepLabel: 'delete without auth',
    });
    expect(res.status).toBe(403);
  });

  test('POST malformed payload returns 500 @negative', async ({ bookingService }) => {
    // Missing required fields -> restful-booker responds 500.
    const res = await bookingService.createRaw(
      { firstname: 'OnlyFirstName' },
      { expectedStatus: 500, stepLabel: 'create malformed booking' },
    );
    expect(res.status).toBe(500);
  });
});
