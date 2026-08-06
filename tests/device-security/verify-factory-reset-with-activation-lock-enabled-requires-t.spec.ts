import { DeviceSecurityPage } from '../../src/pages/device-security/device-security.page';
import { test, expect } from '@playwright/test';

test.describe('Factory Reset', () => {
  test('Verify factory reset with Activation Lock enabled requires the owner Apple ID', async ({ page }) => {
    const username = 's-prd-clickauto@psav.com';
    const password = '6p8zA`96F>!0';
    const deviceSecurity = new DeviceSecurityPage(page);

    // Sign in as USER, then open the Device Security area (first action loads the app).
    await deviceSecurity.login(username, password);
    await deviceSecurity.open();

    // 1. Attempt 'Erase All Content and Settings' and proceed until prompted to sign out of the Apple ID -> The flow requires the owner's Apple ID password to disable Find My before erasing

    // 2. Enter an incorrect Apple ID password -> The sign-out is rejected and the erase cannot proceed

    // 3. After a hypothetical erase, boot the device to the Activation Lock screen and attempt setup without credentials -> The Activation Lock screen requires the owner Apple ID and blocks repurposing without it
  });
});
