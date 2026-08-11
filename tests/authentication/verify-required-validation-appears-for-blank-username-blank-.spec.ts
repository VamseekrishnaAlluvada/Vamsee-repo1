import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

test.describe('Field Validation', () => {
  test("Verify 'Required' validation appears for blank Username, blank Password, and both blank", async ({ page }) => {
    const auth = new AuthenticationPage(page);

    // 1. Navigate to the login page and leave both Username and Password empty, then click 'Login' -> 'Required' under both fields; no redirect
    await page.goto(BASE_URL);
    await auth.expectLoaded();
    await auth.login('', '');
    await expect(page).toHaveURL(/\/auth\/login/);

    // 2. Enter 'Admin' into the Username field, leave Password empty, then click 'Login' -> 'Required' under Password only; authentication does not proceed
    await auth.login('Admin', '');
    await expect(page).toHaveURL(/\/auth\/login/);

    // 3. Clear the Username field, enter 'admin123' into the Password field, then click 'Login' -> 'Required' under Username only; authentication does not proceed
    await auth.login('', 'admin123');
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
