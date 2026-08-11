import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

test.describe('Forgot Password', () => {
  test("Verify 'Forgot your password?' link navigates to the Password Reset page", async ({ page }) => {
    const auth = new AuthenticationPage(page);

    // 1. Navigate to the login page and confirm the 'Forgot your password?' link is visible
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await auth.expectLoaded();

    // 2. Click the 'Forgot your password?' link and expect the Password Reset page
    await page.getByText('Forgot your password?').click();
    await expect(page).toHaveURL(/requestPasswordResetCode/, { timeout: 15000 });
    await expect(page.getByRole('heading', { name: /reset password/i })).toBeVisible({ timeout: 15000 });
  });
});