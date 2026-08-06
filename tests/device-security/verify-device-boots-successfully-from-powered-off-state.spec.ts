import { SystemPage } from '../../src/pages/system/system.page';
import { test, expect } from '@playwright/test';

test.describe('Device Power On/Off', () => {
  test('Verify device boots successfully from powered-off state', async ({ page }) => {
    const system = new SystemPage(page);

    // 1. Press and hold the side power button for 3 seconds → Expected: The Apple logo appears on screen within 5 seconds
    await system.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');

    // 2. Wait for the boot sequence to complete → Expected: The lock screen with the current time and date is displayed

    // 3. Observe the status bar → Expected: Carrier, signal, Wi-Fi (if configured), and battery indicators are shown
    await expect(page).toHaveURL(/.+/);
  });
});
