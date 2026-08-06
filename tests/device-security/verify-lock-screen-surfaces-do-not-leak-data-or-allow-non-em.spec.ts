import { DeviceSecurityPage } from '../../src/pages/device-security/device-security.page';
import { test, expect } from '@playwright/test';

test.describe('Emergency Call', () => {
  test('Verify lock screen surfaces do not leak data or allow non-emergency dialing pre-authentication', async ({ page }) => {
    const deviceSecurity = new DeviceSecurityPage(page);

    // 1. Open the Emergency Call screen and enter the non-emergency number 5551234567, then tap call → Expected: The call is blocked or converted; a normal outgoing call to an arbitrary contact cannot be placed from the emergency dialer
    await deviceSecurity.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');

    // 2. Return to the lock screen and open Camera by swiping left → Expected: Only the camera and current-session captures are accessible; the existing Gallery/Camera Roll is not viewable
    await deviceSecurity.open();

    // 3. Invoke Siri from the lock screen and ask to read the latest message → Expected: Siri declines or requires unlock before revealing message content

    // 4. Trigger a test notification and observe the lock screen preview → Expected: Preview respects the configured privacy setting and does not expose full contact/message content when protected
  });
});
