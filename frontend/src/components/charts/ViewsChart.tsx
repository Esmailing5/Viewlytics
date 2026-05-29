/**
 * Viewlytics — ViewsChart
 *
 * Gráfico de barras animado para mostrar las vistas mensuales de un creador.
 * Construido con Recharts, color rojo de acento de marca.
 * Uses design system color tokens for chart colors.
 */

'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { GrowthDataPoint } from '@/types';
import { formatCount, formatMonthLabel } from '@/utils/format';

interface ViewsChartProps {
  /** Datos de vistas mensuales */
  data: GrowthDataPoint[];
  /** Altura del gráfico en px */
  height?: number;
}

/** Tooltip personalizado premium */
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
      <p className="text-[var(--vl-text-primary)] text-sm font-bold">{formatCount(payload[0].value)} vistas</p>
    </div>
  );
}

/**
 * ViewsChart — Gráfico de barras premium con highlight en la barra más alta.
 */
export function ViewsChart({ data, height = 130 }: ViewsChartProps) {
  const chartData = data.map((d) => ({
    month: formatMonthLabel(d.date),
    value: d.value,
  }));

  const maxValue = Math.max(...chartData.map((d) => d.value));

  /* Chart colors — resolved from design system tokens (Recharts requires hex) */
  const barColorActive = '#FF3B30';             /* --vl-red */
  const barColorMuted = 'rgba(255, 59, 48, 0.25)'; /* --vl-red at 25% */
  const gridColor = 'rgba(255,255,255,0.04)';
  const tickColor = '#98A2B3';                  /* --vl-text-secondary */

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
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

        <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={1000} animationEasing="ease-out">
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.value === maxValue ? barColorActive : barColorMuted}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
