import { BasePage } from '../base.page';
import { Locator, Page, expect } from '@playwright/test';

export class AuthenticationPage extends BasePage {
  readonly usernameInput: Locator = this.page.getByPlaceholder('Username');
  readonly passwordInput: Locator = this.page.getByPlaceholder('Password');
  readonly loginButton: Locator = this.page.getByRole('button', { name: 'Login' });
  readonly loginHeading: Locator = this.page.getByRole('heading', { name: 'Login' });
  readonly errorAlert: Locator = this.page.getByText('Invalid credentials');
  readonly requiredError: Locator = this.page.getByText('Required');
  readonly dashboardHeading: Locator = this.page.getByRole('heading', { name: 'Dashboard' });
  readonly userDropdown: Locator = this.page.locator('.oxd-userdropdown-tab');

  async login(username: string, password: string): Promise<void> {
    await this.page.goto('/web/index.php/auth/login');
    await this.usernameInput.waitFor({ state: 'visible', timeout: 30000 });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    // Do NOT assume navigation here: this method serves both success and
    // failure flows. On invalid credentials the app stays on the login page
    // and renders an error, so the caller asserts the specific outcome.
  }

  async expectLoaded(): Promise<void> {
    await expect(this.loginHeading).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async expectLoginError(): Promise<void> {
    await expect(this.errorAlert).toBeVisible();
  }

  async logout(): Promise<void> {
    await this.userDropdown.click();
    await this.page.getByRole('menuitem', { name: 'Logout' }).click();
    await this.page.waitForURL((u) => u.toString().includes('/auth/login'), { timeout: 30000 });
  }
}