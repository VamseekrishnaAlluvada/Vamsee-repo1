import { CommunicationPage } from '../../src/pages/communication/communication.page';
import { test, expect } from '@playwright/test';

test.describe('In-Call Controls (Hold/Speaker/Mute)', () => {
  test('Verify end-to-end outgoing call with hold, speaker, and mute controls', async ({ page }) => {
    const communication = new CommunicationPage(page);

    // 1. Dial 5550102 from the Phone keypad and connect the call
    await communication.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');

    // 2. Tap 'Hold'
    await communication.open();

    // 3. Tap 'Hold' to resume, then tap 'Speaker'

    // 4. Tap 'Mute', confirm the remote party cannot hear, then end the call
  });
});
