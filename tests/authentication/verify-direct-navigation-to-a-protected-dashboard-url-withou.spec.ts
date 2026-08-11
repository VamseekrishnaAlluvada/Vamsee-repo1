import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

test.describe('User Login', () => {
  test('Verify direct navigation to a protected Dashboard URL without a session redirects to Login', async ({ page }) => {
    const auth = new AuthenticationPage(page);
    // 1. Ensure no session exists by clearing cookies
    await page.context().clearCookies();
    // 2. Navigate directly to the protected Dashboard URL
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
    // The application redirects to the login page and renders no Dashboard content
    await auth.expectLoaded();
  });
});