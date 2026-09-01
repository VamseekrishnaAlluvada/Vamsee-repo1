/**
 * Credential / secret redaction for logs and Allure attachments.
 *
 * MANDATE: credentials and tokens must never appear in logs or reports.
 * We redact by key name (case-insensitive) and by known secret values.
 */

const SENSITIVE_KEYS = [
  'password',
  'passwd',
  'token',
  'authorization',
  'cookie',
  'set-cookie',
  'apikey',
  'api-key',
  'x-api-key',
  'secret',
  'client_secret',
];

const REDACTED = '***REDACTED***';

/** Values registered here are scrubbed wherever they appear as substrings. */
const secretValues = new Set<string>();

export function registerSecretValue(value: string | undefined | null): void {
  if (value && value.length >= 4) {
    secretValues.add(value);
  }
}

function isSensitiveKey(key: string): boolean {
  const lower = key.toLowerCase();
  return SENSITIVE_KEYS.some((s) => lower.includes(s));
}

function scrubString(input: string): string {
  let out = input;
  for (const secret of secretValues) {
    if (secret && out.includes(secret)) {
      out = out.split(secret).join(REDACTED);
    }
  }
  return out;
}

/** Deep-redact an arbitrary structure by key name and known secret values. */
export function redact<T>(value: T): T {
  if (value === null || value === undefined) {
    return value;
  }
  if (typeof value === 'string') {
    return scrubString(value) as unknown as T;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => redact(item)) as unknown as T;
  }
  if (typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      result[k] = isSensitiveKey(k) ? REDACTED : redact(v);
    }
    return result as unknown as T;
  }
  return value;
}

/** Redact a headers map (also handles the token cookie form). */
export function redactHeaders(
  headers: Record<string, string>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(headers)) {
    out[k] = isSensitiveKey(k) ? REDACTED : scrubString(v);
  }
  return out;
}
