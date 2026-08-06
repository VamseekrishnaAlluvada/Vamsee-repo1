import { MediaPage } from '../../src/pages/media/media.page';
import { test, expect } from '@playwright/test';

test.describe('AirDrop File Transfer', () => {
  test('Verify AirDrop default receiving mode is not set to Everyone', async ({ page }) => {
    const media = new MediaPage(page);

    // 1. Open Settings > General > AirDrop → Expected: The AirDrop receiving options are shown
    await media.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');

    // 2. Observe the currently selected receiving mode → Expected: The default selection is 'Receiving Off' or 'Contacts Only', not 'Everyone'
    await media.open();

    // 3. From an unknown non-contact device in range, attempt to AirDrop a file to this device → Expected: No incoming AirDrop prompt appears because the device is not discoverable to the unknown sender
  });
});
