/**
 * Viewlytics — MetricCard
 *
 * Tarjeta reutilizable para mostrar métricas analíticas clave.
 * Usada en el dashboard preview y la sección hero.
 *
 * @example
 * <MetricCard
 *   label="Subscribers"
 *   value="1.4M"
 *   change="+12.4%"
 *   positive
 *   icon={<Users />}
 * />
 */

'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface MetricCardProps {
  /** Etiqueta de la métrica */
  label: string;
  /** Valor formateado de la métrica */
  value: string;
  /** Texto de cambio (ej: "+12.4%") */
  change?: string;
  /** Si el cambio es positivo (verde) o negativo (rojo) */
  positive?: boolean;
  /** Ícono de Lucide React */
  icon?: ReactNode;
  /** Variante de color de acento */
  accent?: 'red' | 'cyan' | 'green' | 'purple';
  /** Índice para animación escalonada */
  animationDelay?: number;
}

const ACCENT_MAP = {
  red: {
    icon: 'bg-[var(--vl-red-soft)] text-[var(--vl-red)]',
    glow: 'vl-hover-glow-red',
  },
  cyan: {
    icon: 'bg-[var(--vl-cyan-soft)] text-[var(--vl-cyan)]',
    glow: 'vl-hover-glow-cyan',
  },
  green: {
    icon: 'bg-[var(--vl-success-soft)] text-[var(--vl-success)]',
    glow: 'hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]',
  },
  purple: {
    icon: 'bg-[var(--vl-purple-soft)] text-[var(--vl-purple)]',
    glow: 'vl-hover-glow-purple',
  },
} as const;

/**
 * MetricCard — Tarjeta premium de métrica analítica.
 */
export function MetricCard({
  label,
  value,
  change,
  positive = true,
  icon,
  accent = 'red',
  animationDelay = 0,
}: MetricCardProps) {
  const accentStyle = ACCENT_MAP[accent];

  return (
    <motion.div
      className={`
        vl-card-metric
        ${accentStyle.glow}
      `}
      data-accent={accent}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: animationDelay, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="flex items-start justify-between mb-3">
        {icon && (
          <div className={`p-2 rounded-xl ${accentStyle.icon}`}>
            {icon}
          </div>
        )}
        {change && (
          <span
            className={`text-xs font-semibold ${
              positive ? 'text-[var(--vl-success)]' : 'text-[var(--vl-danger)]'
            }`}
          >
            {change}
          </span>
        )}
      </div>

      <p className="text-2xl font-bold text-[var(--vl-text-primary)] tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-[var(--vl-text-secondary)] font-medium">{label}</p>
    </motion.div>
  );
}
