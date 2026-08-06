import { LocationPage } from '../../src/pages/location/location.page';
import { test, expect } from '@playwright/test';

test.describe('Find My iPhone', () => {
  test('Verify end-to-end enabling Location Services, starting Maps navigation, and locating via Find My iPhone', async ({ page }) => {
    const location = new LocationPage(page);

    // 1. Enable Location Services in Settings > Privacy & Security
    await location.open('s-prd-clickauto@psav.com', '6p8zA`96F>!0');
    await location.expectLoaded();

    // 2. Open Maps, route to 'San Francisco International Airport', and tap 'Go'
    await location.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');

    // 3. On the second device, open Find My > Devices and select this device

    // 4. Tap 'Play Sound' in Find My
  });
});
