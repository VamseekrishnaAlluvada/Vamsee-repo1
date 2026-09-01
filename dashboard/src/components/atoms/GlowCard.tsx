import { cn } from '@/lib/utils';
import type { CSSProperties, ReactNode } from 'react';

export function GlowCard({
  children,
  className,
  glow = 'violet',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  glow?: 'violet' | 'cyan' | 'none';
  delay?: number;
}) {
  const glowClass =
    glow === 'violet' ? 'shadow-glow-violet' : glow === 'cyan' ? 'shadow-glow-cyan' : 'shadow-glow-soft';
  const style: CSSProperties = { animationDelay: `${delay}ms` };
  return (
    <div
      style={style}
      className={cn('glass glass-hover animate-fade-in-up p-5', glowClass, className)}
    >
      {children}
    </div>
  );
}
