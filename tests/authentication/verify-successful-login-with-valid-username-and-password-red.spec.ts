import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

test.describe('User Login', () => {
  test('Verify successful login with valid username and password redirects to Dashboard', async ({ page }) => {
    const auth = new AuthenticationPage(page);

    // 1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login -> Login page loads showing branding, Username field, Password field, Login button, and the 'Forgot your password?' link
    await page.goto(BASE_URL);
    await auth.expectLoaded();

    // 2. Enter 'Admin' into the field labelled 'Username' -> Username field shows 'Admin'; no validation message
    // 3. Enter 'admin123' into the field labelled 'Password' -> Password field shows masked characters; no validation message
    // 4. Click the 'Login' button -> user is redirected to the Dashboard (URL contains /dashboard/index) and the top-bar user menu is displayed
    await auth.login('Admin', 'admin123');
    await expect(page).toHaveURL(/\/dashboard\/index/);
  });
});
