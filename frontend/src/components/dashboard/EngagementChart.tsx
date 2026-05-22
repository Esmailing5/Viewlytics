'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ENGAGEMENT_DATA } from '@/constants/dashboard-mock-data';
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
      <p className="text-[var(--text-secondary)] mb-1">{label}</p>
      <p className="text-[var(--text-primary)] font-semibold">
        {formatCount(payload[0].value)}
      </p>
    </div>
  );
}

/**
 * EngagementChart — Bar chart with gradient bars showing engagement by category.
 * Categories: Likes, Comments, Shares, Watch Time, Clips.
 */
export function EngagementChart() {
  return (
    <DashboardCard title="Engagement" subtitle="By category">
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ENGAGEMENT_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="engGrad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-cyan)" />
                <stop offset="100%" stopColor="var(--accent-blue)" />
              </linearGradient>
              <linearGradient id="engGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-blue)" />
                <stop offset="100%" stopColor="var(--accent-purple)" />
              </linearGradient>
              <linearGradient id="engGrad3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-purple)" />
                <stop offset="100%" stopColor="#9146FF" />
              </linearGradient>
              <linearGradient id="engGrad4" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--success-green)" />
                <stop offset="100%" stopColor="#16a34a" />
              </linearGradient>
              <linearGradient id="engGrad5" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border-color)"
              vertical={false}
            />

            <XAxis
              dataKey="category"
              tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => formatCount(v)}
            />

            <Tooltip content={<CustomTooltip />} />

            <Bar
              dataKey="value"
              radius={[6, 6, 0, 0]}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
