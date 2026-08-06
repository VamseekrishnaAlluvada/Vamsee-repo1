import { CommunicationPage } from '../../src/pages/communication/communication.page';
import { test, expect } from '@playwright/test';

test.describe('Emergency Call', () => {
  test('Verify Emergency Caller is denied access to owner features from the locked device', async ({ page }) => {
    const communication = new CommunicationPage(page);

    // 1. From the lock screen, open the Emergency Call screen
    await communication.login('s-prd-clickauto@psav.com', '6p8zA`96F>!0');

    // 2. Attempt to return to the Home Screen to open Gallery or Messages
    await communication.open();

    // 3. Attempt to reach Settings to trigger Factory Reset or Find My iPhone
  });
});
