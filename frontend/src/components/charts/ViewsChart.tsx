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
    <div className="bg-[#0b0c10]/90 backdrop-blur-md border border-white/[0.08] rounded-xl px-3.5 py-2.5 shadow-2xl">
      <p className="text-[var(--vl-text-tertiary)] font-bold text-[9px] uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-[var(--vl-text-primary)] text-sm font-black tracking-tight">
        {formatCount(payload[0].value)} <span className="text-[var(--vl-text-secondary)] font-medium text-xs">vistas</span>
      </p>
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

  const gridColor = 'rgba(255,255,255,0.02)';
  const tickColor = '#667085';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
        <defs>
          <linearGradient id="barActiveGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF3B30" stopOpacity={1} />
            <stop offset="100%" stopColor="#A81A12" stopOpacity={0.65} />
          </linearGradient>
          <linearGradient id="barMutedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255, 59, 48, 0.18)" stopOpacity={1} />
            <stop offset="100%" stopColor="rgba(255, 59, 48, 0.02)" stopOpacity={1} />
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
          cursor={{ fill: 'rgba(255, 255, 255, 0.02)', radius: 4 }}
        />

        <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={1000} animationEasing="ease-out">
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.value === maxValue ? 'url(#barActiveGrad)' : 'url(#barMutedGrad)'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
