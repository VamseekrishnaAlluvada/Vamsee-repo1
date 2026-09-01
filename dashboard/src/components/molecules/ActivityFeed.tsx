import { useStore } from '@/store/useStore';
import { cn, formatTime } from '@/lib/utils';
import {
  CheckCircle2,
  CircleDashed,
  Play,
  Sparkles,
  SkipForward,
  XCircle,
  Flag,
} from 'lucide-react';
import type { ActivityEvent, ActivityType } from '@/types';
import type { LucideIcon } from 'lucide-react';

const ICON: Record<ActivityType, { icon: LucideIcon; color: string }> = {
  'run.start': { icon: Flag, color: 'text-cyan' },
  'run.complete': { icon: Flag, color: 'text-violet' },
  'test.start': { icon: Play, color: 'text-blue' },
  'test.pass': { icon: CheckCircle2, color: 'text-ok' },
  'test.fail': { icon: XCircle, color: 'text-fail' },
  'test.skip': { icon: SkipForward, color: 'text-slate-500' },
  'healer.attempt': { icon: Sparkles, color: 'text-healed' },
};

function Row({ e, first }: { e: ActivityEvent; first: boolean }) {
  const { icon: Icon, color } = ICON[e.type] ?? { icon: CircleDashed, color: 'text-slate-500' };
  return (
    <div className="relative flex gap-3 pl-1">
      <div className="flex flex-col items-center">
        <span className={cn('rounded-full bg-surface-2 p-1.5 ring-1 ring-black/10', color, first && 'animate-breathe')}>
          <Icon size={14} />
        </span>
        <span className="w-px flex-1 bg-black/10" />
      </div>
      <div className="pb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-800">{e.label}</span>
          <span className="text-[10px] text-slate-500">{formatTime(e.ts)}</span>
        </div>
        {e.detail && <p className="text-xs text-slate-500">{e.detail}</p>}
      </div>
    </div>
  );
}

export function ActivityFeed() {
  const activity = useStore((s) => s.activity);
  return (
    <div className="max-h-[520px] overflow-y-auto pr-1">
      {activity.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center gap-2 text-slate-400">
          <CircleDashed size={22} className="animate-spin" />
          <span className="text-sm">Waiting for test activity…</span>
          <span className="text-xs">Re-run the Playwright suite to stream events.</span>
        </div>
      ) : (
        activity.map((e, i) => <Row key={e.id + i} e={e} first={i === 0} />)
      )}
    </div>
  );
}
