import { test, expect } from '../../../fixtures';
import { buildBooking } from '../../../data/booking.factory';
import { Booking } from '../../../lib/types';

/**
 * Suite: booking-boundary (P2). Categories: boundary.
 * Exercises edge values that are valid but at the limits of the schema.
 * Driven through the BookingService (POM).
 */
test.describe('@parallel booking boundary', () => {
  const cases: { name: string; overrides: Partial<Booking> }[] = [
    { name: 'totalprice at zero boundary', overrides: { totalprice: 0 } },
    { name: 'very large totalprice', overrides: { totalprice: 2_147_483_647 } },
    { name: 'without optional additionalneeds', overrides: { additionalneeds: undefined } },
  ];

  for (const { name, overrides } of cases) {
    test(`${name} is accepted @boundary`, async ({
      bookingService,
      testDataContext,
    }) => {
      const payload = buildBooking(overrides);
      // Ensure the optional field is truly absent when testing that case.
      if (overrides.additionalneeds === undefined && 'additionalneeds' in overrides) {
        delete (payload as Partial<Booking>).additionalneeds;
      }

      const res = await bookingService.create(payload, {
        stepLabel: `create booking (${name})`,
      });
      expect(res.status).toBe(200);
      testDataContext.track({
        kind: 'booking',
        id: res.data.bookingid,
        label: `boundary:${name}`,
      });
      expect(res.data.booking.totalprice).toBe(payload.totalprice);
    });
  }
});
