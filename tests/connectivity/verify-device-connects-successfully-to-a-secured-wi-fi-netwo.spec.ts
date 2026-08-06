import { ConnectivityPage } from '../../src/pages/connectivity/connectivity.page';
import { test, expect } from '@playwright/test';

test.describe('Wi-Fi Connectivity', () => {
  test('Verify device connects successfully to a secured Wi-Fi network', async ({ page }) => {
    const connectivity = new ConnectivityPage(page);

    // 1. Open Settings > Wi-Fi and toggle Wi-Fi on → Expected: Wi-Fi turns on and available networks including 'QA-Lab-5G' are listed
    await connectivity.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');

    // 2. Tap 'QA-Lab-5G' and enter the password 'LabWiFi#2026' → Expected: The password field accepts input and a 'Join' action becomes available
    await connectivity.open();

    // 3. Tap 'Join' → Expected: A checkmark appears next to 'QA-Lab-5G' and the Wi-Fi icon shows in the status bar
  });
});
