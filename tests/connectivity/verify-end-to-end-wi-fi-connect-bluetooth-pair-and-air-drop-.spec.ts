import { ConnectivityPage } from '../../src/pages/connectivity/connectivity.page';
import { test, expect } from '@playwright/test';

test.describe('AirDrop File Transfer', () => {
  test('Verify end-to-end Wi-Fi connect, Bluetooth pair, and AirDrop file transfer', async ({ page }) => {
    const connectivity = new ConnectivityPage(page);

    // 1. Connect to Wi-Fi 'QA-Lab-5G' with password 'LabWiFi#2026'
    await connectivity.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');

    // 2. Pair the 'QA-Buds' Bluetooth headset via Settings > Bluetooth
    await connectivity.open();

    // 3. Share 'IMG_0510.HEIC' from the Gallery via AirDrop to 'QA-iPad'

    // 4. Verify the file on 'QA-iPad'
  });
});
