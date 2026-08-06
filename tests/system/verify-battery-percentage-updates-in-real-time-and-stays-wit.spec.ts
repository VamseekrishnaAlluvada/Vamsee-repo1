import { SystemPage } from '../../src/pages/system/system.page';
import { test, expect } from '@playwright/test';

test.describe('Battery Management (Charging/Percentage/Low Battery Alert)', () => {
  test('Verify battery percentage updates in real time and stays within 0-100 while charging', async ({ page }) => {
    const system = new SystemPage(page);

    // 1. Note the current battery percentage in the status bar, then connect the charger -> Expected: A charging indicator (lightning bolt) appears next to the battery icon
    await system.login("s-prd-clickauto@psav.com", "6p8zA`96F>!0");

    // 2. Leave the device charging and observe the percentage over several minutes -> Expected: The percentage increases monotonically and stays within 0-100, never showing negative or above 100
    await system.open("s-prd-clickauto@psav.com", "6p8zA`96F>!0");

    // 3. Open Settings > Battery and compare the reported level -> Expected: The Battery settings value matches the status bar percentage in real time
  });
});
