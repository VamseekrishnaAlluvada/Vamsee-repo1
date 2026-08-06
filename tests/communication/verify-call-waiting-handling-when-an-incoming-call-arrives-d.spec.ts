import { CommunicationPage } from '../../src/pages/communication/communication.page';
import { test, expect } from '@playwright/test';

test.describe('Phone Calls (Incoming/Outgoing)', () => {
  test('Verify call-waiting handling when an incoming call arrives during an active call', async ({ page }) => {
    const communication = new CommunicationPage(page);

    // 1. While on the active call with 5550102, have 5550103 dial the device → Expected: A call-waiting banner shows 5550103 with 'Hold & Accept', 'End & Accept', and 'Decline' options
    await communication.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');
    await communication.open();

    // 2. Tap 'Hold & Accept' → Expected: The first call is placed on hold and the second call with 5550103 becomes active

    // 3. Tap the held call at the top to swap back to 5550102 → Expected: The first call resumes as active and the second is held; both audio paths function on swap
  });
});
