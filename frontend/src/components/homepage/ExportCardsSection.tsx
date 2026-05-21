/**
 * Viewlytics — ExportCardsSection
 *
 * Sección de exportación de tarjetas analíticas para redes sociales.
 * Muestra previews de tarjetas Premium listas para Instagram, Facebook y Twitter.
 *
 * Incluye:
 * - Preview de tarjeta cuadrada (1080×1080 Instagram)
 * - Preview de tarjeta portrait (1080×1350 Instagram)
 * - Watermark "Powered by Viewlytics"
 * - Iconos de plataformas sociales
 * - CTA de generación
 *
 * @see execution-pack/11-export-system.md — Export system specification
 * @see src/config/export.ts — Export dimensions + templates
 */

'use client';

import { motion } from 'framer-motion';
import { Share2, Download, Sparkles } from 'lucide-react';
import { InstagramIcon, TwitterIcon, FacebookIcon } from '@/components/shared/SocialIcons';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { brandConfig } from '@/config/branding';
import { exportConfig } from '@/config/export';

/** Datos de preview de la tarjeta de exportación */
const CARD_PREVIEW = {
  creatorName: 'El Circo Podcast',
  subscribers: '1.4M',
  growth: '+12.4%',
  views: '87.3M',
  rank: '#2',
  category: 'Top Podcasts RD',
  period: 'Mayo 2026',
};

/** Componente de preview de tarjeta de exportación */
function ExportCardPreview({
  format,
  delay = 0,
}: {
  format: 'square' | 'portrait';
  delay?: number;
}) {
  const isPortrait = format === 'portrait';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: isPortrait ? 4 : -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: isPortrait ? 4 : -2 }}
      whileHover={{ rotate: 0, scale: 1.02, y: -4 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
      className={`
        relative flex-shrink-0
        ${isPortrait ? 'w-40 h-52' : 'w-52 h-52'}
        rounded-2xl overflow-hidden
        shadow-2xl shadow-black/50
        cursor-pointer
      `}
      style={{
        background: 'linear-gradient(135deg, #071426 0%, #0F2747 60%, #0A1B35 100%)',
        border: '1px solid rgba(245,247,250,0.08)',
      }}
    >
      {/* Card inner content */}
      <div className="absolute inset-0 p-4 flex flex-col">
        {/* Top: Platform + Logo */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[8px] font-bold text-[#FF7A00] uppercase tracking-widest">
            {CARD_PREVIEW.category}
          </span>
          <div className="w-4 h-4 rounded-sm bg-[#FF7A00]/20 flex items-center justify-center">
            <span className="text-[6px] font-black text-[#FF7A00]">V</span>
          </div>
        </div>

        {/* Creator initials avatar */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-base mb-2"
          style={{ background: 'linear-gradient(135deg, #FF7A00, #FF9A33)' }}
        >
          E
        </div>

        {/* Creator name */}
        <p className="text-white font-bold text-xs leading-tight mb-1">
          {CARD_PREVIEW.creatorName}
        </p>

        {/* Stats */}
        <div className="flex-1 flex flex-col justify-end gap-1">
          <div className="grid grid-cols-2 gap-1.5">
            <div className="p-1.5 rounded-lg bg-white/[0.05] border border-white/[0.05]">
              <p className="text-[#FF7A00] font-bold text-[10px]">{CARD_PREVIEW.subscribers}</p>
              <p className="text-[#B8C4D4] text-[8px]">Suscriptores</p>
            </div>
            <div className="p-1.5 rounded-lg bg-white/[0.05] border border-white/[0.05]">
              <p className="text-emerald-400 font-bold text-[10px]">{CARD_PREVIEW.growth}</p>
              <p className="text-[#B8C4D4] text-[8px]">Crecimiento</p>
            </div>
            <div className="p-1.5 rounded-lg bg-white/[0.05] border border-white/[0.05]">
              <p className="text-blue-400 font-bold text-[10px]">{CARD_PREVIEW.views}</p>
              <p className="text-[#B8C4D4] text-[8px]">Vistas</p>
            </div>
            <div className="p-1.5 rounded-lg bg-[#FF7A00]/15 border border-[#FF7A00]/20">
              <p className="text-[#FF7A00] font-bold text-[10px]">{CARD_PREVIEW.rank}</p>
              <p className="text-[#B8C4D4] text-[8px]">Top</p>
            </div>
          </div>

          {/* Watermark */}
          <p className="text-[#B8C4D4]/40 text-[7px] text-center mt-1">
            {exportConfig.watermarkText}
          </p>
        </div>
      </div>

      {/* Subtle orange glow at top */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #FF7A00, transparent)' }}
        aria-hidden="true"
      />

      {/* Format label badge */}
      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-white/10 backdrop-blur-sm">
        <p className="text-[7px] font-bold text-[#B8C4D4]">
          {isPortrait ? '1080×1350' : '1080×1080'}
        </p>
      </div>
    </motion.div>
  );
}

/**
 * ExportCardsSection — Sección de vista previa de tarjetas de exportación social.
 */
export function ExportCardsSection() {
  return (
    <section
      id="export-cards"
      aria-label="Social Export Cards"
      className="relative py-24 overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at 80% 50%, rgba(255,122,0,0.04) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── LEFT: Card Previews ── */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative flex items-center justify-center min-h-[320px]"
          >
            {/* Stacked cards with rotation offsets */}
            <div className="flex items-center justify-center gap-[-20px] relative">
              <ExportCardPreview format="square" delay={0.1} />
              <div className="-ml-16">
                <ExportCardPreview format="portrait" delay={0.2} />
              </div>
            </div>

            {/* Floating platform badges */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute top-8 -left-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0F2747]/80 border border-white/[0.08] backdrop-blur-md shadow-xl"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                <InstagramIcon className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <p className="text-[#F5F7FA] text-xs font-semibold">Instagram</p>
                <p className="text-[#B8C4D4] text-[10px]">1080×1080 · 1080×1350</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute bottom-8 -right-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0F2747]/80 border border-white/[0.08] backdrop-blur-md shadow-xl"
            >
              <div className="w-6 h-6 rounded-lg bg-sky-500 flex items-center justify-center">
                <TwitterIcon className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <p className="text-[#F5F7FA] text-xs font-semibold">Twitter / X</p>
                <p className="text-[#B8C4D4] text-[10px]">1920×1080</p>
              </div>
            </motion.div>

            {/* Download count badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.4, type: 'spring' }}
              className="absolute top-1/2 right-0 transform -translate-y-1/2 px-3 py-2 rounded-xl bg-[#FF7A00] text-white shadow-lg shadow-[#FF7A00]/30"
            >
              <div className="flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">Exportar PNG</span>
              </div>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Copy ── */}
          <div>
            <SectionHeader
              eyebrow="Motor de Exportación"
              title="Comparte tus analíticas de creador"
              subtitle="Genera impresionantes tarjetas sociales al instante. Comparte clasificaciones, hitos de crecimiento e insights analíticos — diseñadas para Instagram, Twitter y Facebook."
            />

            {/* Features */}
            <div className="space-y-4 mb-8">
              {[
                {
                  icon: Sparkles,
                  title: 'Tarjetas Listas para Redes',
                  desc: 'Dimensionadas para Instagram, Twitter y Facebook. Sin necesidad de Photoshop.',
                },
                {
                  icon: Download,
                  title: 'Exportación PNG de Alta Resolución',
                  desc: 'Formatos de 1080×1080 y 1080×1350 con renderizado nítido.',
                },
                {
                  icon: Share2,
                  title: `${brandConfig.watermark.text}`,
                  desc: 'Todas las exportaciones llevan la marca Viewlytics para distribución viral.',
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#FF7A00]/10 border border-[#FF7A00]/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#FF7A00]" />
                    </div>
                    <div>
                      <p className="text-[#F5F7FA] text-sm font-semibold">{item.title}</p>
                      <p className="text-[#B8C4D4] text-sm mt-0.5">{item.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Platform icons */}
            <div className="flex items-center gap-3 mb-8">
              <span className="text-xs text-[#B8C4D4]/60">Soporta:</span>
              {[
                { Icon: InstagramIcon, label: 'Instagram', bg: 'from-pink-600 to-purple-600' },
                { Icon: FacebookIcon, label: 'Facebook', bg: 'from-blue-600 to-blue-500' },
                { Icon: TwitterIcon, label: 'Twitter', bg: 'from-sky-500 to-sky-400' },
              ].map(({ Icon, label, bg }) => (
                <div
                  key={label}
                  className={`w-8 h-8 rounded-xl bg-gradient-to-br ${bg} flex items-center justify-center`}
                  title={label}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>
              ))}
            </div>

            <button
              id="export-cta-btn"
              aria-label="Generate export card"
              className="
                inline-flex items-center gap-2
                px-6 py-3 rounded-xl
                bg-[#FF7A00] hover:bg-[#FF9A33]
                text-white text-sm font-semibold
                transition-all duration-200
                shadow-xl shadow-[#FF7A00]/20
                hover:-translate-y-0.5
              "
            >
              <Sparkles className="w-4 h-4" />
              Generar tu Tarjeta
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
