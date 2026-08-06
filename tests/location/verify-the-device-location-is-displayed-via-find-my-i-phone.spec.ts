import { LocationPage } from '../../src/pages/location/location.page';
import { test, expect } from '@playwright/test';

test.describe('Find My iPhone', () => {
  test('Verify the device location is displayed via Find My iPhone', async ({ page }) => {
    const username = 's-prd-clickauto@psav.com';
    const password = '6p8zA`96F>!0';
    const location = new LocationPage(page);

    // Navigate to the Location area and sign in as USER (first action loads the app).
    await location.login(username, password);

    // 1. On a second device, open the Find My app and select the 'Devices' tab -> The device under test is listed by name

    // 2. Tap the device under test -> The map centers on the reported device location

    // 3. Tap 'Play Sound' -> The device under test plays the Find My sound, confirming the query reached it
  });
});
