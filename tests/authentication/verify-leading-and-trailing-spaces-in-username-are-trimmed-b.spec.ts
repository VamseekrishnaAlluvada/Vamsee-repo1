import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

test.describe('Field Validation', () => {
  test('Verify leading and trailing spaces in Username are trimmed before authentication', async ({ page }) => {
    const auth = new AuthenticationPage(page);

    // 1. Navigate to the login page and enter '  Admin  ' (with leading and trailing space) into the Username field -> field shows the value including the spaces
    await page.goto(BASE_URL);
    await auth.expectLoaded();

    // 2. Enter 'admin123' into the Password field -> Password field shows masked characters
    // 3. Click the 'Login' button -> surrounding spaces are trimmed, credentials match, and the user is redirected to the Dashboard
    await auth.login('  Admin  ', 'admin123');
    await expect(page).toHaveURL(/\/dashboard\/index/);
  });
});
