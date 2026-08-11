import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

test.describe('Field Validation', () => {
  test('Verify Password leading/trailing spaces are preserved and NOT trimmed', async ({ page }) => {
    const auth = new AuthenticationPage(page);

    // 1. Navigate to the login page and enter 'Admin' into the Username field -> Username field shows 'Admin'
    await page.goto(BASE_URL);
    await auth.expectLoaded();

    // 2. Enter ' admin123 ' (with leading and trailing space) into the Password field -> Password field shows masked characters for the padded value
    // 3. Click the 'Login' button -> exact typed value is used (spaces preserved), does not match, so 'Invalid credentials' is displayed and the user remains on the Login page
    await auth.login('Admin', ' admin123 ');
    await auth.expectLoginError();
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
