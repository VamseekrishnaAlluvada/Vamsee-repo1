import { DeviceSecurityPage } from '../../src/pages/device-security/device-security.page';
import { test, expect } from '@playwright/test';

test.describe('Passcode Authentication', () => {
  test('Verify timed lockout escalation after repeated incorrect passcode attempts', async ({ page }) => {
    const deviceSecurity = new DeviceSecurityPage(page);

    // 1. Enter the wrong passcode 000000 five times consecutively → Expected: Each attempt is rejected; after the fifth a 'iPhone is disabled, try again in 1 minute' message appears
    await deviceSecurity.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');

    // 2. Wait for the timed disable to expire and enter 000000 a sixth time → Expected: The lockout timer escalates to a longer interval (e.g. 5 minutes) and entry remains blocked
    await deviceSecurity.open();

    // 3. Enter the correct passcode 246810 after the timer expires → Expected: The device unlocks and the failed-attempt counter resets
  });
});
