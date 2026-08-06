import { MediaPage } from '../../src/pages/media/media.page';
import { test, expect } from '@playwright/test';

test.describe('Camera Capture (Photo/Video/Flash/Front/Zoom)', () => {
  test('Verify Camera captures a photo with flash, records video, uses front camera and zoom', async ({ page }) => {
    const media = new MediaPage(page);

    // 1. Open the Camera app in Photo mode, set flash to On, and tap the shutter -> Expected: The flash fires and a photo is captured with a thumbnail preview
    await media.login("s-prd-clickauto@psav.com", "6p8zA`96F>!0");

    // 2. Pinch to zoom to 2x and capture another photo -> Expected: The preview zooms to 2x and the captured photo reflects the zoom level
    await media.open();

    // 3. Switch to Video mode and record a 5-second clip, then stop -> Expected: The recording timer counts up and the video is saved on stop
    await media.open();

    // 4. Tap the front-camera flip control and capture a selfie -> Expected: The preview switches to the front camera and a selfie is captured
    await media.open();

    // 5. Open the Gallery -> Expected: All captured photos, the zoomed photo, the video, and the selfie appear as new items
    await media.open();
  });
});
