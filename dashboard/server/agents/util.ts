/**
 * Shared, pure helpers used across agents (URL resolution, slugging, escaping).
 */

import type { CustomApi, CustomMethod } from '../../src/types';

export const SUPPORTED_METHODS: CustomMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

export function hasRequestBody(method: string): boolean {
  return method === 'POST' || method === 'PUT' || method === 'PATCH';
}

export function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'custom-api'
  );
}

export function jsSafe(s: string): string {
  return s.replace(/'/g, "\\'").replace(/[\r\n]+/g, ' ');
}

/** Build the absolute URL for an API definition (absolute path wins over base). */
export function resolveApiUrl(api: Pick<CustomApi, 'baseUrl' | 'path' | 'query'>): URL {
  const raw = /^https?:\/\//i.test(api.path)
    ? api.path
    : `${(api.baseUrl || '').replace(/\/$/, '')}${api.path.startsWith('/') ? api.path : `/${api.path}`}`;
  const url = new URL(raw); // throws on malformed input
  for (const q of api.query ?? []) if (q.key.trim()) url.searchParams.append(q.key, q.value);
  return url;
}

/** Absolute request URL string without query (used in generated specs). */
export function absoluteUrl(api: Pick<CustomApi, 'baseUrl' | 'path'>): string {
  return /^https?:\/\//i.test(api.path)
    ? api.path
    : `${(api.baseUrl || '').replace(/\/$/, '')}${api.path.startsWith('/') ? api.path : `/${api.path}`}`;
}
