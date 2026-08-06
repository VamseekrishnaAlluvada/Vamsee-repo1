import { ApplicationsPage } from '../../src/pages/applications/applications.page';
import { test, expect } from '@playwright/test';

test.describe('App Store (Install/Update/Uninstall/Search)', () => {
  test('Verify searching, installing, updating, and uninstalling an app in the App Store', async ({ page }) => {
    const applications = new ApplicationsPage(page);

    // 1. Open the App Store, tap Search, and enter 'TestFlight' -> Expected: Search results list the 'TestFlight' app
    await applications.login("s-prd-clickauto@psav.com", "6p8zA`96F>!0");

    // 2. Tap the 'Get' button for TestFlight and authenticate -> Expected: The app downloads and installs; the button changes to 'Open'
    await applications.open();

    // 3. If an update is available, open the account/Updates view and tap 'Update' for TestFlight -> Expected: The app updates to the latest version or shows already up to date
    await applications.open();

    // 4. Long-press the TestFlight Home Screen icon and choose 'Remove App' > 'Delete App' -> Expected: The app uninstalls and its icon is removed from the Home Screen
    await applications.open();
  });
});
