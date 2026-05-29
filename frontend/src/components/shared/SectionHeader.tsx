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
      className={`vl-section-header ${centered ? 'text-center' : ''}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {eyebrow && (
        <div className="vl-section-eyebrow">
          <span className="vl-section-eyebrow-line" />
          <span className="vl-section-eyebrow-text">
            {eyebrow}
          </span>
          <span className="vl-section-eyebrow-line" />
        </div>
      )}

      <h2 className="vl-section-title">
        {title}
      </h2>

      {subtitle && (
        <p className={`vl-section-subtitle ${centered ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
