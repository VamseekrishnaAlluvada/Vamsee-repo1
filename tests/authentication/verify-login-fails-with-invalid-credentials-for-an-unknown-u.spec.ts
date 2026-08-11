import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

test.describe('User Login', () => {
  test("Verify login fails with 'Invalid credentials' for an unknown username with a valid password", async ({ page }) => {
    const auth = new AuthenticationPage(page);

    // 1. Navigate to the OrangeHRM login page -> Login form is displayed
    await page.goto(BASE_URL);
    await auth.expectLoaded();

    // 2. Enter 'NonExistentUser' into the Username field -> Username field shows the entered value
    // 3. Enter 'admin123' into the Password field -> Password field shows masked characters
    // 4. Click the 'Login' button -> 'Invalid credentials' error is displayed; user remains on the Login page and is not redirected
    await auth.login('NonExistentUser', 'admin123');
    await auth.expectLoginError();
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
