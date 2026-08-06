import { SystemPage } from '../../src/pages/system/system.page';
import { test, expect } from '@playwright/test';

test.describe('Battery Management (Charging/Percentage/Low Battery Alert)', () => {
  test('Verify device auto-shuts down gracefully at critical battery during an active call', async ({ page }) => {
    const username = 's-prd-clickauto@psav.com';
    const password = '6p8zA`96F>!0';
    const system = new SystemPage(page);

    // Navigate to the System area and sign in as USER (first action loads the app).
    await system.login(username, password);

    // 1. Continue the active call while the battery drains to critical level -> The device shows critical battery warnings and the call remains active until shutdown

    // 2. Allow the battery to reach the auto-shutdown threshold -> The device powers off gracefully, ending the call without a crash or reboot loop

    // 3. Connect a charger and power the device back on -> The device boots normally and no data or settings corruption is observed
  });
});
