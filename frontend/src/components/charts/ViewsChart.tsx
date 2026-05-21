/**
 * Viewlytics — ViewsChart
 *
 * Gráfico de barras animado para mostrar las vistas mensuales de un creador.
 * Construido con Recharts, color naranja de acento de marca.
 *
 * @see execution-pack/01-tech-architecture.md — Recharts
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
    <div className="bg-[#0F2747] border border-white/10 rounded-xl px-3 py-2 shadow-xl">
      <p className="text-[#B8C4D4] text-xs mb-1">{label}</p>
      <p className="text-[#F5F7FA] text-sm font-bold">{formatCount(payload[0].value)} vistas</p>
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

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(245,247,250,0.05)"
          vertical={false}
        />

        <XAxis
          dataKey="month"
          tick={{ fill: '#B8C4D4', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          interval={2}
        />

        <YAxis
          tick={{ fill: '#B8C4D4', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatCount}
        />

        <Tooltip content={<CustomTooltip />} />

        <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={1000} animationEasing="ease-out">
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.value === maxValue ? '#FF7A00' : 'rgba(255,122,0,0.35)'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
