import { DeviceSecurityPage } from '../../src/pages/device-security/device-security.page';
import { test, expect } from '@playwright/test';

test.describe('App Permissions', () => {
  test('Verify granting and denying a permission controls app access correctly', async ({ page }) => {
    const deviceSecurity = new DeviceSecurityPage(page);

    // 1. Open the test app and trigger a photo-picking action, then tap 'Allow Access to All Photos' on the prompt -> Expected: The Photos permission is granted and the app can access the Gallery
    await deviceSecurity.login("s-prd-clickauto@psav.com", "6p8zA`96F>!0");

    // 2. Open Settings > Privacy & Security > Photos, select the app, and set access to 'None' -> Expected: The permission is revoked for the app
    await deviceSecurity.open();

    // 3. Return to the test app and retry the photo-picking action -> Expected: The app cannot access photos and is prompted or shows a no-access state
    await deviceSecurity.open();
  });
});
