/**
 * Viewlytics — HeroSection
 *
 * Sección hero cinematográfica — primera impresión del usuario.
 * Debe comunicar: analytics, crecimiento, rankings, inteligencia creadora.
 *
 * Incluye:
 * - Headline masivo con gradiente de texto
 * - Barra de búsqueda grande
 * - Botones CTA primario y secundario
 * - Mini-dashboard preview animado
 * - Fondo con gradientes y glows
 *
 * @see execution-pack/08-stage-prompts.md — Hero Section requirements
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  ArrowRight,
  TrendingUp,
  Users,
  Eye,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { homepageConfig } from '@/config/homepage';
import { formatCount } from '@/utils/format';

/** Datos de preview del mini-dashboard en el hero */
const PREVIEW_STATS = [
  { label: 'Creadores Totales', value: formatCount(2847), icon: Users, color: 'text-[#FF7A00]' },
  { label: 'Vistas Registradas', value: formatCount(8_400_000_000), icon: Eye, color: 'text-blue-400' },
  { label: 'Crecimiento Promedio', value: '+14.2%', icon: TrendingUp, color: 'text-emerald-400' },
  { label: 'Instantáneas en Vivo', value: formatCount(128500), icon: Zap, color: 'text-purple-400' },
];

/** Sugerencias de búsqueda de demostración */
const SEARCH_SUGGESTIONS = [
  'El Circo Podcast',
  'Omega El Fuerte',
  'Manny Viloria',
  'El Pachá',
];

/**
 * HeroSection — Sección hero premium de la homepage de Viewlytics.
 */
export function HeroSection() {
  const [searchValue, setSearchValue] = useState('');
  const { hero } = homepageConfig;

  return (
    <section
      id="hero"
      aria-label="Hero — Creator Analytics Intelligence"
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden"
    >
      {/* ── Background: cinematic gradient + glow orbs ── */}
      <div className="absolute inset-0 bg-[#071426]" aria-hidden="true">
        {/* Primary glow orb — top left */}
        <div
          className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #FF7A00 0%, transparent 70%)',
          }}
        />
        {/* Secondary glow orb — bottom right */}
        <div
          className="absolute -bottom-60 -right-40 w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, #0F2747 0%, transparent 70%)',
          }}
        />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(245,247,250,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(245,247,250,1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Gradient fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#071426] to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── LEFT: Copy + Search ── */}
          <div>
            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/20 text-[#FF7A00] text-xs font-semibold tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] animate-pulse" />
                Inteligencia de Creadores en Vivo
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
            >
              <span className="text-[#F5F7FA]">Inteligencia</span>
              <br />
              <span
                className="inline-block"
                style={{
                  background: 'linear-gradient(135deg, #FF7A00 0%, #FFB366 50%, #FF7A00 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  backgroundSize: '200% auto',
                }}
              >
                Analítica
              </span>
              <br />
              <span className="text-[#F5F7FA]">de Creadores.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="text-base sm:text-lg text-[#B8C4D4] max-w-lg leading-relaxed mb-8"
            >
              {hero.subtitle}
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="mb-5"
            >
              <div
                className="
                  relative flex items-center
                  bg-[#0F2747]/80 backdrop-blur-md
                  border border-white/[0.1] hover:border-[#FF7A00]/30
                  rounded-2xl
                  transition-all duration-300
                  focus-within:border-[#FF7A00]/50 focus-within:shadow-[0_0_0_3px_rgba(255,122,0,0.1)]
                "
              >
                <Search className="absolute left-4 w-5 h-5 text-[#B8C4D4]" aria-hidden="true" />
                <input
                  id="hero-search"
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Buscar canales o creadores de contenido..."
                  aria-label="Search creator"
                  className="
                    w-full pl-12 pr-4 py-4
                    bg-transparent
                    text-[#F5F7FA] placeholder:text-[#B8C4D4]/60
                    text-base rounded-2xl
                    outline-none
                  "
                />
                <button
                  id="hero-search-btn"
                  aria-label="Search"
                  className="
                    absolute right-3
                    flex items-center gap-1.5 px-4 py-2 rounded-xl
                    bg-[#FF7A00] hover:bg-[#FF9A33]
                    text-white text-sm font-semibold
                    transition-all duration-200
                    shadow-lg shadow-[#FF7A00]/20
                  "
                >
                  Buscar
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Suggestions */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-xs text-[#B8C4D4]/50">Prueba:</span>
                {SEARCH_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setSearchValue(suggestion)}
                    className="
                      text-xs px-3 py-1 rounded-full
                      bg-white/[0.04] border border-white/[0.08]
                      text-[#B8C4D4] hover:text-[#F5F7FA] hover:bg-white/[0.08]
                      transition-all duration-200
                    "
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-wrap items-center gap-3"
            >
              <Link
                href={hero.ctaHref}
                id="hero-cta-primary"
                className="
                  inline-flex items-center gap-2
                  px-6 py-3 rounded-xl
                  bg-[#FF7A00] hover:bg-[#FF9A33]
                  text-white text-sm font-semibold
                  transition-all duration-200
                  shadow-xl shadow-[#FF7A00]/25
                  hover:shadow-[#FF7A00]/40
                  hover:-translate-y-0.5
                "
              >
                {hero.ctaText}
                <ChevronRight className="w-4 h-4" />
              </Link>

              <Link
                href={hero.secondaryCtaHref ?? '/search'}
                id="hero-cta-secondary"
                className="
                  inline-flex items-center gap-2
                  px-6 py-3 rounded-xl
                  border border-white/[0.12] hover:border-white/[0.2]
                  bg-white/[0.03] hover:bg-white/[0.06]
                  text-[#F5F7FA] text-sm font-semibold
                  transition-all duration-200
                "
              >
                {hero.secondaryCtaText ?? 'Search Creator'}
              </Link>
            </motion.div>
          </div>

          {/* ── RIGHT: Analytics Preview Widget ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="hidden lg:block"
            aria-hidden="true"
          >
            {/* Main dashboard preview card */}
            <div
              className="
                relative rounded-3xl
                bg-[#0F2747]/60 backdrop-blur-xl
                border border-white/[0.08]
                p-6
                shadow-2xl shadow-black/40
              "
              style={{
                boxShadow: '0 0 80px rgba(255,122,0,0.06), 0 40px 80px rgba(0,0,0,0.4)',
              }}
            >
              {/* Card header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[#F5F7FA] font-semibold text-sm">Resumen de la Plataforma</p>
                  <p className="text-[#B8C4D4] text-xs mt-0.5">Creadores Dominicanos · En Vivo</p>
                </div>
                <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  EN VIVO
                </span>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {PREVIEW_STATS.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
                      className="
                        p-3 rounded-2xl
                        bg-[#071426]/60 border border-white/[0.05]
                      "
                    >
                      <div className={`mb-2 ${stat.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <p className="text-[#F5F7FA] font-bold text-lg leading-none">{stat.value}</p>
                      <p className="text-[#B8C4D4] text-[11px] mt-1">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Trending creators mini list */}
              <div className="space-y-2">
                <p className="text-[#B8C4D4] text-xs font-medium mb-3">🔥 Principales Tendencias</p>
                {[
                  { name: 'El Circo Podcast', growth: '+12.4%', subs: '1.4M' },
                  { name: 'Omega El Fuerte', growth: '+8.7%', subs: '2.1M' },
                  { name: 'Manny Viloria', growth: '+21.3%', subs: '890K' },
                ].map((creator, i) => (
                  <motion.div
                    key={creator.name}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
                    className="
                      flex items-center justify-between
                      px-3 py-2.5 rounded-xl
                      bg-white/[0.03] border border-white/[0.04]
                    "
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, #FF7A00, #FF9A33)' }}
                      >
                        {creator.name[0]}
                      </div>
                      <div>
                        <p className="text-[#F5F7FA] text-xs font-medium leading-none">{creator.name}</p>
                        <p className="text-[#B8C4D4] text-[10px] mt-0.5">{creator.subs} suscriptores</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">{creator.growth}</span>
                  </motion.div>
                ))}
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1, duration: 0.5, type: 'spring' }}
                className="
                  absolute -top-3 -right-3
                  px-3 py-1.5 rounded-full
                  bg-[#FF7A00] text-white
                  text-xs font-bold
                  shadow-lg shadow-[#FF7A00]/30
                "
              >
                2,847 creadores registrados
              </motion.div>
            </div>
          </motion.div>

        </div>

        {/* ── Bottom: Trust indicators ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-6 text-center"
        >
          {[
            { value: '2,847+', label: 'Creadores Registrados' },
            { value: '8.4B+', label: 'Vistas Analizadas' },
            { value: '99.9%', label: 'Tiempo de Actividad' },
            { value: 'Diarias', label: 'Actualizaciones de Datos' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="text-xl font-bold text-[#F5F7FA]">{stat.value}</span>
              <span className="text-xs text-[#B8C4D4]">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
