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
    <div className="bg-[var(--vl-bg-elevated)] border border-[var(--vl-border-hover)] rounded-xl px-3 py-2 shadow-xl">
      <p className="text-[var(--vl-text-secondary)] text-xs mb-1">{label}</p>
      <p className="text-[var(--vl-text-primary)] text-sm font-bold">{formatCount(payload[0].value)}</p>
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

  /* Chart colors — resolved from design system tokens (Recharts requires hex) */
  const chartColor = '#FF3B30';       /* --vl-red */
  const gridColor = 'rgba(255,255,255,0.04)';
  const tickColor = '#98A2B3';        /* --vl-text-secondary */

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          {/* Brand red gradient for the area fill */}
          <linearGradient id="subscribersGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chartColor} stopOpacity={0.25} />
            <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke={gridColor}
          vertical={false}
        />

        <XAxis
          dataKey="month"
          tick={{ fill: tickColor, fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          interval={2}
        />

        <YAxis
          tick={{ fill: tickColor, fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatCount}
        />

        <Tooltip content={<CustomTooltip />} />

        <Area
          type="monotone"
          dataKey="value"
          stroke={chartColor}
          strokeWidth={2}
          fill="url(#subscribersGradient)"
          animationDuration={1200}
          animationEasing="ease-out"
          dot={false}
          activeDot={{ r: 4, fill: chartColor, stroke: '#06070A', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
