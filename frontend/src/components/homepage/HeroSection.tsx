'use client';

import Link from 'next/link';
import { Search, Trophy, Eye, Clock, Users, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { homepageConfig } from '@/config/homepage';
import { SearchInput } from '@/components/shared/SearchInput';

interface HeroSectionProps {
  globalStats?: {
    totalCreators: number;
    trackedCreators: number;
    totalSubscribers: number;
    totalViews30d: number;
    updatedAt: string;
  };
}

export function HeroSection({ globalStats }: HeroSectionProps) {
  const formatSubscribers = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1,
    }).format(val);
  };

  const totalSubscribersFormatted = globalStats?.totalSubscribers
    ? formatSubscribers(globalStats.totalSubscribers)
    : '0';

  const trackedCreatorsFormatted = globalStats?.trackedCreators
    ? new Intl.NumberFormat('es-ES').format(globalStats.trackedCreators)
    : '0';

  return (
    <section className="relative overflow-hidden pt-28 pb-36 vl-noise-container bg-[var(--vl-bg-primary)]">
      {/* ── Background Gradients & Mesh ── */}
      <div className="vl-mesh-gradient">
        <div className="vl-orb vl-orb-1" />
        <div className="vl-orb vl-orb-2" />
        <div className="vl-orb vl-orb-3" />
      </div>

      {/* ── Background Editorial Grid Lines ── */}
      <div className="vl-bg-line-overlay">
        <div className="vl-bg-line left-[10%] hidden md:block" />
        <div className="vl-bg-line left-[30%] hidden lg:block" />
        <div className="vl-bg-line right-[30%] hidden lg:block" />
        <div className="vl-bg-line right-[10%] hidden md:block" />
      </div>

      {/* ── Elegant Watermark ── */}
      <div className="absolute top-[15%] left-[5%] vl-brand-watermark">
        VIEWLYTICS
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          
          {/* ── Eyebrow Badge ── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 px-4.5 py-1.5 rounded-full bg-[var(--vl-bg-surface)]/80 border border-[var(--vl-border)] mb-8 shadow-sm backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--vl-red)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--vl-red)]"></span>
            </span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--vl-text-secondary)]">
              Plataforma en vivo — Fase 1.5
            </span>
          </motion.div>

          {/* ── Title / Heading ── */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-[var(--vl-text-primary)] max-w-5xl leading-[1.02] mb-8"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Analítica <span className="vl-text-gradient-brand">Inteligente</span> para Creadores de Contenido
          </motion.h1>

          {/* ── Subtitle ── */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-md sm:text-lg md:text-xl text-[var(--vl-text-secondary)] max-w-3xl mb-12 leading-relaxed font-medium"
          >
            {homepageConfig.hero.subtitle}
          </motion.p>

          {/* ── Search Input Container ── */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-3xl mx-auto mb-14 group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--vl-red)] to-[var(--vl-cyan)] rounded-2xl opacity-10 blur-2xl group-hover:opacity-20 transition duration-500" />
            <SearchInput />
            
            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-[var(--vl-text-secondary)]">
              <span className="opacity-70">¿Buscas usar filtros avanzados?</span>
              <Link href={homepageConfig.hero.ctaHref} className="inline-flex items-center gap-1 text-[var(--vl-text-primary)] hover:text-[var(--vl-red)] transition-colors duration-200">
                <Search className="w-3.5 h-3.5" />
                Explorar directorio completo
              </Link>
            </div>
          </motion.div>

          {/* ── Floating Stats Overlay ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mb-12"
          >
            {/* Stat 1 */}
            <div className="vl-glass p-5 rounded-2xl border border-[var(--vl-border)] text-left hover:border-red-500/20 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                  <Eye className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-[var(--vl-success)] px-1.5 py-0.5 rounded bg-green-500/10">+12.4%</span>
              </div>
              <p className="text-2xl font-black text-[var(--vl-text-primary)] tracking-tight">{totalSubscribersFormatted}</p>
              <p className="text-xs text-[var(--vl-text-secondary)] font-medium mt-1">Audiencia Total Monitoreada</p>
            </div>

            {/* Stat 2 */}
            <div className="vl-glass p-5 rounded-2xl border border-[var(--vl-border)] text-left hover:border-cyan-500/20 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-500">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-[var(--vl-text-secondary)] px-1.5 py-0.5 rounded bg-white/5">RD Ecosistema</span>
              </div>
              <p className="text-2xl font-black text-[var(--vl-text-primary)] tracking-tight">{trackedCreatorsFormatted}</p>
              <p className="text-xs text-[var(--vl-text-secondary)] font-medium mt-1">Canales y Streamers Activos</p>
            </div>

            {/* Stat 3 */}
            <div className="vl-glass p-5 rounded-2xl border border-[var(--vl-border)] text-left hover:border-purple-500/20 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-500/10">En Vivo</span>
              </div>
              <p className="text-2xl font-black text-[var(--vl-text-primary)] tracking-tight">24/7</p>
              <p className="text-xs text-[var(--vl-text-secondary)] font-medium mt-1">Actualización de Rankings</p>
            </div>
          </motion.div>

          {/* ── Quick CTAs ── */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link href={homepageConfig.hero.secondaryCtaHref} className="vl-btn vl-btn-primary vl-btn-lg px-8">
              <Trophy className="w-4 h-4 text-white" />
              <span>{homepageConfig.hero.secondaryCtaText}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
