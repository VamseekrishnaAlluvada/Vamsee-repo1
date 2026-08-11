import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

test.describe('Password Masking', () => {
  test('Verify Password field masks entered characters on screen', async ({ page }) => {
    const auth = new AuthenticationPage(page);

    // 1. Navigate to the login page -> Login form is displayed with an empty Password field
    await page.goto(BASE_URL);
    await auth.expectLoaded();

    // 2. Type 'admin123' into the Password field -> field displays masked characters, not the literal text
    const passwordField = page.getByPlaceholder('Password');
    await passwordField.fill('admin123');

    // 3. Inspect the Password input's type attribute -> input element has type='password', confirming masking at the DOM level
    await expect(passwordField).toHaveAttribute('type', 'password');
  });
});
