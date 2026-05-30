'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { PLAYTIME_DATA } from '@/constants/dashboard-mock-data';
import type { PlaytimeSegment } from '@/constants/dashboard-mock-data';
import { DashboardCard } from './DashboardCard';

/** Custom tooltip */
function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: PlaytimeSegment }>;
}) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;

  return (
    <div className="bg-[#0b0c10]/90 backdrop-blur-md border border-white/[0.08] rounded-xl px-3.5 py-2.5 shadow-2xl">
      <p className="text-[var(--vl-text-primary)] text-xs font-semibold">
        <span style={{ color: data.color }}>●</span> {data.name}: <span className="font-black text-sm">{data.value}%</span>
      </p>
    </div>
  );
}

/**
 * PlaytimeDistribution — Pie chart showing platform playtime split.
 * Twitch, YouTube, Kick, TikTok percentages.
 */
export function PlaytimeDistribution() {
  return (
    <DashboardCard title="Playtime Distribution">
      <div className="flex flex-col items-center gap-4">
        {/* Chart */}
        <div className="h-[160px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={PLAYTIME_DATA}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={4}
                dataKey="value"
                animationDuration={800}
                animationEasing="ease-out"
                stroke="none"
              >
                {PLAYTIME_DATA.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          {PLAYTIME_DATA.map((entry) => (
            <div key={entry.name} className="flex items-center gap-1.5 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-[var(--vl-text-secondary)]">{entry.name}</span>
              <span className="text-[var(--vl-text-primary)] font-semibold">{entry.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}
