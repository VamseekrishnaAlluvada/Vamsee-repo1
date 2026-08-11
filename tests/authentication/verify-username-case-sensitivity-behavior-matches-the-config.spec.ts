import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

test.describe('User Login', () => {
  test("Verify Username case-sensitivity behavior matches the configured authentication policy", async ({ page }) => {
    const authentication = new AuthenticationPage(page);

    // 1. Navigate to the login page → Expected: Login form is displayed
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await authentication.expectLoaded();

    // 2. Enter 'admin' (all lowercase) into the Username field and 'admin123' into the Password field → Expected: The fields accept the entered values
    // 3. Click the 'Login' button → Expected: For the case-sensitive OrangeHRM policy, 'admin' does not match 'Admin' and an 'Invalid credentials' error is returned rather than a successful login
    await authentication.login('admin', 'admin123');
    await authentication.expectLoginError();
  });
});