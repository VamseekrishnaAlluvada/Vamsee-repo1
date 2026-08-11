import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

test.describe('Session Creation', () => {
  test('Verify direct navigation to a protected URL without a session redirects to Login', async ({ page }) => {
    const auth = new AuthenticationPage(page);

    // 1. Ensure no user is logged in, then enter the protected URL https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index directly in the address bar → Expected: The application does not render the Dashboard
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');

    // 2. Observe the resulting page → Expected: The user is redirected to the Login page (URL contains /auth/login) and the login form is displayed
    await page.waitForURL(/\/auth\/login/, { timeout: 15000 });
    expect(page.url()).toContain('/auth/login');
    await auth.expectLoaded();
  });
});
