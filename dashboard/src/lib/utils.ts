import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { TestStatus } from '@/types';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatMs(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
  return `${Math.round(ms)}ms`;
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export const STATUS_META: Record<
  TestStatus,
  { label: string; color: string; text: string; ring: string }
> = {
  passed: { label: 'Passed', color: 'bg-ok', text: 'text-ok', ring: 'ring-ok/30' },
  failed: { label: 'Failed', color: 'bg-fail', text: 'text-fail', ring: 'ring-fail/30' },
  healed: { label: 'Healed', color: 'bg-healed', text: 'text-healed', ring: 'ring-healed/30' },
  skipped: { label: 'Skipped', color: 'bg-slate-500', text: 'text-slate-600', ring: 'ring-slate-500/30' },
  running: { label: 'Running', color: 'bg-cyan', text: 'text-cyan', ring: 'ring-cyan/30' },
  pending: { label: 'Pending', color: 'bg-blue', text: 'text-blue', ring: 'ring-blue/30' },
};

export function methodColor(method: string): string {
  switch (method) {
    case 'GET':
      return 'text-cyan bg-cyan/10';
    case 'POST':
      return 'text-ok bg-ok/10';
    case 'PUT':
      return 'text-warn bg-warn/10';
    case 'PATCH':
      return 'text-violet bg-violet/10';
    case 'DELETE':
      return 'text-fail bg-fail/10';
    default:
      return 'text-slate-600 bg-slate-500/10';
  }
}
