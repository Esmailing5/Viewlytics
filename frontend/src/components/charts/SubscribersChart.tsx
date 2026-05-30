/**
 * Viewlytics — SubscribersChart
 *
 * Gráfico de área animado para mostrar el crecimiento de suscriptores en el tiempo.
 * Construido con Recharts + animación de entrada suave.
 * Uses design system color tokens for chart colors.
 */

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
import type { GrowthDataPoint } from '@/types';
import { formatCount, formatMonthLabel } from '@/utils/format';

interface SubscribersChartProps {
  /** Datos de crecimiento mensual */
  data: GrowthDataPoint[];
  /** Altura del gráfico en px */
  height?: number;
}

/** Tooltip personalizado premium para el gráfico */
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
        {formatCount(payload[0].value)} <span className="text-[var(--vl-text-secondary)] font-medium text-xs">suscriptores</span>
      </p>
    </div>
  );
}

/**
 * SubscribersChart — Gráfico de área premium con gradiente y tooltip personalizado.
 */
export function SubscribersChart({ data, height = 160 }: SubscribersChartProps) {
  const chartData = data.map((d) => ({
    month: formatMonthLabel(d.date),
    value: d.value,
  }));

  /* Chart colors */
  const chartColor = '#FF3B30';       /* --vl-red */
  const gridColor = 'rgba(255,255,255,0.02)';
  const tickColor = '#667085';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
        <defs>
          {/* Brand red gradient for the area fill */}
          <linearGradient id="subscribersGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chartColor} stopOpacity={0.18} />
            <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="4 4"
          stroke={gridColor}
          vertical={false}
        />

        <XAxis
          dataKey="month"
          tick={{ fill: tickColor, fontSize: 9, fontWeight: 600 }}
          tickLine={false}
          axisLine={false}
          interval={2}
        />

        <YAxis
          tick={{ fill: tickColor, fontSize: 9, fontWeight: 600 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatCount}
        />

        <Tooltip 
          content={<CustomTooltip />} 
          cursor={{ stroke: 'rgba(255, 255, 255, 0.08)', strokeWidth: 1, strokeDasharray: '3 3' }}
        />

        <Area
          type="monotone"
          dataKey="value"
          stroke={chartColor}
          strokeWidth={2}
          fill="url(#subscribersGradient)"
          animationDuration={1200}
          animationEasing="ease-out"
          dot={false}
          activeDot={{ r: 4.5, fill: chartColor, stroke: '#06070A', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
