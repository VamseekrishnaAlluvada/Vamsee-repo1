import { LocationPage } from '../../src/pages/location/location.page';
import { test, expect } from '@playwright/test';

test.describe('Location Services', () => {
  test('Verify enabling Location Services provides an accurate current location', async ({ page }) => {
    const username = 's-prd-clickauto@psav.com';
    const password = '6p8zA`96F>!0';
    const location = new LocationPage(page);

    // Navigate to the Location area and sign in as USER (first action loads the app).
    await location.login(username, password);

    // 1. Open Settings > Privacy & Security > Location Services and toggle it on -> Location Services is enabled and the master toggle is green

    // 2. Open the Maps app and tap the current-location (compass) button -> Maps requests location permission if needed and centers on the current position

    // 3. Observe the blue location dot -> The blue dot reflects the actual current location with a reasonable accuracy radius
  });
});
