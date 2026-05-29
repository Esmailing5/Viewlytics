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
    <div className="vl-card-dashboard px-3 py-2 !rounded-xl text-xs shadow-lg">
      <p className="text-[var(--vl-text-secondary)] mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-[var(--vl-text-primary)] font-semibold">
          <span style={{ color: entry.color }}>●</span>{' '}
          {entry.name}: {entry.value.toLocaleString()}
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

  return (
    <DashboardCard title="Viewers" subtitle="Last 30 days">
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="viewersGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={cyanColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={cyanColor} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="uniqueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={purpleColor} stopOpacity={0.2} />
                <stop offset="100%" stopColor={purpleColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridColor}
              vertical={false}
            />

            <XAxis
              dataKey="label"
              tick={{ fill: tickColor, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval={4}
            />

            <YAxis
              tick={{ fill: tickColor, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="viewers"
              name="Viewers"
              stroke={cyanColor}
              strokeWidth={2}
              fill="url(#viewersGrad)"
              animationDuration={800}
              animationEasing="ease-out"
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
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
