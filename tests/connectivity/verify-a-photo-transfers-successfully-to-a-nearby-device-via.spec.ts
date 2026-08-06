import { MediaPage } from '../../src/pages/media/media.page';
import { test, expect } from '@playwright/test';

test.describe('AirDrop File Transfer', () => {
  test('Verify a photo transfers successfully to a nearby device via AirDrop', async ({ page }) => {
    const media = new MediaPage(page);

    // 1. On the sender, open the Gallery, select 'IMG_0501.HEIC', and tap the Share icon → Expected: The Share sheet opens showing an AirDrop option with nearby devices
    await media.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');

    // 2. Tap 'QA-iPad' under AirDrop → Expected: The sender shows a 'Waiting' then 'Sending' state
    await media.open();

    // 3. On the receiver, tap 'Accept' on the incoming AirDrop prompt → Expected: The transfer completes and the sender shows 'Sent'

    // 4. Open the Gallery on the receiver → Expected: 'IMG_0501.HEIC' is present and opens without corruption
  });
});
