import { ConnectivityPage } from '../../src/pages/connectivity/connectivity.page';
import { test, expect } from '@playwright/test';

test.describe('Bluetooth Pairing', () => {
  test('Verify device pairs successfully with a Bluetooth accessory', async ({ page }) => {
    const connectivity = new ConnectivityPage(page);

    // 1. Open Settings > Bluetooth → Expected: Bluetooth is on and 'QA-Buds' appears under Other Devices
    await connectivity.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');

    // 2. Tap 'QA-Buds' → Expected: A pairing request is processed and a connecting indicator is shown
    await connectivity.open();

    // 3. Wait for pairing to complete → Expected: 'QA-Buds' moves to My Devices with status 'Connected'
  });
});
