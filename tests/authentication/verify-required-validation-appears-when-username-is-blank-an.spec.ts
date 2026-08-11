import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

test.describe('Field Validation', () => {
  test("Verify 'Required' validation appears when Username is blank and Login is clicked", async ({ page }) => {
    const auth = new AuthenticationPage(page);

    // 1. Navigate to the login page and confirm both fields are empty
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await auth.expectLoaded();

    // 2. Leave the Username field blank and enter 'admin123' into the Password field
    await page.getByPlaceholder('Password').fill('admin123');

    // 3. Click the 'Login' button and expect a 'Required' message beneath Username, staying on the login page
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.getByText('Required')).toBeVisible({ timeout: 15000 });
    await expect(page).toHaveURL(/login/);
  });
});