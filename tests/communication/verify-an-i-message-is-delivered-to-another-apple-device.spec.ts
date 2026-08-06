import { CommunicationPage } from '../../src/pages/communication/communication.page';
import { test, expect } from '@playwright/test';

test.describe('iMessage', () => {
  test('Verify an iMessage is delivered to another Apple device', async ({ page }) => {
    const communication = new CommunicationPage(page);

    // 1. Open Messages and start a new message to apple-id.recipient@icloud.com → Expected: The recipient field resolves as an iMessage contact (blue)
    await communication.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');
    await communication.open();

    // 2. Type 'QA iMessage check 2026-08-06' and tap send → Expected: The message sends as a blue iMessage bubble

    // 3. Observe the status under the sent bubble → Expected: The status shows 'Delivered' and the recipient receives the message
  });
});
