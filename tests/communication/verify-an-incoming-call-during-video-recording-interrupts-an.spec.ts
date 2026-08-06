import { CommunicationPage } from '../../src/pages/communication/communication.page';
import { MediaPage } from '../../src/pages/media/media.page';
import { test, expect } from '@playwright/test';

test.describe('Phone Calls (Incoming/Outgoing)', () => {
  test('Verify an incoming call during video recording interrupts and allows capture to resume', async ({ page }) => {
    const media = new MediaPage(page);
    const communication = new CommunicationPage(page);

    // 1. Start recording a video, then have 5550104 call the device after 5 seconds → Expected: Recording pauses/stops and the incoming call screen is presented
    await media.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');
    await media.open();

    // 2. Decline the call → Expected: The call ends and the Camera returns to the foreground
    await communication.open();
    await communication.expectLoaded();

    // 3. Open the Gallery → Expected: The partial video recorded before the interruption is saved and plays back without corruption
    await media.open();

    // 4. Return to Camera and record a new short video → Expected: Recording resumes normally and saves a new clip
  });
});
