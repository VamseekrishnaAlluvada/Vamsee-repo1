import { CommunicationPage } from '../../src/pages/communication/communication.page';
import { test, expect } from '@playwright/test';

test.describe('Phone Calls (Incoming/Outgoing)', () => {
  test('Verify an outgoing call connects successfully', async ({ page }) => {
    const communication = new CommunicationPage(page);

    // 1. Open the Phone app, tap Keypad, and enter 5550102 → Expected: The dialed number 5550102 shows on the keypad display
    await communication.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');
    await communication.open();

    // 2. Tap the green call button → Expected: The call screen shows 'calling' and then connects with an active timer

    // 3. Confirm two-way audio and tap 'End' → Expected: Audio is clear both directions and the call ends
  });
});
