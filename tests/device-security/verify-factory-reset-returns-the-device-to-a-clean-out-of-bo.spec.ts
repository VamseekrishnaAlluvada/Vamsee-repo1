import { DeviceSecurityPage } from '../../src/pages/device-security/device-security.page';
import { test, expect } from '@playwright/test';

test.describe('Factory Reset', () => {
  test('Verify factory reset returns the device to a clean out-of-box state', async ({ page }) => {
    const username = 's-prd-clickauto@psav.com';
    const password = '6p8zA`96F>!0';
    const deviceSecurity = new DeviceSecurityPage(page);

    // Sign in as USER, then open the Device Security area (first action loads the app).
    await deviceSecurity.login(username, password);
    await deviceSecurity.open();

    // 1. Open Settings > General > Transfer or Reset iPhone and tap 'Erase All Content and Settings' -> A summary of items to be removed and a Continue option are shown

    // 2. Enter the device passcode and confirm the erase -> The device begins erasing and restarts to the setup 'Hello' screen

    // 3. Proceed through initial setup to a point where accounts and media can be checked -> No previous accounts, media, saved Wi-Fi, or paired devices remain; the device is in an out-of-box state
  });
});
