/**
 * Viewlytics — FeaturesSection
 *
 * Sección de características de la plataforma.
 * Grid de tarjetas reutilizables, cada una representando una capacidad central.
 *
 * Features:
 * - Analytics Intelligence
 * - Ranking System
 * - Historical Snapshots
 * - Engagement Intelligence
 * - Export Engine
 * - Multi-Platform
 *
 * @see src/constants/mock-data.ts — FEATURES data array
 * @see execution-pack/08-stage-prompts.md — Features Section requirements
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
      className={`
        relative p-6 rounded-2xl
        border transition-all duration-300
        group cursor-default
        ${
          highlight
            ? 'bg-gradient-to-br from-[#FF7A00]/10 to-[#0F2747]/60 border-[#FF7A00]/20 hover:border-[#FF7A00]/40 hover:shadow-[0_0_30px_rgba(255,122,0,0.08)]'
            : 'bg-[#0F2747]/40 border-white/[0.06] hover:border-white/[0.12] hover:bg-[#0F2747]/60'
        }
      `}
    >
      {/* Icon */}
      <div
        className={`
          w-11 h-11 rounded-2xl mb-5
          flex items-center justify-center
          transition-all duration-300
          ${
            highlight
              ? 'bg-[#FF7A00]/15 border border-[#FF7A00]/25 group-hover:bg-[#FF7A00]/25'
              : 'bg-white/[0.05] border border-white/[0.08] group-hover:bg-white/[0.08]'
          }
        `}
      >
        {Icon && (
          <Icon
            className={`w-5 h-5 ${highlight ? 'text-[#FF7A00]' : 'text-[#B8C4D4] group-hover:text-[#F5F7FA]'}`}
          />
        )}
      </div>

      {/* Content */}
      <h3 className="text-[#F5F7FA] font-semibold text-base mb-2">{title}</h3>
      <p className="text-[#B8C4D4] text-sm leading-relaxed">{description}</p>

      {/* Highlight badge */}
      {highlight && (
        <div className="absolute top-4 right-4 px-2 py-1 rounded-lg bg-[#FF7A00]/15 border border-[#FF7A00]/25">
          <span className="text-[10px] font-bold text-[#FF7A00] uppercase tracking-wide">Destacado</span>
        </div>
      )}

      {/* Subtle corner glow for highlighted cards */}
      {highlight && (
        <div
          className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #FF7A00, transparent)' }}
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
      className="relative py-24 overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(180deg, #071426 0%, #0A1B35 50%, #071426 100%)',
        }}
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
