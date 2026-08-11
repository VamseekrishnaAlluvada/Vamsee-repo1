import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

test.describe('Keyboard Submission', () => {
  test('Verify pressing Enter with valid credentials submits the login form', async ({ page }) => {
    const auth = new AuthenticationPage(page);

    // 1. Navigate to the login page and confirm the login form is displayed
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await auth.expectLoaded();

    // 2. Enter 'Admin' into the Username field
    await page.getByPlaceholder('Username').fill('Admin');

    // 3. Enter 'admin123' into the Password field
    const password = page.getByPlaceholder('Password');
    await password.fill('admin123');

    // 4. With focus in the Password field, press Enter and expect redirect to the Dashboard
    await password.press('Enter');
    await expect(page).toHaveURL(/dashboard/, { timeout: 15000 });
  });
});