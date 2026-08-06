import { CommunicationPage } from '../../src/pages/communication/communication.page';
import { test, expect } from '@playwright/test';

test.describe('Voicemail', () => {
  test('Verify voicemail is accessible and a message can be played', async ({ page }) => {
    const communication = new CommunicationPage(page);

    // 1. Open the Phone app and tap the 'Voicemail' tab → Expected: The voicemail list displays the message from 5550105
    await communication.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');
    await communication.open();

    // 2. Tap the voicemail from 5550105 → Expected: The message expands with a play control and scrubber

    // 3. Tap play → Expected: The voicemail audio plays through the earpiece or speaker
  });
});
