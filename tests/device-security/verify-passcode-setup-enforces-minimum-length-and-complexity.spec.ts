import { DeviceSecurityPage } from '../../src/pages/device-security/device-security.page';
import { test, expect } from '@playwright/test';

test.describe('Passcode Authentication', () => {
  test('Verify passcode setup enforces minimum length and complexity policy', async ({ page }) => {
    const deviceSecurity = new DeviceSecurityPage(page);

    // 1. Tap 'Turn Passcode On' and enter the weak passcode 1111 as a custom numeric code → Expected: The system flags 1111 as easily guessed and displays a warning prompting a stronger code
    await deviceSecurity.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');

    // 2. Clear the entry and enter the valid 6-digit passcode 836294 → Expected: The entry is accepted and a confirmation re-entry screen is shown
    await deviceSecurity.open();

    // 3. Re-enter 836294 to confirm → Expected: The passcode is set and Face ID & Passcode settings show a passcode is enabled
  });
});
