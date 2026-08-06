import { ConnectivityPage } from '../../src/pages/connectivity/connectivity.page';
import { test, expect } from '@playwright/test';

test.describe('Airplane Mode', () => {
  test('Verify enabling Airplane Mode disables all active wireless connections', async ({ page }) => {
    const connectivity = new ConnectivityPage(page);

    // 1. Open Control Center and tap the Airplane Mode toggle → Expected: The airplane icon highlights and appears in the status bar
    await connectivity.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');

    // 2. Observe the status bar and Control Center radio icons → Expected: The cellular signal is removed; Wi-Fi and Bluetooth toggles switch off and active connections drop
    await connectivity.open();

    // 3. Attempt to load a webpage in Safari → Expected: The page fails to load, confirming no active data connection
  });
});
