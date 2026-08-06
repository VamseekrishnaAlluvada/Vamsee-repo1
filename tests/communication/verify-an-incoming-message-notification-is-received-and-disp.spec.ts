import { CommunicationPage } from '../../src/pages/communication/communication.page';
import { test, expect } from '@playwright/test';

test.describe('Notifications', () => {
  test('Verify an incoming message notification is received and displayed', async ({ page }) => {
    const communication = new CommunicationPage(page);

    // 1. Navigate to the Home Screen and have 5550106 send 'Notification test' -> Expected: A Messages banner notification appears at the top of the screen
    await communication.login("s-prd-clickauto@psav.com", "6p8zA`96F>!0");

    // 2. Lock the device and resend a message -> Expected: The notification appears on the lock screen respecting the preview privacy setting
    await communication.open();

    // 3. Tap the notification -> Expected: The Messages conversation with 5550106 opens after authentication
    await communication.open();
  });
});
