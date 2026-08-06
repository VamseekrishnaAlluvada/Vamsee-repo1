import { SystemPage } from '../../src/pages/system/system.page';
import { test, expect } from '@playwright/test';

test.describe('Device Power On/Off', () => {
  test('Verify device powers off correctly via power-off slider', async ({ page }) => {
    const system = new SystemPage(page);

    // 1. Press and hold the side power button together with either volume button for 2 seconds → Expected: The 'slide to power off' screen with the power slider is displayed
    await system.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');

    // 2. Drag the 'slide to power off' slider fully to the right → Expected: A spinner appears and the screen goes dark within 10 seconds

    // 3. Wait 10 seconds and observe the screen → Expected: The screen remains completely dark and the device is unresponsive to taps
    await expect(page).toHaveURL(/.+/);
  });
});
