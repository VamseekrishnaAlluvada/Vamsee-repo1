import { test, expect } from '../../../fixtures';
import { buildBooking } from '../../../data/booking.factory';
import { BookingPatch } from '../../../lib/types';

/**
 * Suite: booking-crud (P0). The canonical DAG happy path:
 *   createBooking -> getBooking -> updateBooking (PUT) -> patchBooking (PATCH) -> deleteBooking
 *
 * Driven entirely through the BookingService (POM). Every 2xx is schema-validated
 * inside the service/client before functional assertions. The created resource is
 * registered for reverse-order cleanup (and also deleted explicitly here to assert
 * the delete contract).
 */
test.describe('@parallel booking lifecycle', () => {
  test('full lifecycle create -> read -> update -> patch -> delete @positive @contract', async ({
    bookingService,
    testDataContext,
  }) => {
    // --- CREATE ------------------------------------------------------------
    const payload = buildBooking();
    const created = await bookingService.create(payload);
    expect(created.status).toBe(200);
    const bookingId = created.data.bookingid;
    expect(bookingId).toBeGreaterThan(0);
    // Register for LIFO cleanup even if a later assertion throws.
    testDataContext.track({ kind: 'booking', id: bookingId, label: 'crud' });
    expect(created.data.booking).toMatchObject(payload as unknown as Record<string, unknown>);

    // --- READ --------------------------------------------------------------
    const read = await bookingService.getById(bookingId);
    expect(read.status).toBe(200);
    expect(read.data).toMatchObject(payload as unknown as Record<string, unknown>);

    // --- UPDATE (PUT, full replace, auth required) -------------------------
    const replacement = buildBooking();
    const updated = await bookingService.update(bookingId, replacement);
    expect(updated.status).toBe(200);
    expect(updated.data).toMatchObject(replacement as unknown as Record<string, unknown>);
    expect(updated.data.firstname).not.toBe(payload.firstname);

    // --- PATCH (partial update, auth required) -----------------------------
    const patch: BookingPatch = { additionalneeds: 'Champagne on arrival' };
    const patched = await bookingService.patch(bookingId, patch);
    expect(patched.status).toBe(200);
    expect(patched.data.additionalneeds).toBe('Champagne on arrival');
    // Unpatched fields retain their PUT-replaced values.
    expect(patched.data.firstname).toBe(replacement.firstname);

    // --- DELETE (auth required, returns 201) -------------------------------
    const deleted = await bookingService.remove(bookingId);
    expect(deleted.status).toBe(201);

    // --- VERIFY GONE -------------------------------------------------------
    const gone = await bookingService.getById(bookingId, {
      expectedStatus: 404,
      skipSchemaValidation: true,
      stepLabel: 'verify deleted',
    });
    expect(gone.status).toBe(404);
  });
});
