import { cn } from '@/lib/utils';
import { STATUS_META } from '@/lib/utils';
import type { TestStatus } from '@/types';

export function StatusDot({ status, pulse }: { status: TestStatus; pulse?: boolean }) {
  const meta = STATUS_META[status];
  return (
    <span className="relative inline-flex h-2.5 w-2.5">
      {pulse && (
        <span className={cn('absolute inline-flex h-full w-full rounded-full opacity-70 animate-breathe', meta.color)} />
      )}
      <span className={cn('relative inline-flex h-2.5 w-2.5 rounded-full', meta.color)} />
    </span>
  );
}
