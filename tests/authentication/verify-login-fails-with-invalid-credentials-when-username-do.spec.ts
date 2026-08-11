import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

test.describe('User Login', () => {
  test("Verify login fails with 'Invalid credentials' when username does not exist", async ({ page }) => {
    const auth = new AuthenticationPage(page);

    // 1. Navigate to the login page and confirm the login form is displayed
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await auth.expectLoaded();

    // 2. Enter 'ghostUser01' into the Username field
    // 3. Enter 'admin123' into the Password field
    // 4. Click the 'Login' button and expect an 'Invalid credentials' error with no session
    await auth.login('ghostUser01', 'admin123');
    await auth.expectLoginError();
    await expect(page).toHaveURL(/login/, { timeout: 15000 });
  });
});