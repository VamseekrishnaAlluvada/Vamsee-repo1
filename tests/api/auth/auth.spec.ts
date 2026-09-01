import { test, expect } from '../../../fixtures';
import { getConfig } from '../../../config/env';

/**
 * Suite: auth (P0). Categories: positive, negative, contract.
 * DAG: ping -> auth (auth token is the prerequisite for all mutating verbs).
 *
 * Uses the Service Object Model (POM): tests call PingService / AuthService,
 * never raw paths.
 */
test.describe('@parallel auth', () => {
  test('ping health check returns 201 @positive', async ({ pingService }) => {
    const res = await pingService.healthCheck();
    expect(res.status).toBe(201);
  });

  test('obtains a token with valid credentials @positive @contract', async ({
    authService,
  }) => {
    const { credentials } = getConfig();
    const res = await authService.createToken(credentials);

    expect(res.status).toBe(200);
    expect(res.data.token, 'a token should be returned').toBeTruthy();
    expect(typeof res.data.token).toBe('string');
  });

  test('returns bad-credentials reason with invalid password @negative', async ({
    authService,
  }) => {
    // restful-booker returns 200 with a `reason` even for bad creds.
    const res = await authService.createToken(
      { username: 'admin', password: 'definitely-wrong-password' },
      { stepLabel: 'create token (bad creds)' },
    );

    expect(res.status).toBe(200);
    expect(res.data.token).toBeUndefined();
    expect(res.data.reason).toBe('Bad credentials');
  });
});
