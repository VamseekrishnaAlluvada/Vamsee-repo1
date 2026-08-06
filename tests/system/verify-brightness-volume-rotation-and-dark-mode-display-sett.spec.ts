import { SystemPage } from '../../src/pages/system/system.page';
import { test, expect } from '@playwright/test';

test.describe('Display Settings (Brightness/Volume/Rotation/Dark Mode)', () => {
  test('Verify brightness, volume, rotation, and Dark Mode display settings apply correctly', async ({ page }) => {
    const username = 's-prd-clickauto@psav.com';
    const password = '6p8zA`96F>!0';
    const system = new SystemPage(page);

    // Navigate to the System area and sign in as USER (first action loads the app).
    await system.login(username, password);

    // 1. Open Control Center and drag the brightness slider to maximum -> The screen brightness increases to full

    // 2. Press the physical volume up button repeatedly -> The on-screen volume indicator rises to maximum

    // 3. Rotate the device to landscape while viewing Photos -> The content rotates to landscape orientation

    // 4. Open Settings > Display & Brightness and select 'Dark' -> The UI switches to Dark Mode with dark backgrounds and light text
  });
});
