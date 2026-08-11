import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

test.describe('Field Validation', () => {
  test("Verify 'Required' validation appears for both fields when the form is submitted empty", async ({ page }) => {
    const auth = new AuthenticationPage(page);

    // 1. Navigate to the login page and confirm both fields are empty
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await auth.expectLoaded();

    // 2. Without entering any values, click the 'Login' button and expect a 'Required' message beneath both fields
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.getByText('Required')).toHaveCount(2, { timeout: 15000 });
    await expect(page).toHaveURL(/login/);
  });
});