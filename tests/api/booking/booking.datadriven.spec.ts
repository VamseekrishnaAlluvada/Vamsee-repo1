import { test, expect } from '../../../fixtures';
import { buildBooking } from '../../../data/booking.factory';

/**
 * Suite: booking-datadriven (P2). Categories: data-driven.
 * A matrix of Faker-generated payloads, each an isolated test so failures are
 * attributed to a specific row and shards stay independent.
 * Driven through the BookingService (POM).
 */
const ITERATIONS = 5;

test.describe('@parallel booking data-driven', () => {
  for (let i = 0; i < ITERATIONS; i++) {
    test(`creates and round-trips booking row #${i + 1} @data-driven`, async ({
      bookingService,
      testDataContext,
    }) => {
      const payload = buildBooking();

      const created = await bookingService.create(payload, {
        stepLabel: `create row ${i + 1}`,
      });
      expect(created.status).toBe(200);
      testDataContext.track({
        kind: 'booking',
        id: created.data.bookingid,
        label: `datadriven:${i + 1}`,
      });

      const read = await bookingService.getById(created.data.bookingid, {
        stepLabel: `read row ${i + 1}`,
      });
      expect(read.data).toMatchObject(payload as unknown as Record<string, unknown>);
    });
  }
});
