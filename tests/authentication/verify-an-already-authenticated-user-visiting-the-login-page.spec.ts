import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

test.describe('Session Creation', () => {
  test('Verify an already-authenticated user visiting the Login page is redirected to the Dashboard', async ({ page }) => {
    const auth = new AuthenticationPage(page);

    // Precondition: establish an active authenticated session on the Dashboard
    await auth.login('Admin', 'admin123');
    expect(page.url()).toContain('/dashboard/index');

    // 1. While logged in, enter the login URL https://opensource-demo.orangehrmlive.com/web/index.php/auth/login in the address bar → Expected: The login form is not shown
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    // 2. Observe the resulting page → Expected: The application redirects the active user to the Dashboard (URL contains /dashboard/index)
    await page.waitForURL(/\/dashboard\/index/, { timeout: 15000 });
    expect(page.url()).toContain('/dashboard/index');
  });
});
