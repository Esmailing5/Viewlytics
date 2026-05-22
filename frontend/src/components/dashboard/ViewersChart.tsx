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
    <div className="dashboard-card px-3 py-2 !rounded-xl text-xs shadow-lg">
      <p className="text-[var(--text-secondary)] mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-[var(--text-primary)] font-semibold">
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
                <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="uniqueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border-color)"
              vertical={false}
            />

            <XAxis
              dataKey="label"
              tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval={4}
            />

            <YAxis
              tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="viewers"
              name="Viewers"
              stroke="var(--accent-cyan)"
              strokeWidth={2}
              fill="url(#viewersGrad)"
              animationDuration={800}
              animationEasing="ease-out"
            />

            <Area
              type="monotone"
              dataKey="uniqueViewers"
              name="Unique"
              stroke="var(--accent-blue)"
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
