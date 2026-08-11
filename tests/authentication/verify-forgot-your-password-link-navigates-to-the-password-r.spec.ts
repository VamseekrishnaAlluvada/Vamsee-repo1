import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

test.describe('Forgot Password Navigation', () => {
  test("Verify 'Forgot your password?' link navigates to the Password Reset page", async ({ page }) => {
    const auth = new AuthenticationPage(page);

    // 1. Navigate to the OrangeHRM login page -> the 'Forgot your password?' link is visible on the login form
    await page.goto(BASE_URL);
    await auth.expectLoaded();

    // 2. Click the 'Forgot your password?' link -> browser navigates to the Password Reset page (URL contains /auth/requestPasswordResetCode)
    await page.getByRole('link', { name: /forgot your password/i }).click();
    await expect(page).toHaveURL(/\/auth\/requestPasswordResetCode/);
  });
});
