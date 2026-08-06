import { MediaPage } from '../../src/pages/media/media.page';
import { test, expect } from '@playwright/test';

test.describe('Camera Capture (Photo/Video/Flash/Front/Zoom)', () => {
  test('Verify end-to-end capture of a flash photo and a video and viewing them in the Gallery', async ({ page }) => {
    const media = new MediaPage(page);

    // 1. Launch the Camera app
    await media.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');

    // 2. Capture a photo with flash On
    await media.open();

    // 3. Switch to Video mode and record a 5-second clip

    // 4. Open the Gallery and open both the photo and the video
  });
});
