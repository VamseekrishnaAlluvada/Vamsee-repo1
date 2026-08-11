import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

test.describe('User Login', () => {
  test("Verify login fails with 'Invalid credentials' for a wrong password", async ({ page }) => {
    const auth = new AuthenticationPage(page);

    // 1. Navigate to the OrangeHRM login page -> Login form is displayed
    await page.goto(BASE_URL);
    await auth.expectLoaded();

    // 2. Enter 'Admin' into the Username field -> Username field shows 'Admin'
    // 3. Enter 'wrongPass999' into the Password field -> Password field shows masked characters
    // 4. Click the 'Login' button -> 'Invalid credentials' error is displayed and the URL remains on the login page; no redirect to Dashboard
    await auth.login('Admin', 'wrongPass999');
    await auth.expectLoginError();
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
