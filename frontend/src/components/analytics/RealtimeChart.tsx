'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { REALTIME_DATA } from '@/constants/dashboard-mock-data';
import { DashboardCard } from './DashboardCard';
import { formatCount } from '@/utils/format';

/** Custom tooltip */
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="dashboard-card px-3 py-2 !rounded-xl text-xs shadow-lg">
      <p className="text-[var(--text-secondary)] mb-1">{label} ago</p>
      <p className="text-[var(--text-primary)] font-semibold">
        {formatCount(payload[0].value)} viewers
      </p>
    </div>
  );
}

/**
 * RealtimeChart — Line chart showing real-time analytics over 60 minutes.
 * Smooth curves with gradient line.
 */
export function RealtimeChart() {
  return (
    <DashboardCard title="Real-time Analytics" subtitle="Last 60 minutes">
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={REALTIME_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="realtimeGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--accent-purple)" />
                <stop offset="50%" stopColor="var(--accent-blue)" />
                <stop offset="100%" stopColor="var(--accent-cyan)" />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border-color)"
              vertical={false}
            />

            <XAxis
              dataKey="time"
              tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval={9}
            />

            <YAxis
              tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => formatCount(v)}
            />

            <Tooltip content={<CustomTooltip />} />

            <Line
              type="monotone"
              dataKey="value"
              stroke="url(#realtimeGrad)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 4,
                fill: 'var(--accent-cyan)',
                stroke: 'var(--bg-surface)',
                strokeWidth: 2,
              }}
              animationDuration={1000}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
