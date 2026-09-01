import { GlowCard } from '@/components/atoms/GlowCard';
import { Sparkline } from '@/components/atoms/Sparkline';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export function KpiCard({
  label,
  value,
  unit,
  icon: Icon,
  trend,
  spark,
  sparkColor,
  invertSpark,
  glow = 'violet',
  delay = 0,
}: {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: number; // percentage delta vs previous
  spark: number[];
  sparkColor?: string;
  invertSpark?: boolean;
  glow?: 'violet' | 'cyan';
  delay?: number;
}) {
  const up = (trend ?? 0) >= 0;
  return (
    <GlowCard glow={glow} delay={delay} className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <span className={cn('rounded-lg p-1.5', glow === 'violet' ? 'bg-violet/15 text-violet' : 'bg-cyan/15 text-cyan')}>
            <Icon size={16} />
          </span>
          <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
        </div>
        {trend !== undefined && (
          <span className={cn('flex items-center gap-0.5 text-xs font-medium', up ? 'text-ok' : 'text-fail')}>
            {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="heading text-3xl">{value}</span>
        {unit && <span className="text-sm text-slate-500">{unit}</span>}
      </div>
      <Sparkline data={spark} color={sparkColor} invert={invertSpark} />
    </GlowCard>
  );
}
