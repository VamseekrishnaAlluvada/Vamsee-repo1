import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

test.describe('User Login', () => {
  test('Verify SQL injection payload in login fields does not bypass authentication', async ({ page }) => {
    const auth = new AuthenticationPage(page);
    // 1. Navigate to the login page (handled by login())
    // 2. Enter the SQL injection payload into the Username field (accepted as literal text)
    // 3. Enter the SQL injection payload into the Password field and click 'Login' -> not bypassed
    await auth.login("admin' OR '1'='1", "anything' OR '1'='1");
    await auth.expectLoginError();
  });
});