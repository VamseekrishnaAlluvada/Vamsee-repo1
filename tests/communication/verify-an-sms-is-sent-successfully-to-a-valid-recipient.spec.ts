import { CommunicationPage } from '../../src/pages/communication/communication.page';
import { test, expect } from '@playwright/test';

test.describe('SMS Messaging', () => {
  test('Verify an SMS is sent successfully to a valid recipient', async ({ page }) => {
    const communication = new CommunicationPage(page);

    // 1. Open Messages, start a new message to 5550106 → Expected: A new conversation opens with the recipient field populated
    await communication.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');
    await communication.open();

    // 2. Type 'QA test SMS 2026-08-06' and tap the send arrow → Expected: The bubble sends as a green SMS bubble

    // 3. Confirm delivery on the recipient device → Expected: The recipient receives 'QA test SMS 2026-08-06' as an SMS
  });
});
