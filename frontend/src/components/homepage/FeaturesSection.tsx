/**
 * Viewlytics — FeaturesSection
 *
 * Sección de características de la plataforma.
 * Grid de tarjetas reutilizables, cada una representando una capacidad central.
 *
 * @see src/constants/mock-data.ts — FEATURES data array
 */

'use client';

import { motion } from 'framer-motion';
import {
  BarChart3,
  Trophy,
  History,
  Zap,
  Share2,
  Globe,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { FEATURES } from '@/constants/mock-data';

/** Mapa de nombres de ícono a componentes de Lucide */
const ICON_MAP: Record<string, LucideIcon> = {
  BarChart3,
  Trophy,
  History,
  Zap,
  Share2,
  Globe,
};

/**
 * FeatureCard — Tarjeta individual de característica de la plataforma.
 */
function FeatureCard({
  icon,
  title,
  description,
  highlight = false,
  delay = 0,
}: {
  icon: string;
  title: string;
  description: string;
  highlight?: boolean;
  delay?: number;
}) {
  const Icon = ICON_MAP[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -4 }}
      className="vl-card-feature group"
      data-highlight={highlight ? '' : undefined}
    >
      {/* Icon */}
      <div
        className={`
          w-11 h-11 rounded-xl mb-5
          flex items-center justify-center
          vl-transition
          ${
            highlight
              ? 'bg-[var(--vl-red-soft)] border border-[rgba(255,59,48,0.2)] group-hover:bg-[rgba(255,59,48,0.2)]'
              : 'bg-[rgba(255,255,255,0.05)] border border-[var(--vl-border)] group-hover:bg-[rgba(255,255,255,0.08)]'
          }
        `}
      >
        {Icon && (
          <Icon
            className={`w-5 h-5 ${highlight ? 'text-[var(--vl-red)]' : 'text-[var(--vl-text-secondary)] group-hover:text-[var(--vl-text-primary)]'}`}
          />
        )}
      </div>

      {/* Content */}
      <h3 className="text-[var(--vl-text-primary)] font-semibold text-base mb-2">{title}</h3>
      <p className="text-[var(--vl-text-secondary)] text-sm leading-relaxed">{description}</p>

      {/* Highlight badge */}
      {highlight && (
        <div className="absolute top-4 right-4 px-2 py-1 rounded-lg bg-[var(--vl-red-soft)] border border-[rgba(255,59,48,0.2)]">
          <span className="vl-label vl-label-red">Destacado</span>
        </div>
      )}

      {/* Subtle corner glow for highlighted cards */}
      {highlight && (
        <div
          className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--vl-red), transparent)' }}
          aria-hidden="true"
        />
      )}
    </motion.div>
  );
}

/**
 * FeaturesSection — Grid de características de la plataforma Viewlytics.
 */
export function FeaturesSection() {
  return (
    <section
      id="features"
      aria-label="Platform Features"
      className="vl-section"
    >
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none vl-bg-gradient-section"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <SectionHeader
            eyebrow="Plataforma"
            title="Todo lo que necesitas para entender a los creadores"
            subtitle="Desde recuentos de suscriptores hasta patrones profundos de interacción — Viewlytics convierte los datos en inteligencia de creadores."
            centered
          />
        </div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {FEATURES.map((feature, i) => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              highlight={feature.highlight}
              delay={i * 0.08}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
