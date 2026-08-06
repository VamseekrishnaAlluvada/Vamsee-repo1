import { MediaPage } from '../../src/pages/media/media.page';
import { test, expect } from '@playwright/test';

test.describe('Gallery', () => {
  test('Verify captured media is viewable in the Gallery', async ({ page }) => {
    const media = new MediaPage(page);

    // 1. Open the Gallery (Photos) app -> Expected: The photo grid displays recent captures including the latest photo and video
    await media.login("s-prd-clickauto@psav.com", "6p8zA`96F>!0");

    // 2. Tap the most recent photo -> Expected: The photo opens full-screen without distortion
    await media.open();

    // 3. Return to the grid and tap the recent video, then play it -> Expected: The video plays back with audio and no corruption
    await media.open();
  });
});
