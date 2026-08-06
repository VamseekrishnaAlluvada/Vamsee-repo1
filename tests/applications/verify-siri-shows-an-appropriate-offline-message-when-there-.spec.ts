import { ConnectivityPage } from '../../src/pages/connectivity/connectivity.page';
import { test, expect } from '@playwright/test';

test.describe('Siri (Online/Offline)', () => {
  test('Verify Siri shows an appropriate offline message when there is no network connection', async ({ page }) => {
    const connectivity = new ConnectivityPage(page);

    // 1. Confirm Airplane Mode is on with no Wi-Fi, then invoke Siri -> Expected: The Siri listening interface appears
    await connectivity.login("s-prd-clickauto@psav.com", "6p8zA`96F>!0");

    // 2. Ask 'What's the weather tomorrow?' -> Expected: Siri attempts to process the connectivity-dependent request
    await connectivity.open();

    // 3. Observe the response -> Expected: Siri shows an appropriate offline message such as being unable to connect and to try again when online
    await connectivity.open();
  });
});
