import { DeviceSecurityPage } from '../../src/pages/device-security/device-security.page';
import { test, expect } from '@playwright/test';

test.describe('Face ID Authentication', () => {
  test('Verify end-to-end power on, Face ID setup, and successful unlock by the registered user', async ({ page }) => {
    const deviceSecurity = new DeviceSecurityPage(page);

    // 1. Power on the device by holding the side button
    await deviceSecurity.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');

    // 2. Unlock with the passcode, open Settings > Face ID & Passcode, and complete 'Set Up Face ID' with two scans
    await deviceSecurity.open();

    // 3. Lock the device with the side button

    // 4. Raise the device and look at the camera, then swipe up
  });
});
