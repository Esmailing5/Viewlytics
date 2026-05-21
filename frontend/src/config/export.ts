/**
 * Viewlytics — Configuración de Exportación
 *
 * Controla las dimensiones de exportación, las plantillas de redes sociales y el comportamiento de la marca de agua.
 * Las tarjetas de exportación están diseñadas para bucles de distribución viral en redes sociales.
 *
 * La Etapa 05 consumirá estos valores para generar tarjetas analíticas compartibles.
 *
 * @see types/config.types.ts — Definiciones de tipo
 * @see execution-pack/11-export-system.md — Especificación del sistema de exportación
 * @see execution-pack/12-branding-system.md — Reglas de la marca de agua
 */

import type { ExportConfig } from '@/types';

export const exportConfig: ExportConfig = {
  /**
   * Dimensiones de exportación disponibles.
   * Cada dimensión está optimizada para una plataforma de redes sociales específica.
   */
  dimensions: [
    {
      id: 'square',
      label: 'Square (1080×1080)',
      width: 1080,
      height: 1080,
      platform: 'Instagram / Facebook',
    },
    {
      id: 'portrait',
      label: 'Portrait (1080×1350)',
      width: 1080,
      height: 1350,
      platform: 'Instagram Portrait',
    },
    {
      id: 'story',
      label: 'Story (1080×1920)',
      width: 1080,
      height: 1920,
      platform: 'Instagram / TikTok Story',
    },
    {
      id: 'landscape',
      label: 'Landscape (1920×1080)',
      width: 1920,
      height: 1080,
      platform: 'Twitter / YouTube',
    },
  ],

  /**
   * Plantillas de exportación para redes sociales.
   * Combinaciones preconfiguradas de dimensión + estilo de plataforma.
   */
  templates: [
    {
      id: 'instagram-square',
      name: 'Instagram Post',
      platform: 'instagram',
      dimension: {
        id: 'square',
        label: 'Square (1080×1080)',
        width: 1080,
        height: 1080,
        platform: 'Instagram',
      },
      enabled: true,
    },
    {
      id: 'instagram-portrait',
      name: 'Instagram Portrait',
      platform: 'instagram',
      dimension: {
        id: 'portrait',
        label: 'Portrait (1080×1350)',
        width: 1080,
        height: 1350,
        platform: 'Instagram',
      },
      enabled: true,
    },
    {
      id: 'facebook-post',
      name: 'Facebook Post',
      platform: 'facebook',
      dimension: {
        id: 'square',
        label: 'Square (1080×1080)',
        width: 1080,
        height: 1080,
        platform: 'Facebook',
      },
      enabled: true,
    },
    {
      id: 'twitter-card',
      name: 'Twitter Card',
      platform: 'twitter',
      dimension: {
        id: 'landscape',
        label: 'Landscape (1920×1080)',
        width: 1920,
        height: 1080,
        platform: 'Twitter',
      },
      enabled: true,
    },
  ],

  /**
   * Ajustes de marca de agua.
   * Todas las exportaciones DEBEN incluir la marca de agua de Viewlytics según las reglas de marca.
   */
  watermarkEnabled: true,
  watermarkText: 'Powered by Viewlytics',

  /** Formato y calidad de exportación predeterminados */
  defaultFormat: 'png',
  defaultQuality: 95,
} as const;
