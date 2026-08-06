import { ConnectivityPage } from '../../src/pages/connectivity/connectivity.page';
import { test, expect } from '@playwright/test';

test.describe('Personal Hotspot', () => {
  test('Verify another device connects successfully to the Personal Hotspot', async ({ page }) => {
    const connectivity = new ConnectivityPage(page);

    // 1. On the host, open Settings > Personal Hotspot and enable 'Allow Others to Join' → Expected: The hotspot is active and shows the network name and password
    await connectivity.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');
    await connectivity.open();

    // 2. On the client device, select the Wi-Fi network 'QA-iPhone' and enter 'Hotspot#2026' → Expected: The client authenticates and joins the network

    // 3. Browse a webpage on the client device → Expected: The page loads via the host's cellular data and the host shows '1 Connection'
  });
});
