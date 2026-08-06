import { LocationPage } from '../../src/pages/location/location.page';
import { test, expect } from '@playwright/test';

test.describe('Maps Navigation', () => {
  test('Verify Maps starts turn-by-turn navigation to a destination', async ({ page }) => {
    const username = 's-prd-clickauto@psav.com';
    const password = '6p8zA`96F>!0';
    const location = new LocationPage(page);

    // Navigate to the Location area and sign in as USER (first action loads the app).
    await location.login(username, password);

    // 1. Open Maps, search for 'San Francisco International Airport', and select the result -> The destination card displays with a 'Directions' option

    // 2. Tap 'Directions' and choose the Drive route -> A route with distance and ETA is calculated and shown

    // 3. Tap 'Go' -> Turn-by-turn navigation begins with the first maneuver and voice guidance
  });
});
