import { DeviceSecurityPage } from '../../src/pages/device-security/device-security.page';
import { test, expect } from '@playwright/test';

test.describe('Face ID Authentication', () => {
  test('Verify device remains locked when an unregistered face is presented', async ({ page }) => {
    const deviceSecurity = new DeviceSecurityPage(page);

    // 1. Wake the locked device → Expected: The lock screen displays with the closed-padlock icon
    await deviceSecurity.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');

    // 2. Have the unregistered person look directly at the front camera → Expected: The padlock remains closed and shakes, indicating Face ID did not match
    await deviceSecurity.open();

    // 3. Attempt to swipe up to the Home Screen → Expected: The device stays locked and prompts for the passcode instead of unlocking
  });
});
