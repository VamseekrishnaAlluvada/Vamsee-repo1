import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

test.describe('Logout', () => {
  test('Verify Logout returns to Login and browser Back cannot restore the authenticated Dashboard', async ({ page }) => {
    const auth = new AuthenticationPage(page);

    // 1. Log in with username 'Admin' and password 'admin123' and click 'Login' → Expected: User is authenticated and the Dashboard is displayed
    await auth.login('Admin', 'admin123');
    expect(page.url()).toContain('/dashboard/index');

    // 2. Open the top-right user dropdown menu and click 'Logout' → Expected: The user is returned to the Login page (URL contains /auth/login) and the login form is displayed
    await auth.logout();
    await page.waitForURL(/\/auth\/login/, { timeout: 15000 });
    expect(page.url()).toContain('/auth/login');

    // 3. Click the browser Back button → Expected: The Dashboard is NOT restored; the application redirects to the Login page because the session is invalidated
    await page.goBack();
    await page.waitForURL(/\/auth\/login/, { timeout: 15000 });
    expect(page.url()).toContain('/auth/login');
  });
});
