import { AuthenticationPage } from '../../src/pages/authentication/authentication.page';
import { test, expect } from '@playwright/test';

test.describe('User Login', () => {
  test('Verify credentials are submitted via HTTPS POST and never appear in the URL or query string', async ({ page }) => {
    const auth = new AuthenticationPage(page);

    // 1. Open browser dev tools, select the Network tab, and navigate to the login page → Expected: The page loads over an https:// scheme
    const loginRequestPromise = page.waitForRequest(
      (req) => req.method() === 'POST' && /auth\/validate/i.test(req.url()),
      { timeout: 30000 }
    );

    // 2. Enter 'Admin' and 'admin123' and click 'Login' while capturing network traffic → Expected: A validate/login request is captured using the POST method to an https endpoint
    await auth.login('Admin', 'admin123');
    const loginRequest = await loginRequestPromise;
    expect(loginRequest.method()).toBe('POST');
    expect(loginRequest.url()).toMatch(/^https:/);

    // 3. Inspect the captured login request's method, URL, and payload → Expected: The request method is POST; the username and password are present only in the request body/form data, not in the URL or query string
    expect(loginRequest.url()).not.toContain('admin123');
    expect(loginRequest.url()).not.toContain('password');
    const body = loginRequest.postData() ?? '';
    expect(body).toContain('username');
    expect(body).toContain('password');

    // 4. Open the browser history and address bar after login → Expected: The URL/query string and browser history contain no username or password values
    expect(page.url()).not.toContain('admin123');
    expect(page.url()).not.toContain('password');
  });
});
