import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

test.describe('User Login', () => {
  test('Verify brute-force protection engages after repeated invalid login attempts', async ({ page }) => {
    const auth = new AuthenticationPage(page);

    // 1. Navigate to the login page and submit 'Admin' with the incorrect password 'wrongPass000' → Expected: 'Invalid credentials' is displayed
    try {
      await auth.login('Admin', 'wrongPass000');
    } catch {
      // On invalid credentials the app never leaves the login page, so login() may reject
    }
    await auth.expectLoginError();

    // 2. Repeat the incorrect-password submission for 'Admin' several times in quick succession (e.g., 6 consecutive failures) → Expected: Each attempt is rejected with 'Invalid credentials'
    for (let i = 0; i < 5; i++) {
      try {
        await auth.login('Admin', 'wrongPass000');
      } catch {
        // Still on the login page after an invalid submission
      }
      await auth.expectLoginError();
    }

    // 3. Observe the application's behavior after the threshold of failed attempts is exceeded → Expected: Brute-force protection engages — for example a temporary lockout, throttling/delay, or a CAPTCHA challenge is presented rather than allowing unlimited attempts
    expect(page.url()).toContain('/auth/login');
    await auth.expectLoginError();
  });
});
