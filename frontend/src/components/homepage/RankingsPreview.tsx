/**
 * Viewlytics — RankingsPreview
 *
 * Vista previa de las clasificaciones de creadores dominicanos.
 * Diseñada para ser visualmente dinámica, compartible y social-media-ready.
 *
 * Incluye:
 * - Top 5 creators con badges de ranking
 * - Tabs de categorías (All, Podcasts, Gaming, Streamers)
 * - Indicadores de crecimiento y trending
 * - CTA a la página completa de rankings
 *
 * @see execution-pack/08-stage-prompts.md — Rankings Preview Section
 * @see src/config/rankings.ts — Categorías de ranking
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { CreatorAvatar } from '@/components/shared/CreatorAvatar';
import { GrowthBadge } from '@/components/shared/GrowthBadge';
import { TOP_RANKINGS } from '@/constants/mock-data';
import { formatCount } from '@/utils/format';

/** Tabs de categorías para el filtro de rankings */
const CATEGORY_TABS = [
  { id: 'all', label: 'Todos los Creadores' },
  { id: 'podcasts', label: 'Podcasts' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'streamers', label: 'Streamers' },
];

/** Color de medalla según posición de ranking */
function getRankMedalStyle(rank: number): string {
  if (rank === 1) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  if (rank === 2) return 'bg-slate-400/15 text-slate-300 border-slate-400/25';
  if (rank === 3) return 'bg-orange-700/20 text-orange-400 border-orange-700/30';
  return 'bg-white/[0.05] text-[#B8C4D4] border-white/[0.08]';
}

/**
 * RankingsPreview — Sección de rankings con tabs de categorías y tarjetas premium.
 */
export function RankingsPreview() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <section
      id="rankings-preview"
      aria-label="Creator Rankings Preview"
      className="relative py-24 overflow-hidden"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(180deg, #071426 0%, #0A1B35 50%, #071426 100%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* ── LEFT: Header + CTA ── */}
          <div>
            <SectionHeader
              eyebrow="Clasificaciones"
              title="Top Creadores Dominicanos"
              subtitle="Actualizado diariamente. Clasificado por suscriptores, interacción y crecimiento. Descubre quién está dominando la economía creadora."
            />

            {/* Feature highlights */}
            <div className="space-y-3 mb-8">
              {[
                { icon: Trophy, text: 'Clasificaciones actualizadas diariamente en todas las categorías' },
                { icon: TrendingUp, text: 'Sigue el crecimiento y los momentos virales' },
                { icon: Flame, text: 'Creadores destacados creciendo más rápido que nunca' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#FF7A00]/10 border border-[#FF7A00]/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#FF7A00]" />
                    </div>
                    <span className="text-sm text-[#B8C4D4]">{item.text}</span>
                  </div>
                );
              })}
            </div>

            <Link
              href="/rankings"
              id="rankings-preview-cta"
              className="
                inline-flex items-center gap-2
                px-6 py-3 rounded-xl
                bg-[#FF7A00] hover:bg-[#FF9A33]
                text-white text-sm font-semibold
                transition-all duration-200
                shadow-xl shadow-[#FF7A00]/20 hover:shadow-[#FF7A00]/35
                hover:-translate-y-0.5
              "
            >
              Explorar Rankings Completos
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* ── RIGHT: Rankings Card ── */}
          <div>
            {/* Category Tabs */}
            <div
              className="
                flex items-center gap-1 p-1 mb-4
                bg-[#0F2747]/60 backdrop-blur-md
                border border-white/[0.06] rounded-2xl
              "
              role="tablist"
              aria-label="Rankings categories"
            >
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  id={`rankings-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 px-3 py-2 rounded-xl
                    text-xs font-semibold
                    transition-all duration-200
                    ${
                      activeTab === tab.id
                        ? 'bg-[#FF7A00] text-white shadow-lg shadow-[#FF7A00]/20'
                        : 'text-[#B8C4D4] hover:text-[#F5F7FA] hover:bg-white/[0.04]'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Rankings List */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="
                  rounded-2xl
                  bg-[#0F2747]/60 backdrop-blur-md
                  border border-white/[0.06]
                  overflow-hidden
                "
                role="tabpanel"
                aria-label={`${activeTab} rankings`}
              >
                {/* List header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05]">
                  <span className="text-[10px] font-semibold text-[#B8C4D4]/60 uppercase tracking-widest">Posición</span>
                  <span className="text-[10px] font-semibold text-[#B8C4D4]/60 uppercase tracking-widest ml-auto mr-8">Suscriptores</span>
                  <span className="text-[10px] font-semibold text-[#B8C4D4]/60 uppercase tracking-widest">Crecimiento</span>
                </div>

                {/* Ranking rows */}
                {TOP_RANKINGS.map((entry, i) => (
                  <motion.div
                    key={entry.creator.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                    className="
                      flex items-center gap-4 px-5 py-4
                      border-b border-white/[0.04] last:border-b-0
                      hover:bg-white/[0.03]
                      transition-colors duration-200
                      group cursor-pointer
                    "
                  >
                    {/* Rank badge */}
                    <div
                      className={`
                        w-8 h-8 rounded-xl border
                        flex items-center justify-center
                        text-xs font-bold flex-shrink-0
                        ${getRankMedalStyle(entry.rank)}
                      `}
                    >
                      {entry.rank}
                    </div>

                    {/* Avatar */}
                    <CreatorAvatar name={entry.creator.name} platform="youtube" size="sm" />

                    {/* Name + handle */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[#F5F7FA] text-sm font-semibold truncate">
                        {entry.creator.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[#B8C4D4] text-xs truncate">
                          {entry.creator.handle}
                        </span>
                        {/* Rank change indicator */}
                        {entry.rankChange > 0 && (
                          <span className="flex items-center gap-0.5 text-[10px] text-emerald-400">
                            <TrendingUp className="w-2.5 h-2.5" />+{entry.rankChange}
                          </span>
                        )}
                        {entry.rankChange < 0 && (
                          <span className="flex items-center gap-0.5 text-[10px] text-red-400">
                            <TrendingDown className="w-2.5 h-2.5" />{entry.rankChange}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Subscribers */}
                    <span className="text-sm font-bold text-[#F5F7FA] mr-2">
                      {formatCount(entry.creator.metrics.followers)}
                    </span>

                    {/* Growth badge */}
                    <GrowthBadge rate={entry.creator.metrics.growthRate} size="sm" />
                  </motion.div>
                ))}

                {/* View all footer */}
                <Link
                  href="/rankings"
                  className="
                    flex items-center justify-center gap-2
                    py-3.5 px-5
                    text-xs font-semibold text-[#FF7A00]
                    hover:bg-[#FF7A00]/5
                    transition-colors duration-200
                  "
                >
                  Ver todos los creadores
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
