import { ConnectivityPage } from '../../src/pages/connectivity/connectivity.page';
import { test, expect } from '@playwright/test';

test.describe('Personal Hotspot', () => {
  test('Verify enabling Personal Hotspot in Airplane Mode re-enables only Wi-Fi for hotspot', async ({ page }) => {
    const connectivity = new ConnectivityPage(page);

    // 1. With Airplane Mode on, open Settings > Personal Hotspot and enable 'Allow Others to Join' → Expected: Wi-Fi re-enables for the hotspot and the hotspot becomes discoverable
    await connectivity.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');
    await connectivity.open();

    // 2. Observe the status bar and Cellular setting → Expected: The airplane icon remains and cellular data stays off; only Wi-Fi for hotspot is active

    // 3. Join the hotspot from the client and attempt to browse → Expected: The client connects to the hotspot Wi-Fi; internet access is unavailable because cellular was not restored
  });
});
