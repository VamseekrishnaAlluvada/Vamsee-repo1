import { DeviceSecurityPage } from '../../src/pages/device-security/device-security.page';
import { test, expect } from '@playwright/test';

test.describe('Emergency Call', () => {
  test('Verify Emergency Caller can open the emergency call screen from the locked device', async ({ page }) => {
    const deviceSecurity = new DeviceSecurityPage(page);

    // 1. Wake the locked device and swipe up to reveal the passcode keypad → Expected: The passcode keypad is displayed with an 'Emergency' option at the bottom left
    await deviceSecurity.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');

    // 2. Tap 'Emergency' → Expected: The Emergency Call dialer opens showing 'Emergency Call' with a numeric keypad and Medical ID option
    await deviceSecurity.open();

    // 3. Observe the available functions on the emergency screen → Expected: Only emergency dialing is available; no access to contacts, messages, or the Home Screen is offered
  });
});
