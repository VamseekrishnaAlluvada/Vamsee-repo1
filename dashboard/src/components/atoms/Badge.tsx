import { cn } from '@/lib/utils';
import { STATUS_META, methodColor } from '@/lib/utils';
import type { TestStatus } from '@/types';
import type { ReactNode } from 'react';

export function StatusBadge({ status }: { status: TestStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1',
        meta.text,
        meta.ring,
        'bg-black/5',
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', meta.color)} />
      {meta.label}
    </span>
  );
}

export function MethodBadge({ method }: { method: string }) {
  if (!method) return <span className="text-slate-400">—</span>;
  return (
    <span className={cn('rounded-md px-1.5 py-0.5 text-[11px] font-semibold', methodColor(method))}>
      {method}
    </span>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md bg-violet/10 px-1.5 py-0.5 text-[10px] font-medium text-violet/90 ring-1 ring-violet/20">
      {children}
    </span>
  );
}
