import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

test.describe('Password Masking', () => {
  test('Verify Password field masks characters as they are typed', async ({ page }) => {
    const auth = new AuthenticationPage(page);

    // 1. Navigate to the login page and confirm the login form is displayed
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await auth.expectLoaded();

    // 2. Type 'Secr3t!Pass' into the Password field; characters render as masked bullets
    const password = page.getByPlaceholder('Password');
    await password.fill('Secr3t!Pass');
    await expect(password).toHaveValue('Secr3t!Pass');

    // 3. Inspect the Password input type attribute; it must be type='password'
    await expect(password).toHaveAttribute('type', 'password');
  });
});