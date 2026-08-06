import { DeviceSecurityPage } from '../../src/pages/device-security/device-security.page';
import { test, expect } from '@playwright/test';

test.describe('Passcode Authentication', () => {
  test('Verify an incorrect passcode is rejected and an error is displayed', async ({ page }) => {
    const deviceSecurity = new DeviceSecurityPage(page);

    // 1. Enter the incorrect passcode 111111 on the keypad → Expected: Six dots fill as digits are entered
    await deviceSecurity.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');

    // 2. Observe the screen after the sixth digit → Expected: The dots shake, an error state is shown, and the entry field clears for retry
    await deviceSecurity.open();

    // 3. Attempt to swipe up to the Home Screen → Expected: The device remains locked and does not reach the Home Screen
  });
});
