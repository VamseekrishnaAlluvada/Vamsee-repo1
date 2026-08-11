import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

test.describe('Field Validation', () => {
  test('Verify Username accepts values at the 1-character and 100-character length boundaries', async ({ page }) => {
    const auth = new AuthenticationPage(page);
    const hundredChars = 'a'.repeat(100);
    // 1. Navigate to the login page (handled by login())
    // 2. Enter the single character 'a' into Username, 'admin123' into Password, and click 'Login'
    await auth.login('a', 'admin123');
    await auth.expectLoginError();
    // 3. Clear the fields, enter a 100-character 'a' string into Username, 'admin123' into Password, and click 'Login'
    await auth.login(hundredChars, 'admin123');
    await auth.expectLoginError();
  });
});