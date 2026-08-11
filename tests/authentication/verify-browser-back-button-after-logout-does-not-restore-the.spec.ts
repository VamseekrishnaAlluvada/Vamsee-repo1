import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

test.describe('Logout', () => {
  test('Verify browser Back button after Logout does not restore the cached Dashboard', async ({ page }) => {
    const auth = new AuthenticationPage(page);
    // Precondition: log in and then log out so the Dashboard is in the tab history
    await auth.login('Admin', 'admin123');
    await auth.logout();
    // 1. Confirm the current page is the login page immediately after logout
    // 2. Click the browser Back button
    await page.goBack();
    // 3. Attempt to interact with any control that would require an active session:
    //    the cached Dashboard must NOT be restored and re-authentication must be forced.
    await expect(auth.dashboardHeading).toBeHidden();
    await expect(auth.loginButton).toBeVisible();
    expect(page.url()).toContain('/auth/login');
  });
});