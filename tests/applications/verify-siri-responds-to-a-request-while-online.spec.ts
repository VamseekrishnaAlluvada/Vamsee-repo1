import { SystemPage } from '../../src/pages/system/system.page';
import { test, expect } from '@playwright/test';

test.describe('Siri (Online/Offline)', () => {
  test('Verify Siri responds to a request while online', async ({ page }) => {
    const system = new SystemPage(page);

    // 1. Press and hold the side button to invoke Siri -> Expected: The Siri listening interface appears
    await system.login("s-prd-clickauto@psav.com", "6p8zA`96F>!0");

    // 2. Ask 'What time is it?' -> Expected: Siri recognizes the query and processes it
    await system.open("s-prd-clickauto@psav.com", "6p8zA`96F>!0");

    // 3. Observe the response -> Expected: Siri displays and/or speaks the current local time
  });
});
