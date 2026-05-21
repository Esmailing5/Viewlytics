/**
 * Viewlytics — CtaBanner
 *
 * Banner de llamada a la acción a pantalla completa.
 * Aparece justo antes del footer para capturar usuarios antes de que salgan.
 *
 * Incluye:
 * - Gradiente naranja de fondo
 * - Headline de impacto
 * - Dos CTAs (primario + secundario)
 * - Efecto de brillo ambiental
 */

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Search } from 'lucide-react';

/**
 * CtaBanner — Banner final de conversión con gradiente naranja.
 */
export function CtaBanner() {
  return (
    <section
      id="cta-banner"
      aria-label="Call to Action"
      className="relative py-24 overflow-hidden"
    >
      {/* Orange gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, #0F2747 0%, #071426 40%, #0A1B35 60%, #071426 100%)',
        }}
        aria-hidden="true"
      />

      {/* Large central orange glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #FF7A00, transparent)' }}
        aria-hidden="true"
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(245,247,250,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,247,250,1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="w-8 h-px bg-[#FF7A00]/50" aria-hidden="true" />
            <span className="text-[#FF7A00] text-xs font-semibold tracking-widest uppercase">
              Comienza Ahora — Es Gratis
            </span>
            <span className="w-8 h-px bg-[#FF7A00]/50" aria-hidden="true" />
          </div>

          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F5F7FA] leading-tight tracking-tight mb-6">
            Comienza a explorar analíticas
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #FF7A00 0%, #FFB366 50%, #FF7A00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              de creadores hoy.
            </span>
          </h2>

          {/* Supporting text */}
          <p className="text-[#B8C4D4] text-lg max-w-xl mx-auto leading-relaxed mb-10">
            Sigue el crecimiento, compara creadores y genera tarjetas analíticas compartibles — todo impulsado por datos reales.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/rankings"
              id="cta-banner-primary"
              className="
                inline-flex items-center gap-2
                px-7 py-3.5 rounded-xl
                bg-[#FF7A00] hover:bg-[#FF9A33]
                text-white font-semibold
                transition-all duration-200
                shadow-2xl shadow-[#FF7A00]/30
                hover:shadow-[#FF7A00]/50
                hover:-translate-y-0.5
              "
            >
              Explorar Rankings
              <ChevronRight className="w-4 h-4" />
            </Link>

            <Link
              href="/search"
              id="cta-banner-secondary"
              className="
                inline-flex items-center gap-2
                px-7 py-3.5 rounded-xl
                border border-white/[0.15] hover:border-white/[0.25]
                bg-white/[0.04] hover:bg-white/[0.08]
                text-[#F5F7FA] font-semibold
                transition-all duration-200
              "
            >
              <Search className="w-4 h-4" />
              Buscar Creador
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
