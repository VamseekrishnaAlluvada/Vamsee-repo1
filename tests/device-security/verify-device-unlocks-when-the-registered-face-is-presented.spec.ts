import { DeviceSecurityPage } from '../../src/pages/device-security/device-security.page';
import { test, expect } from '@playwright/test';

test.describe('Face ID Authentication', () => {
  test('Verify device unlocks when the registered face is presented', async ({ page }) => {
    const deviceSecurity = new DeviceSecurityPage(page);

    // 1. Raise the device or tap the screen to wake it → Expected: The lock screen displays with the closed-padlock icon at the top
    await deviceSecurity.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');

    // 2. Look directly at the front camera with attention on the screen → Expected: The padlock animates to the open position and a subtle unlock haptic fires
    await deviceSecurity.open();

    // 3. Swipe up from the bottom edge → Expected: The Home Screen is displayed without a passcode prompt
  });
});
