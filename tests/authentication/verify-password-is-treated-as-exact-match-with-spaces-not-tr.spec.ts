import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

test.describe('Field Validation', () => {
  test('Verify Password is treated as exact-match with spaces NOT trimmed', async ({ page }) => {
    const auth = new AuthenticationPage(page);
    // 1. Navigate to the login page (handled by login())
    // 2. Enter 'Admin' into the Username field
    // 3. Enter ' admin123 ' (one leading and one trailing space) into the Password field
    // 4. Click the 'Login' button -> password not trimmed, credentials rejected
    await auth.login('Admin', ' admin123 ');
    await auth.expectLoginError();
  });
});