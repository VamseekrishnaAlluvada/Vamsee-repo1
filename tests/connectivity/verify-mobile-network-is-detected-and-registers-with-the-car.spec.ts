import { ConnectivityPage } from '../../src/pages/connectivity/connectivity.page';
import { test, expect } from '@playwright/test';

test.describe('Mobile Network', () => {
  test('Verify mobile network is detected and registers with the carrier', async ({ page }) => {
    const connectivity = new ConnectivityPage(page);

    // 1. Observe the status bar after boot → Expected: The carrier name and signal bars are displayed
    await connectivity.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');

    // 2. Open Settings > Cellular → Expected: Cellular is on and the SIM shows as active with a network selected
    await connectivity.open();

    // 3. Load a webpage in Safari with Wi-Fi disabled → Expected: The page loads over cellular data, confirming network registration
  });
});
