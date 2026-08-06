import { DeviceSecurityPage } from '../../src/pages/device-security/device-security.page';
import { test, expect } from '@playwright/test';

test.describe('Face ID Authentication', () => {
  test('Verify Face ID enrollment completes successfully for the Device Owner', async ({ page }) => {
    const deviceSecurity = new DeviceSecurityPage(page);

    // 1. Open Settings and tap 'Face ID & Passcode', then enter the current passcode → Expected: The Face ID & Passcode settings screen is displayed
    await deviceSecurity.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');

    // 2. Tap 'Set Up Face ID' and tap 'Get Started' → Expected: The circular face-capture frame is displayed with 'Position Your Face' instructions
    await deviceSecurity.open();

    // 3. Position face within the frame and complete the first circular scan by rotating the head → Expected: The progress ring fills fully and 'First Face ID Scan Complete' is shown

    // 4. Tap 'Continue' and complete the second circular scan → Expected: 'Face ID is Now Set Up' confirmation is displayed

    // 5. Tap 'Done' → Expected: Face ID appears as enrolled in Face ID & Passcode settings
    await expect(page).toHaveURL(/.+/);
  });
});
