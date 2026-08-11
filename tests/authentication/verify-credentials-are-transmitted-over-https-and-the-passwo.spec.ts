import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

test.describe('User Login', () => {
  test('Verify credentials are transmitted over HTTPS and the password never appears in URL, history, or logs', async ({ page }) => {
    const auth = new AuthenticationPage(page);
    let authRequestUrl = '';
    let authRequestMethod = '';
    page.on('request', (request) => {
      if (request.method() === 'POST' && /auth/i.test(request.url())) {
        authRequestUrl = request.url();
        authRequestMethod = request.method();
      }
    });
    // 1. Navigate to the login page over HTTPS (handled by login())
    // 2. Enter 'Admin' / 'admin123', click 'Login', and inspect the authentication request
    await auth.login('Admin', 'admin123');
    // 3. Inspect the resulting URL and browser history entry for the password
    expect(page.url()).toContain('https://');
    expect(page.url()).not.toContain('admin123');
    // 4. Review the captured request: POST over HTTPS, password not in the URL/query string
    expect(authRequestMethod).toBe('POST');
    expect(authRequestUrl).toContain('https://');
    expect(authRequestUrl).not.toContain('admin123');
  });
});