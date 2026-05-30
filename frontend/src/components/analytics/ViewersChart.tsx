'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { VIEWERS_DATA } from '@/constants/dashboard-mock-data';
import type { ViewerDataPoint } from '@/constants/dashboard-mock-data';
import { DashboardCard } from './DashboardCard';

/* Chart colors — resolved from design system tokens (Recharts requires hex) */
const cyanColor = '#00C2FF';    /* --vl-cyan */
const purpleColor = '#7C5CFF';  /* --vl-purple */
const gridColor = 'rgba(255,255,255,0.04)';
const tickColor = '#98A2B3';    /* --vl-text-secondary */

/** Custom tooltip */
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-[#0b0c10]/90 backdrop-blur-md border border-white/[0.08] rounded-xl px-3.5 py-2.5 shadow-2xl">
      <p className="text-[var(--vl-text-tertiary)] font-bold text-[9px] uppercase tracking-wider mb-1.5">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-[var(--vl-text-primary)] text-xs font-semibold flex items-center gap-1.5 mt-0.5">
          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
          {entry.name}: <span className="font-black">{entry.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
}

/**
 * ViewersChart — Area chart with dual gradient lines (viewers + unique viewers).
 * Shows 30-day viewer trends.
 */
export function ViewersChart() {
  // Format date labels
  const chartData = VIEWERS_DATA.map((d: ViewerDataPoint) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  const gridColor = 'rgba(255,255,255,0.02)';
  const tickColor = '#667085';

  return (
    <DashboardCard title="Viewers" subtitle="Last 30 days">
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
            <defs>
              <linearGradient id="viewersGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={cyanColor} stopOpacity={0.18} />
                <stop offset="100%" stopColor={cyanColor} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="uniqueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={purpleColor} stopOpacity={0.12} />
                <stop offset="100%" stopColor={purpleColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              stroke={gridColor}
              vertical={false}
            />

            <XAxis
              dataKey="label"
              tick={{ fill: tickColor, fontSize: 9, fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              interval={4}
            />

            <YAxis
              tick={{ fill: tickColor, fontSize: 9, fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
            />

            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: 'rgba(255, 255, 255, 0.08)', strokeWidth: 1, strokeDasharray: '3 3' }}
            />

            <Area
              type="monotone"
              dataKey="viewers"
              name="Viewers"
              stroke={cyanColor}
              strokeWidth={2}
              fill="url(#viewersGrad)"
              animationDuration={800}
              animationEasing="ease-out"
              dot={false}
              activeDot={{ r: 4.5, fill: cyanColor, stroke: '#06070A', strokeWidth: 2 }}
            />

            <Area
              type="monotone"
              dataKey="uniqueViewers"
              name="Unique"
              stroke={purpleColor}
              strokeWidth={2}
              fill="url(#uniqueGrad)"
              animationDuration={1000}
              animationEasing="ease-out"
              dot={false}
              activeDot={{ r: 4.5, fill: purpleColor, stroke: '#06070A', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
