import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

test.describe('Keyboard Submission', () => {
  test("Verify pressing Enter with empty fields triggers 'Required' validation instead of submitting", async ({ page }) => {
    const auth = new AuthenticationPage(page);

    // 1. Navigate to the login page and confirm both fields are empty
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await auth.expectLoaded();

    // 2. Click into the Username field to give it focus, leaving both fields empty
    const username = page.getByPlaceholder('Username');
    await username.click();

    // 3. Press Enter and expect a 'Required' validation message with no submission
    await username.press('Enter');
    await expect(page.getByText('Required')).toBeVisible({ timeout: 15000 });
    await expect(page).toHaveURL(/login/);
  });
});