/**
 * Viewlytics — SectionHeader
 *
 * Componente reutilizable para encabezados de sección.
 * Mantiene consistencia tipográfica en todas las secciones de la homepage.
 *
 * @example
 * <SectionHeader
 *   eyebrow="Rankings"
 *   title="Top Dominican Creators"
 *   subtitle="Updated daily with real analytics data."
 *   centered
 * />
 */

'use client';

import { motion } from 'framer-motion';

interface SectionHeaderProps {
  /** Texto pequeño sobre el título principal (badge label) */
  eyebrow?: string;
  /** Título principal de la sección */
  title: string;
  /** Texto de soporte debajo del título */
  subtitle?: string;
  /** Centra el texto horizontalmente */
  centered?: boolean;
  /** ID HTML para accesibilidad */
  id?: string;
}

/**
 * SectionHeader — Encabezado cinematográfico de sección.
 * Incluye animación de entrada suave con Framer Motion.
 */
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = false,
  id,
}: SectionHeaderProps) {
  return (
    <motion.div
      id={id}
      className={`mb-12 ${centered ? 'text-center' : ''}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {eyebrow && (
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="w-5 h-px bg-[#FF7A00]" />
          <span className="text-[#FF7A00] text-xs font-semibold tracking-widest uppercase">
            {eyebrow}
          </span>
          <span className="w-5 h-px bg-[#FF7A00]" />
        </div>
      )}

      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F5F7FA] leading-tight tracking-tight">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-[#B8C4D4] max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
