/**
 * Viewlytics — TrustedCreatorsSection
 *
 * Sección "Confiado por creadores dominicanos". Muestra una vitrina de
 * creadores reales de podcasts, streamers y gaming.
 *
 * Incluye:
 * - Headline de confianza
 * - Cards de creadores con categoría e ícono
 * - Animación de scroll horizontal marquee (via animations.css)
 *
 * @see src/constants/mock-data.ts — TRUSTED_CREATORS
 */

'use client';

import { motion } from 'framer-motion';
import { Mic, Gamepad2, Video, Radio } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { TRUSTED_CREATORS } from '@/constants/mock-data';
import type { TrustedCreator } from '@/constants/mock-data';

/** Mapa de categoría a ícono y color */
const CATEGORY_MAP: Record<
  TrustedCreator['category'],
  { icon: LucideIcon; color: string; bg: string; label: string }
> = {
  podcast: {
    icon: Mic,
    color: 'text-[var(--vl-purple)]',
    bg: 'bg-[var(--vl-purple-soft)] border-[rgba(124,92,255,0.2)]',
    label: 'Podcast',
  },
  streamer: {
    icon: Radio,
    color: 'text-[var(--vl-cyan)]',
    bg: 'bg-[var(--vl-cyan-soft)] border-[rgba(0,194,255,0.2)]',
    label: 'Streamer',
  },
  gaming: {
    icon: Gamepad2,
    color: 'text-[var(--vl-success)]',
    bg: 'bg-[var(--vl-success-soft)] border-[rgba(34,197,94,0.2)]',
    label: 'Gaming',
  },
  media: {
    icon: Video,
    color: 'text-[var(--vl-red)]',
    bg: 'bg-[var(--vl-red-soft)] border-[rgba(255,59,48,0.2)]',
    label: 'Medio',
  },
};

/** Tarjeta de creador individual */
function CreatorBadge({ creator }: { creator: TrustedCreator }) {
  const cat = CATEGORY_MAP[creator.category];
  const Icon = cat.icon;

  return (
    <div
      className="
        flex-shrink-0
        flex items-center gap-3
        px-4 py-3 rounded-xl
        vl-card-glass
        hover:border-[var(--vl-border-hover)]
        vl-transition
        group cursor-default
      "
    >
      {/* Avatar placeholder */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
        style={{ background: 'var(--vl-gradient-brand)' }}
      >
        {creator.name[0]}
      </div>

      <div>
        <p className="text-[var(--vl-text-primary)] text-sm font-semibold leading-none whitespace-nowrap">
          {creator.name}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] font-semibold ${cat.bg} ${cat.color}`}>
            <Icon className="w-2.5 h-2.5" />
            {cat.label}
          </div>
          <span className="text-[10px] text-[var(--vl-text-tertiary)]">{creator.subscribers}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * TrustedCreatorsSection — Vitrina de creadores dominicanos con animación de marquee.
 */
export function TrustedCreatorsSection() {
  // Duplicar la lista para efecto marquee continuo
  const marqueeItems = [...TRUSTED_CREATORS, ...TRUSTED_CREATORS];

  return (
    <section
      id="trusted-creators"
      aria-label="Trusted by Dominican Creators"
      className="vl-section"
    >
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at 20% 50%, rgba(17,20,27,0.8) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <SectionHeader
          eyebrow="Comunidad"
          title="Con la confianza de creadores de contenido"
          subtitle="La plataforma diseñada para podcasters, streamers, gamers y medios digitales — los creadores que definen el internet."
          centered
        />
      </div>

      {/* ── Marquee Row 1 ── */}
      <div className="relative overflow-hidden mb-4">
        {/* Left/right fade masks */}
        <div className="vl-fade-mask-left" aria-hidden="true" />
        <div className="vl-fade-mask-right" aria-hidden="true" />

        <div
          className="flex gap-4 w-max px-4 vl-animate-marquee"
          aria-hidden="true"
        >
          {marqueeItems.map((creator, i) => (
            <CreatorBadge key={`${creator.id}-${i}`} creator={creator} />
          ))}
        </div>
      </div>

      {/* ── Marquee Row 2 (reverse) ── */}
      <div className="relative overflow-hidden">
        <div className="vl-fade-mask-left" aria-hidden="true" />
        <div className="vl-fade-mask-right" aria-hidden="true" />

        <div
          className="flex gap-4 w-max px-4 vl-animate-marquee-reverse"
          aria-hidden="true"
        >
          {[...marqueeItems].reverse().map((creator, i) => (
            <CreatorBadge key={`rev-${creator.id}-${i}`} creator={creator} />
          ))}
        </div>
      </div>

      {/* ── Stats row ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-10 max-w-3xl mx-auto mt-14 px-4"
      >
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: '2,847+', label: 'Creadores Indexados' },
            { value: '5 Cat.', label: 'Categorías de Ranking' },
            { value: 'Diario', label: 'Actualización de Datos' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 vl-card-glass rounded-xl"
            >
              <p className="text-xl font-bold text-[var(--vl-red)]">{stat.value}</p>
              <p className="text-xs text-[var(--vl-text-secondary)] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
