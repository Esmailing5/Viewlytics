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

/* Chart colors — resolved from design system tokens (Recharts requires hex) */
const purpleColor = '#7C5CFF';  /* --vl-purple */
const cyanColor = '#00C2FF';    /* --vl-cyan */
const gridColor = 'rgba(255,255,255,0.04)';
const tickColor = '#98A2B3';    /* --vl-text-secondary */

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
      <p className="text-[var(--vl-text-tertiary)] font-bold text-[9px] uppercase tracking-wider mb-0.5">{label} atrás</p>
      <p className="text-[var(--vl-text-primary)] text-sm font-black tracking-tight">
        {formatCount(payload[0].value)} <span className="text-[var(--vl-text-secondary)] font-medium text-xs">espectadores</span>
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
          <LineChart data={REALTIME_DATA} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
            <defs>
              <linearGradient id="realtimeGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={purpleColor} />
                <stop offset="50%" stopColor={cyanColor} />
                <stop offset="100%" stopColor={cyanColor} />
              </linearGradient>
              <filter id="realtimeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor={cyanColor} floodOpacity="0.15" />
              </filter>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              stroke={gridColor}
              vertical={false}
            />

            <XAxis
              dataKey="time"
              tick={{ fill: tickColor, fontSize: 9, fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              interval={9}
            />

            <YAxis
              tick={{ fill: tickColor, fontSize: 9, fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => formatCount(v)}
            />

            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: 'rgba(255, 255, 255, 0.08)', strokeWidth: 1, strokeDasharray: '3 3' }}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="url(#realtimeGrad)"
              strokeWidth={2.5}
              style={{ filter: 'url(#realtimeGlow)' }}
              dot={false}
              activeDot={{
                r: 4.5,
                fill: cyanColor,
                stroke: '#11141B', /* --vl-bg-surface */
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
