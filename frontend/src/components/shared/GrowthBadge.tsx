/**
 * Viewlytics — GrowthBadge
 *
 * Componente de badge para mostrar tasas de crecimiento positivas/negativas.
 * Usa color verde para crecimiento positivo y rojo para negativo.
 *
 * @example
 * <GrowthBadge rate={12.4} />       // → "+12.4%" (verde)
 * <GrowthBadge rate={-3.2} />       // → "-3.2%" (rojo)
 * <GrowthBadge rate={21.3} hot />   // → "+21.3% 🔥" (naranja)
 */

'use client';

import { TrendingUp, TrendingDown, Flame } from 'lucide-react';
import { formatGrowthRate } from '@/utils/format';

interface GrowthBadgeProps {
  /** Tasa de crecimiento en porcentaje (puede ser negativa) */
  rate: number;
  /** Muestra ícono de llama para crecimiento excepcional (>15%) */
  hot?: boolean;
  /** Tamaño del badge */
  size?: 'sm' | 'md';
}

/**
 * GrowthBadge — Badge de indicador de crecimiento con ícono de tendencia.
 */
export function GrowthBadge({ rate, hot, size = 'md' }: GrowthBadgeProps) {
  const isPositive = rate >= 0;
  const isHot = hot ?? rate >= 15;

  const sizeClasses = size === 'sm'
    ? 'text-xs px-2 py-0.5 gap-1'
    : 'text-sm px-2.5 py-1 gap-1.5';

  const colorClasses = isHot
    ? 'bg-[#FF7A00]/15 text-[#FF7A00] border border-[#FF7A00]/20'
    : isPositive
    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
    : 'bg-red-500/15 text-red-400 border border-red-500/20';

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${sizeClasses} ${colorClasses}`}
    >
      {isHot ? (
        <Flame className="w-3 h-3" />
      ) : isPositive ? (
        <TrendingUp className="w-3 h-3" />
      ) : (
        <TrendingDown className="w-3 h-3" />
      )}
      {formatGrowthRate(rate)}
    </span>
  );
}
