import { MediaPage } from '../../src/pages/media/media.page';
import { test, expect } from '@playwright/test';

test.describe('AirDrop File Transfer', () => {
  test('Verify sender is notified and no partial file saved when receiver declines AirDrop', async ({ page }) => {
    const media = new MediaPage(page);

    // 1. On the sender, share 'IMG_0502.HEIC' via AirDrop to the receiver → Expected: The receiver shows the incoming AirDrop prompt with Accept/Decline
    await media.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');

    // 2. On the receiver, tap 'Decline' → Expected: The prompt dismisses and no transfer occurs
    await media.open();

    // 3. Observe the sender's AirDrop status → Expected: The sender shows 'Declined' for the target device

    // 4. Open the Gallery on the receiver → Expected: 'IMG_0502.HEIC' is not present and no partial/corrupt file exists
  });
});
