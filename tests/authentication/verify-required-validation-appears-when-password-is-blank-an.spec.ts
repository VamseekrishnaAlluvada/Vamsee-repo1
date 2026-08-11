import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

test.describe('Field Validation', () => {
  test("Verify 'Required' validation appears when Password is blank and Login is clicked", async ({ page }) => {
    const auth = new AuthenticationPage(page);

    // 1. Navigate to the login page and confirm both fields are empty
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await auth.expectLoaded();

    // 2. Enter 'Admin' into the Username field and leave the Password field blank
    await page.getByPlaceholder('Username').fill('Admin');

    // 3. Click the 'Login' button and expect a 'Required' message beneath Password, staying on the login page
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.getByText('Required')).toBeVisible({ timeout: 15000 });
    await expect(page).toHaveURL(/login/);
  });
});