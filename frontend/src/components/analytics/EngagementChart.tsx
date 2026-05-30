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
    <div className="bg-[#0b0c10]/90 backdrop-blur-md border border-white/[0.08] rounded-xl px-3.5 py-2.5 shadow-2xl">
      <p className="text-[var(--vl-text-tertiary)] font-bold text-[9px] uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-[var(--vl-text-primary)] text-sm font-black tracking-tight">
        {formatCount(payload[0].value)}
      </p>
    </div>
  );
}

/* Chart colors from design system tokens */
const gridColor = 'rgba(255,255,255,0.02)';
const tickColor = '#667085';

/**
 * EngagementChart — Bar chart with gradient bars showing engagement by category.
 * Categories: Likes, Comments, Shares, Watch Time, Clips.
 */
export function EngagementChart() {
  return (
    <DashboardCard title="Engagement" subtitle="By category">
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ENGAGEMENT_DATA} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
            <defs>
              <linearGradient id="engGrad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00C2FF" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#7C5CFF" stopOpacity={0.65} />
              </linearGradient>
              <linearGradient id="engGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C5CFF" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#5B3FCC" stopOpacity={0.65} />
              </linearGradient>
              <linearGradient id="engGrad3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C5CFF" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#9146FF" stopOpacity={0.65} />
              </linearGradient>
              <linearGradient id="engGrad4" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22C55E" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#16a34a" stopOpacity={0.65} />
              </linearGradient>
              <linearGradient id="engGrad5" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#d97706" stopOpacity={0.65} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              stroke={gridColor}
              vertical={false}
            />

            <XAxis
              dataKey="category"
              tick={{ fill: tickColor, fontSize: 9, fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tick={{ fill: tickColor, fontSize: 9, fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => formatCount(v)}
            />

            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: 'rgba(255, 255, 255, 0.02)', radius: 4 }}
            />

            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
