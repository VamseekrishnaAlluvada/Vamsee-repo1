import { useMemo } from 'react';
import { useStore, useActiveRun } from '@/store/useStore';
import { TestGrid } from '@/components/organisms/TestGrid';
import { ActivityFeed } from '@/components/molecules/ActivityFeed';
import { GlowCard } from '@/components/atoms/GlowCard';
import { cn } from '@/lib/utils';
import { Search, Zap } from 'lucide-react';
import type { TestStatus } from '@/types';

const STATUS_OPTS: (TestStatus | 'all')[] = ['all', 'passed', 'healed', 'failed', 'skipped'];

export function Execution() {
  const run = useActiveRun();
  const filters = useStore((s) => s.filters);
  const setFilter = useStore((s) => s.setFilter);

  const tags = useMemo(() => {
    const set = new Set<string>();
    for (const r of run?.rows ?? []) r.tags.forEach((t) => set.add(t));
    return ['all', ...[...set].sort()];
  }, [run]);

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_340px]">
      <div className="space-y-4">
        {/* Filter bar */}
        <div className="glass flex flex-wrap items-center gap-3 p-3">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-black/10 bg-base/50 px-3 py-2">
            <Search size={15} className="text-slate-500" />
            <input
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
              placeholder="Search suite, endpoint, or test…"
              className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) => setFilter('status', e.target.value as TestStatus | 'all')}
            className="rounded-xl border border-black/10 bg-base/50 px-3 py-2 text-sm text-slate-700 focus:outline-none"
          >
            {STATUS_OPTS.map((s) => (
              <option key={s} value={s} className="bg-surface">
                {s === 'all' ? 'All statuses' : s}
              </option>
            ))}
          </select>

          <select
            value={filters.tag}
            onChange={(e) => setFilter('tag', e.target.value)}
            className="rounded-xl border border-black/10 bg-base/50 px-3 py-2 text-sm text-slate-700 focus:outline-none"
          >
            {tags.map((t) => (
              <option key={t} value={t} className="bg-surface">
                {t === 'all' ? 'All tags' : t}
              </option>
            ))}
          </select>

          <button
            onClick={() => setFilter('slowOnly', !filters.slowOnly)}
            className={cn(
              'flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm transition-all duration-200',
              filters.slowOnly
                ? 'border-warn/40 bg-warn/10 text-warn'
                : 'border-black/10 bg-base/50 text-slate-600 hover:text-slate-900',
            )}
          >
            <Zap size={14} /> &gt; 1000ms
          </button>
        </div>

        <TestGrid />
      </div>

      <GlowCard glow="cyan" className="h-fit">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="heading text-sm">Live Activity</h3>
          <button
            onClick={() => useStore.getState().clearActivity()}
            className="text-xs text-slate-500 transition-colors hover:text-slate-700"
          >
            Clear
          </button>
        </div>
        <ActivityFeed />
      </GlowCard>
    </div>
  );
}
