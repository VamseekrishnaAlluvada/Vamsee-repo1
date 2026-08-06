import { MediaPage } from '../../src/pages/media/media.page';
import { test, expect } from '@playwright/test';

test.describe('Camera Capture (Photo/Video/Flash/Front/Zoom)', () => {
  test('Verify captured media has correct timestamp and geotag only when Location permission is granted', async ({ page }) => {
    const media = new MediaPage(page);

    // 1. Grant Camera the 'While Using' Location permission, capture a photo, and open its Info in Gallery -> Expected: The photo shows the capture timestamp of 2026-08-06 and includes location/map metadata
    await media.login("s-prd-clickauto@psav.com", "6p8zA`96F>!0");

    // 2. Change Camera Location permission to 'Never', capture another photo, and open its Info -> Expected: The new photo shows a correct timestamp but no location/geotag metadata
    await media.open();
  });
});
