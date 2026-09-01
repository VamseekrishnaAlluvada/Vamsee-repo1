import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts';

export function Sparkline({
  data,
  color = '#7C3AED',
  invert = false,
}: {
  data: number[];
  color?: string;
  invert?: boolean;
}) {
  const points = data.map((v, i) => ({ i, v }));
  const gradId = `spark-${color.replace('#', '')}-${invert ? 'i' : 'n'}`;
  return (
    <div className="h-10 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 4, bottom: 0, left: 0, right: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.5} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis hide domain={invert ? ['dataMax', 'dataMin'] : ['dataMin', 'dataMax']} />
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradId})`}
            isAnimationActive
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
