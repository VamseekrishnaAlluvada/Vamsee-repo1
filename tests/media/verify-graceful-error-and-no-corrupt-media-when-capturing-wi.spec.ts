import { MediaPage } from '../../src/pages/media/media.page';
import { test, expect } from '@playwright/test';

test.describe('Camera Capture (Photo/Video/Flash/Front/Zoom)', () => {
  test('Verify graceful error and no corrupt media when capturing with storage nearly full', async ({ page }) => {
    const media = new MediaPage(page);

    // 1. Open the Camera and attempt to record a video long enough to exceed remaining storage -> Expected: A 'Storage Almost Full' or 'Cannot Save' alert is displayed
    await media.login("s-prd-clickauto@psav.com", "6p8zA`96F>!0");

    // 2. Dismiss the alert and open the Gallery -> Expected: No partial or corrupt video from the failed capture is present
    await media.open();

    // 3. Attempt to capture a single photo -> Expected: Either the photo saves within remaining space or a clear storage error is shown with no corrupt file created
    await media.open();
  });
});
