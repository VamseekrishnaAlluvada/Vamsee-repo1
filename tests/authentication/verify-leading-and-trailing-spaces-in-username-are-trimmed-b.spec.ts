import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

test.describe('Field Validation', () => {
  test('Verify leading and trailing spaces in Username are trimmed before authentication', async ({ page }) => {
    const auth = new AuthenticationPage(page);
    // 1. Navigate to the login page (handled by login())
    // 2. Enter '  Admin  ' (two leading and two trailing spaces) into the Username field
    // 3. Enter 'admin123' into the Password field
    // 4. Click the 'Login' button -> surrounding spaces trimmed and authenticated
    await auth.login('  Admin  ', 'admin123');
    await expect(page).toHaveURL(/dashboard/);
  });
});