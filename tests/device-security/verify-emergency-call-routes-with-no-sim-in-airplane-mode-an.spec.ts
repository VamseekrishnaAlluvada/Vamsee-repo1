import { DeviceSecurityPage } from '../../src/pages/device-security/device-security.page';
import { test, expect } from '@playwright/test';

test.describe('Emergency Call', () => {
  test('Verify emergency call routes with no SIM, in Airplane Mode, and with no carrier signal', async ({ page }) => {
    const deviceSecurity = new DeviceSecurityPage(page);

    // 1. Enable Airplane Mode from Control Center, then lock the device with no SIM inserted → Expected: The status bar shows the airplane icon and 'No SIM'
    await deviceSecurity.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');

    // 2. Open the Emergency Call screen from the lock screen and dial the lab-designated test emergency number → Expected: The dialer accepts the number despite no SIM and Airplane Mode
    await deviceSecurity.open();

    // 3. Tap the call button → Expected: The device attempts to connect the emergency call over any available emergency network and shows a connecting state
  });
});
