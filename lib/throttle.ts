/**
 * Per-worker request throttle.
 *
 * Each Playwright worker is a separate process, so this enforces a minimum
 * interval between outgoing requests *within* a worker. With N workers the
 * effective global rate is N * (1000 / minIntervalMs) req/s — size workers +
 * interval accordingly to stay under provider limits.
 */
export class Throttle {
  private queue: Promise<void> = Promise.resolve();
  private lastStart = 0;

  constructor(private readonly minIntervalMs: number) {}

  /** Serialize the *spacing* of requests without serializing the requests themselves. */
  async gate(): Promise<void> {
    if (this.minIntervalMs <= 0) {
      return;
    }
    const run = this.queue.then(async () => {
      const now = Date.now();
      const wait = Math.max(0, this.lastStart + this.minIntervalMs - now);
      if (wait > 0) {
        await new Promise((r) => setTimeout(r, wait));
      }
      this.lastStart = Date.now();
    });
    // Chain so callers are spaced; swallow errors so one failure doesn't wedge the chain.
    this.queue = run.catch(() => undefined);
    return run;
  }
}
