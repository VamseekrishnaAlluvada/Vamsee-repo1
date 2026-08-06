import { SystemPage } from '../../src/pages/system/system.page';
import { test, expect } from '@playwright/test';

test.describe('Software Update', () => {
  test('Verify a software update installs and the device boots normally after restart', async ({ page }) => {
    const username = 's-prd-clickauto@psav.com';
    const password = '6p8zA`96F>!0';
    const system = new SystemPage(page);

    // Navigate to the System area and sign in as USER (first action loads the app).
    await system.login(username, password);

    // 1. Open Settings > General > Software Update and tap 'Download and Install' -> The update downloads and prepares, then prompts to install

    // 2. Authenticate with the passcode and confirm installation -> The device installs the update and automatically restarts

    // 3. Wait for the boot sequence to complete -> The device boots normally to the lock screen with no boot loop

    // 4. Unlock and check Settings > General > About for the new version -> The version number reflects the installed update
  });
});
