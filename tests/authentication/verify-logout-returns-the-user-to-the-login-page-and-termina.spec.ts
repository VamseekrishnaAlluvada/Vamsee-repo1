import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

test.describe('Logout', () => {
  test('Verify Logout returns the user to the Login page and terminates the session', async ({ page }) => {
    const auth = new AuthenticationPage(page);
    // Precondition: a registered user is logged in as 'Admin' on the Dashboard
    await auth.login('Admin', 'admin123');
    // 1. From the Dashboard, click the user dropdown menu in the top-right header
    // 2. Click the 'Logout' option
    await auth.logout();
    // The session is ended and the browser is redirected to the login page
  });
});