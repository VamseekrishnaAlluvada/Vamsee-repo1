import { CommunicationPage } from '../../src/pages/communication/communication.page';
import { test, expect } from '@playwright/test';

test.describe('In-Call Controls (Hold/Speaker/Mute)', () => {
  test('Verify in-call hold, speaker, and mute controls function during an active call', async ({ page }) => {
    const communication = new CommunicationPage(page);

    // 1. Tap and hold the 'Mute' button label, then tap 'Hold' on the in-call screen → Expected: The call shows 'On Hold' and both parties hear no audio
    await communication.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');
    await communication.open();

    // 2. Tap 'Hold' again to resume, then tap 'Speaker' → Expected: The call resumes and audio routes to the loudspeaker; the Speaker button is highlighted

    // 3. Tap 'Mute' → Expected: The microphone is muted, the Mute button highlights, and the remote party no longer hears local audio

    // 4. Tap 'Mute' again to unmute → Expected: The microphone re-activates and two-way audio resumes
  });
});
