import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

test.describe('User Login', () => {
  test("Verify login fails with 'Invalid credentials' when password is wrong", async ({ page }) => {
    const auth = new AuthenticationPage(page);

    // 1. Navigate to the login page and confirm the login form is displayed
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await auth.expectLoaded();

    // 2. Enter 'Admin' into the Username field
    // 3. Enter 'wrongPass999' into the Password field
    // 4. Click the 'Login' button and expect an 'Invalid credentials' error with no session
    await auth.login('Admin', 'wrongPass999');
    await auth.expectLoginError();
    await expect(page).toHaveURL(/login/, { timeout: 15000 });
  });
});