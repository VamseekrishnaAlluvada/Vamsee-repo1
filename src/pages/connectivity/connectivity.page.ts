import { BasePage } from '../base.page';
import { Locator } from '@playwright/test';

export class ConnectivityPage extends BasePage {
  readonly pageHeading: Locator = this.page.getByRole('heading', { name: /connectivity/i });
  readonly mainRegion: Locator = this.page.getByRole('main');
  readonly saveButton: Locator = this.page.getByRole('button', { name: /save|apply/i });

  async login(username: string, password: string): Promise<void> {
    await this.page.goto('/navigator/');
    const loginUrl = this.page.url();
    const offIdp = (u: URL | string) => !/login\.microsoftonline|okta|auth0|accounts\.google|login\.windows/i.test(u.toString());
    const emailField = this.page.locator('input[name="loginfmt"], input[type="email"], input[type="text"]').first();
    await emailField.waitFor({ state: 'visible', timeout: 30000 });
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

  async open(): Promise<void> {
    await this.page.goto('/navigator/connectivity');
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await this.pageHeading.waitFor({ state: 'visible', timeout: 30000 });
  }
}
