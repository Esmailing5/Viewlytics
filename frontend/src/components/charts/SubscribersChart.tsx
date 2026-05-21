/**
 * Viewlytics — SubscribersChart
 *
 * Gráfico de área animado para mostrar el crecimiento de suscriptores en el tiempo.
 * Construido con Recharts + animación de entrada suave.
 *
 * @see execution-pack/01-tech-architecture.md — Recharts
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
    <div className="bg-[#0F2747] border border-white/10 rounded-xl px-3 py-2 shadow-xl">
      <p className="text-[#B8C4D4] text-xs mb-1">{label}</p>
      <p className="text-[#F5F7FA] text-sm font-bold">{formatCount(payload[0].value)}</p>
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

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          {/* Gradiente naranja para el área */}
          <linearGradient id="subscribersGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF7A00" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#FF7A00" stopOpacity={0} />
          </linearGradient>
        </defs>

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

        <Area
          type="monotone"
          dataKey="value"
          stroke="#FF7A00"
          strokeWidth={2}
          fill="url(#subscribersGradient)"
          animationDuration={1200}
          animationEasing="ease-out"
          dot={false}
          activeDot={{ r: 4, fill: '#FF7A00', stroke: '#071426', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
