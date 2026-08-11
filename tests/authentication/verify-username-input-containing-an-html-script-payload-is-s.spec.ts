import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

test.describe('Field Validation', () => {
  test('Verify Username input containing an HTML/script payload is sanitized and not executed', async ({ page }) => {
    const auth = new AuthenticationPage(page);
    let dialogFired = false;
    page.on('dialog', async (dialog) => {
      dialogFired = true;
      await dialog.dismiss();
    });
    // 1. Navigate to the login page (handled by login())
    // 2. Enter the script payload into the Username field (shown as literal text, no dialog on entry)
    // 3. Enter 'admin123' into the Password field and click 'Login' -> no alert, invalid credentials
    await auth.login("<script>alert('xss')</script>", 'admin123');
    await auth.expectLoginError();
    // 4. Confirm the payload was not reflected as executable markup (no dialog was ever triggered)
    expect(dialogFired).toBe(false);
  });
});