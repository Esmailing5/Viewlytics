/**
 * Viewlytics — LiveAnalyticsPreview
 *
 * Sección de vista previa del dashboard analítico en vivo.
 * Muestra un perfil de creador con gráficos reales y métricas de engagement.
 *
 * Incluye:
 * - Tarjeta de perfil del creador (avatar, nombre, badge de plataforma)
 * - Gráfico de área de suscriptores (12 meses)
 * - Gráfico de barras de vistas mensuales
 * - Métricas de engagement: tasa, vistas promedio, videos
 * - Badges de crecimiento
 *
 * @see execution-pack/08-stage-prompts.md — Live Dashboard Preview
 */

'use client';

import { motion } from 'framer-motion';
import { Users, Eye, Video, TrendingUp } from 'lucide-react';
import { YoutubeIcon } from '@/components/shared/SocialIcons';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { MetricCard } from '@/components/shared/MetricCard';
import { GrowthBadge } from '@/components/shared/GrowthBadge';
import { CreatorAvatar } from '@/components/shared/CreatorAvatar';
import { SubscribersChart } from '@/components/charts/SubscribersChart';
import { ViewsChart } from '@/components/charts/ViewsChart';
import {
  FEATURED_CREATOR,
  SUBSCRIBERS_GROWTH_DATA,
  VIEWS_GROWTH_DATA,
} from '@/constants/mock-data';
import { formatCount } from '@/utils/format';

/**
 * LiveAnalyticsPreview — Dashboard analítico interactivo de demostración.
 */
export function LiveAnalyticsPreview() {
  const creator = FEATURED_CREATOR;
  const { metrics } = creator;

  return (
    <section
      id="analytics-preview"
      aria-label="Live Analytics Preview"
      className="relative py-24 overflow-hidden"
    >
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FF7A00, transparent)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeader
          eyebrow="Panel en Vivo"
          title="Analíticas reales. Crecimiento real."
          subtitle="Mira exactamente cómo se comporta tu audiencia. Desde hitos de suscriptores hasta picos de interacción — cada dato cuenta."
          centered
        />

        {/* ── Dashboard Preview Container ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="
            rounded-3xl
            bg-[#0A1B35]/80 backdrop-blur-xl
            border border-white/[0.07]
            overflow-hidden
            shadow-2xl shadow-black/40
          "
          style={{
            boxShadow: '0 0 80px rgba(255,122,0,0.05), 0 40px 80px rgba(0,0,0,0.3)',
          }}
        >
          {/* ── Dashboard Header Bar ── */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-[#071426]/40">
            {/* Browser-style dots */}
            <div className="flex items-center gap-2" aria-hidden="true">
              <span className="w-3 h-3 rounded-full bg-red-500/60" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
            </div>
            <span className="text-xs text-[#B8C4D4]/40 font-mono">viewlytics.app/channel/el-circo-podcast</span>
            <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              En vivo
            </span>
          </div>

          <div className="grid lg:grid-cols-[280px_1fr] divide-x divide-white/[0.05]">

            {/* ── Sidebar: Creator Profile ── */}
            <div className="p-6 flex flex-col gap-5">
              {/* Profile */}
              <div className="flex items-start gap-4">
                <CreatorAvatar name={creator.name} platform="youtube" size="lg" />
                <div className="min-w-0">
                  <p className="text-[#F5F7FA] font-bold text-base leading-tight truncate">
                    {creator.name}
                  </p>
                  <p className="text-[#B8C4D4] text-xs mt-0.5">{creator.handle}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <YoutubeIcon className="w-3.5 h-3.5 text-red-500" />
                    <span className="text-xs text-[#B8C4D4] capitalize">YouTube</span>
                  </div>
                </div>
              </div>

              {/* Growth badge */}
              <div className="flex items-center gap-2">
                <GrowthBadge rate={metrics.growthRate} />
                <span className="text-xs text-[#B8C4D4]">este mes</span>
              </div>

              {/* Subscriber highlight */}
              <div className="p-4 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/20">
                <p className="text-2xl font-bold text-[#F5F7FA]">
                  {formatCount(metrics.followers)}
                </p>
                <p className="text-xs text-[#FF7A00] font-semibold mt-0.5">Suscriptores</p>
              </div>

              {/* Sidebar metrics */}
              <div className="space-y-3">
                {[
                  { label: 'Vistas Totales', value: formatCount(metrics.views), icon: Eye },
                  { label: 'Videos Totales', value: metrics.uploads.toLocaleString(), icon: Video },
                  { label: 'Interacción', value: `${metrics.engagementScore}%`, icon: TrendingUp },
                  { label: 'Tasa de Crecimiento', value: `+${metrics.growthRate}%`, icon: Users },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-[#B8C4D4]" />
                        <span className="text-xs text-[#B8C4D4]">{item.label}</span>
                      </div>
                      <span className="text-xs font-semibold text-[#F5F7FA]">{item.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Main Content: Charts + Metrics ── */}
            <div className="p-6 flex flex-col gap-6">
              {/* Top metric cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard
                  label="Suscriptores"
                  value={formatCount(metrics.followers)}
                  change={`+${metrics.growthRate}%`}
                  positive
                  icon={<Users className="w-4 h-4" />}
                  accent="orange"
                  animationDelay={0}
                />
                <MetricCard
                  label="Vistas Totales"
                  value={formatCount(metrics.views)}
                  change="+8.2%"
                  positive
                  icon={<Eye className="w-4 h-4" />}
                  accent="blue"
                  animationDelay={0.05}
                />
                <MetricCard
                  label="Interacción"
                  value={`${metrics.engagementScore}%`}
                  change="+0.4%"
                  positive
                  icon={<TrendingUp className="w-4 h-4" />}
                  accent="green"
                  animationDelay={0.1}
                />
                <MetricCard
                  label="Videos"
                  value={metrics.uploads.toString()}
                  icon={<Video className="w-4 h-4" />}
                  accent="purple"
                  animationDelay={0.15}
                />
              </div>

              {/* Subscribers area chart */}
              <div className="p-4 rounded-2xl bg-[#071426]/60 border border-white/[0.05]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[#F5F7FA] text-sm font-semibold">Crecimiento de Suscriptores</p>
                    <p className="text-[#B8C4D4] text-xs mt-0.5">Últimos 12 meses</p>
                  </div>
                  <GrowthBadge rate={metrics.growthRate} size="sm" />
                </div>
                <SubscribersChart data={SUBSCRIBERS_GROWTH_DATA} height={160} />
              </div>

              {/* Views bar chart */}
              <div className="p-4 rounded-2xl bg-[#071426]/60 border border-white/[0.05]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[#F5F7FA] text-sm font-semibold">Vistas Mensuales</p>
                    <p className="text-[#B8C4D4] text-xs mt-0.5">Destacado: mes pico</p>
                  </div>
                </div>
                <ViewsChart data={VIEWS_GROWTH_DATA} height={130} />
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
