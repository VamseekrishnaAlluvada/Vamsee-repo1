import { SystemPage } from '../../src/pages/system/system.page';
import { test, expect } from '@playwright/test';

test.describe('Battery Management (Charging/Percentage/Low Battery Alert)', () => {
  test('Verify a low battery alert is displayed when the low battery threshold is reached', async ({ page }) => {
    const username = 's-prd-clickauto@psav.com';
    const password = '6p8zA`96F>!0';
    const system = new SystemPage(page);

    // Navigate to the System area and sign in as USER (first action loads the app).
    await system.login(username, password);

    // 1. Allow the battery to discharge to 20% while observing the screen -> The 'Low Battery' alert dialog appears offering Low Power Mode

    // 2. Observe the battery icon after dismissing the alert -> The battery icon turns red indicating a low battery state

    // 3. Continue discharge to 10% and observe -> A second low battery alert is displayed at the next threshold
  });
});
