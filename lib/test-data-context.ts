/**
 * Per-test data context. Injected as a fixture (never a global).
 *
 * Tracks resources a test creates so they can be torn down in REVERSE order
 * (LIFO) during fixture teardown — the cleanup strategy defined by the Planner.
 * Also serves as the healer's "test context cache" for re-seeded data.
 */

import { Logger } from 'winston';

export interface TrackedResource {
  kind: 'booking';
  id: number;
  label: string;
}

export class TestDataContext {
  private readonly resources: TrackedResource[] = [];
  private readonly bag = new Map<string, unknown>();

  constructor(private readonly logger: Logger) {}

  /** Register a created resource for later reverse-order cleanup. */
  track(resource: TrackedResource): void {
    this.resources.push(resource);
    this.logger.debug('Tracked resource for cleanup', resource);
  }

  /** Generic key/value cache (used by the healer to stash re-seeded ids). */
  set<T>(key: string, value: T): void {
    this.bag.set(key, value);
  }

  get<T>(key: string): T | undefined {
    return this.bag.get(key) as T | undefined;
  }

  /** Resources in LIFO order for teardown. */
  drain(): TrackedResource[] {
    return [...this.resources].reverse();
  }

  clear(): void {
    this.resources.length = 0;
    this.bag.clear();
  }
}
