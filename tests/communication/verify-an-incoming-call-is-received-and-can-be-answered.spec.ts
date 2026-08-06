import { CommunicationPage } from '../../src/pages/communication/communication.page';
import { test, expect } from '@playwright/test';

test.describe('Phone Calls (Incoming/Outgoing)', () => {
  test('Verify an incoming call is received and can be answered', async ({ page }) => {
    const communication = new CommunicationPage(page);

    // 1. From the second phone, dial the device under test → Expected: The incoming call screen displays the caller number 5550101 with Accept and Decline options
    await communication.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');
    await communication.open();

    // 2. Tap 'Accept' → Expected: The call connects and the in-call screen shows an active call timer

    // 3. Speak and confirm two-way audio, then tap 'End' → Expected: Both parties hear each other and the call ends cleanly
  });
});
