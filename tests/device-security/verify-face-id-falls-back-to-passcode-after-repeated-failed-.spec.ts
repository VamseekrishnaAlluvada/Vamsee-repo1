import { DeviceSecurityPage } from '../../src/pages/device-security/device-security.page';
import { test, expect } from '@playwright/test';

test.describe('Face ID Authentication', () => {
  test('Verify Face ID falls back to passcode after repeated failed face scans', async ({ page }) => {
    const deviceSecurity = new DeviceSecurityPage(page);

    // 1. Wake the locked device and present the unregistered face → Expected: Face ID fails and the padlock shakes
    await deviceSecurity.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');

    // 2. Lower and re-raise the device to retry the failed face scan four more times → Expected: Each attempt fails; Face ID does not unlock
    await deviceSecurity.open();

    // 3. Observe the screen after the fifth failed attempt → Expected: The passcode entry keypad is automatically presented and Face ID is disabled until a valid passcode is entered
  });
});
