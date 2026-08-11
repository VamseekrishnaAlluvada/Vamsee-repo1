import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

test.describe('Keyboard (Enter) Submission', () => {
  test('Verify pressing Enter with valid credentials submits the login equivalent to clicking Login', async ({ page }) => {
    const auth = new AuthenticationPage(page);

    // 1. Navigate to the login page and enter 'Admin' into the Username field -> Username field shows 'Admin'
    await page.goto(BASE_URL);
    await auth.expectLoaded();

    // 2. Enter 'admin123' into the Password field -> Password field shows masked characters
    // 3. With focus in the Password field, press Enter -> login request is submitted and the user is redirected to the Dashboard, identical to clicking 'Login'
    await auth.login('Admin', 'admin123');
    await expect(page).toHaveURL(/\/dashboard\/index/);
  });
});
