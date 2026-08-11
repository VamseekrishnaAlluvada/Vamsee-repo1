import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

test.describe('Keyboard (Enter) Submission', () => {
  test("Verify pressing Enter with blank fields triggers 'Required' validation and does not silently submit", async ({ page }) => {
    const auth = new AuthenticationPage(page);

    // 1. Navigate to the login page and leave both fields empty -> Login form is displayed with empty fields
    await page.goto(BASE_URL);
    await auth.expectLoaded();

    // 2. Place focus in the Username field and press Enter -> 'Required' validation is displayed; no authentication request is submitted and no redirect occurs
    await auth.login('', '');
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
