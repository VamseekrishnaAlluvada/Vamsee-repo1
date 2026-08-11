import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

test.describe('User Login', () => {
  test('Verify successful login with valid credentials redirects to Dashboard and creates a session', async ({ page }) => {
    const auth = new AuthenticationPage(page);

    // 1. Navigate to the login page over HTTPS and confirm the login form is displayed
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await auth.expectLoaded();

    // 2. Enter 'Admin' into the field labelled 'Username'
    // 3. Enter 'admin123' into the field labelled 'Password'
    // 4. Click the 'Login' button and expect redirect to the Dashboard
    await auth.login('Admin', 'admin123');
    await expect(page).toHaveURL(/dashboard/, { timeout: 15000 });
  });
});