import { useStore } from '@/store/useStore';

/** Ambient moving-gradient backdrop, toggleable for "pure visual delight". */
export function AuroraBackground() {
  const aurora = useStore((s) => s.aurora);
  if (!aurora) return <div className="fixed inset-0 -z-10 bg-base" />;
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-base">
      <div className="absolute -left-1/4 -top-1/4 h-[60vh] w-[60vh] rounded-full bg-violet/25 blur-[120px] animate-aurora" />
      <div
        className="absolute right-0 top-1/3 h-[55vh] w-[55vh] rounded-full bg-cyan/20 blur-[120px] animate-aurora"
        style={{ animationDelay: '-6s' }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[50vh] w-[50vh] rounded-full bg-pink/20 blur-[120px] animate-aurora"
        style={{ animationDelay: '-12s' }}
      />
      <div className="absolute inset-0 bg-base/40" />
    </div>
  );
}
