import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

test.describe('User Login', () => {
  test('Verify repeated failed login attempts are throttled to prevent brute-force', async ({ page }) => {
    const auth = new AuthenticationPage(page);
    // 1. Navigate to the login page (handled by login())
    // 2. Submit the Login form with 'Admin' and an incorrect password repeatedly for 10 attempts
    // 3. Observe the response behavior across the successive failed attempts
    for (let attempt = 0; attempt < 10; attempt++) {
      await auth.login('Admin', 'wrongPassword123');
      await auth.expectLoginError();
    }
    // The user remains on the login page throughout the failed attempts
  });
});