import { BasePage } from '../base.page';
import { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class APIPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly appHeader: Locator;

  readonly usernameInput_init = (this.usernameInput = this.page.locator('input[name="loginfmt"], input[type="email"], input[name="username"], input[type="text"]').first());
  readonly passwordInput_init = (this.passwordInput = this.page.locator('input[name="passwd"], input[type="password"]').first());
  readonly signInButton_init = (this.signInButton = this.page.locator('input[type="submit"], button[type="submit"], #idSIButton9').first());
  readonly appHeader_init = (this.appHeader = this.page.getByRole('banner').first());

  private offIdp(u: URL | string): boolean {
    return !/login\.microsoftonline|okta|auth0|accounts\.google|login\.windows/i.test(u.toString());
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.goto('');
    const loginUrl = this.page.url();

    // If the entry page has no credential inputs but exposes an SSO / continue
    // button, hop to the external identity provider.
    const directUser = this.page.locator('input[name="username"], input[type="email"], input[type="text"]').first();
    const hasDirectForm = await directUser.isVisible({ timeout: 5000 }).catch(() => false);

    if (!hasDirectForm) {
      const ssoButton = this.page.getByRole('button', { name: /continue|sign in|log ?in|microsoft|sso/i }).first();
      if (await ssoButton.isVisible().catch(() => false)) {
        await ssoButton.click();
      }
    }

    const emailField = this.page.locator('input[name="loginfmt"], input[type="email"], input[name="username"], input[type="text"]').first();
    await emailField.waitFor({ state: 'visible', timeout: 30000 });
    await emailField.fill(username);
    await this.page.locator('input[type="submit"], button[type="submit"], #idSIButton9').first().click();

    const passwordField = this.page.locator('input[name="passwd"], input[type="password"]').first();
    await passwordField.waitFor({ state: 'visible', timeout: 30000 });
    await passwordField.fill(password);
    await this.page.locator('input[type="submit"], button[type="submit"], #idSIButton9').first().click();

    // Handle an optional "Stay signed in?" interstitial (identified by TEXT).
    await Promise.race([
      this.page.waitForURL((u) => this.offIdp(u), { timeout: 45000 }).catch(() => {}),
      this.page.getByText(/stay signed in\?/i).waitFor({ state: 'visible', timeout: 45000 }).catch(() => {}),
    ]);
    if (!this.offIdp(this.page.url()) && (await this.page.getByText(/stay signed in\?/i).isVisible().catch(() => false))) {
      await this.page.locator('#idSIButton9, input[type="submit"], button[type="submit"]').first().click();
    }

    // Finish by confirming we left both the IdP and the original login url.
    await this.page.waitForURL((u) => this.offIdp(u), { timeout: 45000 });
    await this.page.waitForURL((u) => u.toString() !== loginUrl, { timeout: 30000 }).catch(() => {});
  }

  async expectLoaded(): Promise<void> {
    // Assert a post-login landmark of the application shell is present.
    await expect(this.page.getByRole('banner').or(this.page.getByRole('navigation')).first()).toBeVisible({ timeout: 30000 });
  }
}
