'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { PLATFORMS_DATA } from '@/constants/dashboard-mock-data';
import type { PlatformSegment } from '@/constants/dashboard-mock-data';
import { DashboardCard } from './DashboardCard';
import { formatCount } from '@/utils/format';

/** Custom tooltip */
function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: PlatformSegment }>;
}) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;

  return (
    <div className="vl-card-dashboard px-3 py-2 !rounded-xl text-xs shadow-lg">
      <p className="text-[var(--vl-text-primary)] font-semibold">
        <span style={{ color: data.color }}>●</span> {data.name}: {formatCount(data.value)}
      </p>
    </div>
  );
}

/**
 * PlatformsDistribution — Donut chart showing audience across platforms.
 * YouTube, Twitch, Kick, TikTok segments with center total.
 */
export function PlatformsDistribution() {
  const total = PLATFORMS_DATA.reduce((sum, d) => sum + d.value, 0);

  return (
    <DashboardCard title="Platforms">
      <div className="flex flex-col items-center gap-4">
        {/* Donut chart */}
        <div className="h-[160px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={PLATFORMS_DATA}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={65}
                dataKey="value"
                animationDuration={800}
                animationEasing="ease-out"
                stroke="#06070A" /* --vl-bg-primary */
                strokeWidth={2}
              >
                {PLATFORMS_DATA.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-lg font-bold text-[var(--vl-text-primary)]">
                {formatCount(total)}
              </p>
              <p className="text-[10px] text-[var(--vl-text-secondary)]">Total</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          {PLATFORMS_DATA.map((entry) => (
            <div key={entry.name} className="flex items-center gap-1.5 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-[var(--vl-text-secondary)]">{entry.name}</span>
              <span className="text-[var(--vl-text-primary)] font-semibold">
                {formatCount(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}
