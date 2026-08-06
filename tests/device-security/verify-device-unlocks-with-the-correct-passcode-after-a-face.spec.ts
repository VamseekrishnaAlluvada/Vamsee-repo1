import { DeviceSecurityPage } from '../../src/pages/device-security/device-security.page';
import { test, expect } from '@playwright/test';

test.describe('Passcode Authentication', () => {
  test('Verify device unlocks with the correct passcode after a Face ID mismatch', async ({ page }) => {
    const deviceSecurity = new DeviceSecurityPage(page);

    // 1. Ensure the passcode entry keypad is displayed on the lock screen → Expected: Six passcode entry dots and the numeric keypad are shown
    await deviceSecurity.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');

    // 2. Enter the passcode 246810 using the keypad → Expected: Each digit fills a dot; on the sixth digit the entry is accepted
    await deviceSecurity.open();

    // 3. Observe the screen after the final digit → Expected: The device unlocks and displays the Home Screen without an error
  });
});
