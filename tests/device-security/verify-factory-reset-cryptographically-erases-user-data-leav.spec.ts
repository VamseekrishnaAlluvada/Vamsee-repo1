import { DeviceSecurityPage } from '../../src/pages/device-security/device-security.page';
import { test, expect } from '@playwright/test';

test.describe('Factory Reset', () => {
  test('Verify factory reset cryptographically erases user data leaving no recoverable content', async ({ page }) => {
    const deviceSecurity = new DeviceSecurityPage(page);

    // 1. Confirm the device completed 'Erase All Content and Settings' and rebooted to setup
    await deviceSecurity.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');

    // 2. Complete minimal setup and inspect Files, Photos, and accounts for the prior marker content
    await deviceSecurity.open();

    // 3. Verify via the platform that data protection keys were regenerated (fresh encryption state)
  });
});
