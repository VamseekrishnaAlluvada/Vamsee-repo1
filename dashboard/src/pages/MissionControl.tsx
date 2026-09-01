import { useActiveHistory, useActiveRun } from '@/store/useStore';
import { KpiCard } from '@/components/molecules/KpiCard';
import { GlowCard } from '@/components/atoms/GlowCard';
import { formatMs } from '@/lib/utils';
import { Activity, CheckCircle2, Gauge, Timer } from 'lucide-react';

function delta(series: number[]): number {
  if (series.length < 2) return 0;
  const prev = series[series.length - 2];
  const cur = series[series.length - 1];
  if (prev === 0) return 0;
  return ((cur - prev) / prev) * 100;
}

export function MissionControl() {
  const run = useActiveRun();
  const history = useActiveHistory();

  if (!run) {
    return (
      <GlowCard className="grid place-items-center py-24 text-center text-slate-500">
        <p className="text-sm">Waiting for the first test run…</p>
        <p className="text-xs text-slate-400">Run <code className="text-violet">npm test</code> in the framework, then results stream in live.</p>
      </GlowCard>
    );
  }

  const k = run.kpis;
  const passSeries = history.map((h) => h.passRate);
  const p95Series = history.map((h) => h.p95Ms);
  const flakySeries = history.map((h) => h.flakiness);
  const totalSeries = history.map((h) => h.total);

  return (
    <div className="space-y-5">
      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total Tests"
          value={k.total}
          icon={Activity}
          trend={delta(totalSeries)}
          spark={totalSeries}
          sparkColor="#3B82F6"
          glow="cyan"
          delay={0}
        />
        <KpiCard
          label="Pass Rate"
          value={k.passRate}
          unit="%"
          icon={CheckCircle2}
          trend={delta(passSeries)}
          spark={passSeries}
          sparkColor="#10B981"
          glow="violet"
          delay={80}
        />
        <KpiCard
          label="Response p95"
          value={formatMs(k.p95Ms)}
          icon={Timer}
          trend={-delta(p95Series)}
          spark={p95Series}
          sparkColor="#06B6D4"
          invertSpark
          glow="cyan"
          delay={160}
        />
        <KpiCard
          label="Flakiness"
          value={k.flakiness}
          unit="%"
          icon={Gauge}
          trend={-delta(flakySeries)}
          spark={flakySeries.length ? flakySeries : [0]}
          sparkColor="#EC4899"
          invertSpark
          glow="violet"
          delay={240}
        />
      </div>
    </div>
  );
}
