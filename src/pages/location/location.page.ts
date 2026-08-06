import { BasePage } from '../base.page';
import { Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class LocationPage extends BasePage {
  readonly heading: Locator = this.page.getByRole('heading', { name: /location/i });
  readonly navMenu: Locator = this.page.getByRole('navigation');
  readonly searchInput: Locator = this.page.getByRole('searchbox').or(this.page.getByPlaceholder(/search|location/i)).first();
  readonly mainContent: Locator = this.page.getByRole('main');

  async login(username: string, password: string): Promise<void> {
    await this.page.goto('./');
    const loginUrl = this.page.url();
    const offIdp = (u: URL | string) => !/login\.microsoftonline|okta|auth0|accounts\.google|login\.windows/i.test(u.toString());

    const emailField = this.page.locator('input[name="loginfmt"], input[type="email"], input[type="text"]').first();
    const localReady = await emailField.waitFor({ state: 'visible', timeout: 30000 }).then(() => true).catch(() => false);
    if (!localReady) {
      await this.page.getByRole('button', { name: /sign in|continue|log ?in|microsoft|sso/i }).first().click();
      await emailField.waitFor({ state: 'visible', timeout: 30000 });
    }

    await emailField.fill(username);
    await this.page.locator('input[type="submit"], button[type="submit"], #idSIButton9').first().click();

    const passwordField = this.page.locator('input[name="passwd"], input[type="password"]').first();
    await passwordField.waitFor({ state: 'visible', timeout: 30000 });
    await passwordField.fill(password);
    await this.page.locator('input[type="submit"], button[type="submit"], #idSIButton9').first().click();

    await Promise.race([
      this.page.waitForURL(offIdp, { timeout: 45000 }).catch(() => {}),
      this.page.getByText(/stay signed in\?/i).waitFor({ state: 'visible', timeout: 45000 }).catch(() => {})
    ]);
    if (!offIdp(this.page.url()) && await this.page.getByText(/stay signed in\?/i).isVisible().catch(() => false)) {
      await this.page.locator('#idSIButton9, input[type="submit"], button[type="submit"]').first().click();
    }

    await this.page.waitForURL(offIdp, { timeout: 45000 });
    await this.page.waitForURL((u) => u.toString() !== loginUrl, { timeout: 30000 }).catch(() => {});
  }

  async open(username: string, password: string): Promise<void> {
    await this.login(username, password);
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page.getByRole('main').or(this.page.getByRole('navigation')).first()).toBeVisible({ timeout: 30000 });
  }
}