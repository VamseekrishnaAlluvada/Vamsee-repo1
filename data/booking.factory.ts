/**
 * Faker-driven data factories. Hardcoded test data is prohibited.
 * Every test builds its own unique payload so 8 shards never collide.
 */

import { faker } from '@faker-js/faker';
import { Booking, BookingDates } from '../lib/types';

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function buildBookingDates(): BookingDates {
  const checkin = faker.date.soon({ days: 30 });
  const checkout = faker.date.soon({ days: 30, refDate: checkin });
  // Guarantee checkout strictly after checkin.
  if (checkout <= checkin) {
    checkout.setDate(checkin.getDate() + faker.number.int({ min: 1, max: 14 }));
  }
  return { checkin: isoDate(checkin), checkout: isoDate(checkout) };
}

export function buildBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    totalprice: faker.number.int({ min: 1, max: 5000 }),
    depositpaid: faker.datatype.boolean(),
    bookingdates: buildBookingDates(),
    additionalneeds: faker.helpers.arrayElement([
      'Breakfast',
      'Lunch',
      'Dinner',
      'Late checkout',
      'Extra towels',
    ]),
    ...overrides,
  };
}

/** A unique first/last name pair, useful for filter-by-name tests across shards. */
export function uniqueIdentity(): { firstname: string; lastname: string } {
  return {
    firstname: `${faker.person.firstName()}${faker.string.alphanumeric(5)}`,
    lastname: `${faker.person.lastName()}${faker.string.alphanumeric(5)}`,
  };
}
