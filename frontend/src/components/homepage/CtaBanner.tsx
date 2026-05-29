/**
 * Viewlytics — CtaBanner
 *
 * Banner de llamada a la acción a pantalla completa.
 * Aparece justo antes del footer para capturar usuarios antes de que salgan.
 *
 * Incluye:
 * - Gradiente rojo de fondo
 * - Headline de impacto
 * - Dos CTAs (primario + secundario)
 * - Efecto de brillo ambiental
 */

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Search } from 'lucide-react';

/**
 * CtaBanner — Banner final de conversión con gradiente rojo.
 */
export function CtaBanner() {
  return (
    <section
      id="cta-banner"
      aria-label="Call to Action"
      className="vl-section"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 vl-bg-gradient-section"
        aria-hidden="true"
      />

      {/* Large central red glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-[0.12] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, var(--vl-red), transparent)' }}
        aria-hidden="true"
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 vl-bg-grid-pattern"
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
          <div className="vl-section-eyebrow justify-center mb-6">
            <span className="vl-section-eyebrow-line w-8" />
            <span className="vl-section-eyebrow-text">
              Comienza Ahora — Es Gratis
            </span>
            <span className="vl-section-eyebrow-line w-8" />
          </div>

          {/* Headline */}
          <h2 className="vl-section-title text-4xl sm:text-5xl lg:text-6xl mb-6">
            Comienza a explorar analíticas
            <br />
            <span className="vl-text-gradient-brand">
              de creadores hoy.
            </span>
          </h2>

          {/* Supporting text */}
          <p className="text-[var(--vl-text-secondary)] text-lg max-w-xl mx-auto leading-relaxed mb-10">
            Sigue el crecimiento, compara creadores y genera tarjetas analíticas compartibles — todo impulsado por datos reales.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/rankings"
              id="cta-banner-primary"
              className="vl-btn vl-btn-primary vl-btn-xl"
            >
              Explorar Rankings
              <ChevronRight className="w-4 h-4" />
            </Link>

            <Link
              href="/search"
              id="cta-banner-secondary"
              className="vl-btn vl-btn-outline vl-btn-xl"
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
