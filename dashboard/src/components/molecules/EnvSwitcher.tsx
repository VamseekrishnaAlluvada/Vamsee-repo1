import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import type { EnvName } from '@/types';

const ENVS: { id: EnvName; label: string }[] = [
  { id: 'dev', label: 'Dev' },
  { id: 'staging', label: 'Staging' },
  { id: 'prod', label: 'Prod' },
];

export function EnvSwitcher() {
  const env = useStore((s) => s.env);
  const setEnv = useStore((s) => s.setEnv);
  return (
    <div className="relative flex items-center gap-1 rounded-xl border border-black/10 bg-surface/60 p-1">
      {ENVS.map((e) => (
        <button
          key={e.id}
          onClick={() => setEnv(e.id)}
          className={cn(
            'relative z-10 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200',
            env === e.id
              ? 'bg-grad-cyan text-white shadow-glow-cyan'
              : 'text-slate-600 hover:text-slate-900',
          )}
        >
          {e.label}
        </button>
      ))}
    </div>
  );
}
