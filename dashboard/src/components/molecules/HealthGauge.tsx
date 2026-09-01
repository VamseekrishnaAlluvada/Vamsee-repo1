import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

/** Semi-circle health gauge, Red -> Yellow -> Green by score (0..100). */
export function HealthGauge({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  const color = clamped >= 85 ? '#10B981' : clamped >= 65 ? '#F59E0B' : '#EF4444';
  const data = [
    { name: 'score', value: clamped },
    { name: 'rest', value: 100 - clamped },
  ];
  return (
    <div className="relative h-44 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
          <Pie
            data={data}
            startAngle={180}
            endAngle={0}
            innerRadius="72%"
            outerRadius="100%"
            paddingAngle={0}
            dataKey="value"
            stroke="none"
            cy="90%"
            isAnimationActive
            animationDuration={900}
          >
            <Cell fill="url(#gaugeGrad)" />
            <Cell fill="rgba(255,255,255,0.06)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-2">
        <span className="heading text-4xl" style={{ color }}>
          {clamped.toFixed(0)}
        </span>
        <span className="text-xs text-slate-500">Stability Score</span>
      </div>
    </div>
  );
}
