/**
 * Viewlytics — Configuración de la Página de Inicio (Homepage)
 *
 * Controla todo el contenido configurable de la página de inicio: sección hero, widgets y características.
 * Mantiene el contenido de la página de inicio editable sin tocar el código del componente.
 *
 * La Etapa 01 consumirá estos valores para renderizar la página de inicio.
 *
 * @see types/config.types.ts — Definiciones de tipo
 * @see execution-pack/03-configuration-system.md — Arquitectura de configuración
 */

import type { HomepageConfig } from '@/types';

export const homepageConfig: HomepageConfig = {
  /**
   * Sección Hero: lo primero que ven los usuarios.
   * Debe comunicar el valor de la plataforma en menos de 3 segundos (Principio de UX).
   */
  hero: {
    title: 'Inteligencia Analítica de Creadores',
    subtitle: 'Analiza el crecimiento, detecta tendencias y descubre estadísticas clave de los creadores dominicanos — podcasts, streamers y medios digitales.',
    ctaText: 'Explorar Rankings',
    ctaHref: '/rankings',
    secondaryCtaText: 'Buscar Creador',
    secondaryCtaHref: '/search',
  },

  /**
   * Widgets de la página de inicio: secciones de contenido configurables debajo del hero.
   * Cada widget se puede activar/desactivar y reordenar.
   */
  widgets: [
    {
      id: 'trending-creators',
      title: 'Trending Creators',
      type: 'trending',
      enabled: true,
      maxItems: 6,
    },
    {
      id: 'top-growth',
      title: 'Top Growth This Week',
      type: 'growth',
      enabled: true,
      maxItems: 5,
    },
    {
      id: 'featured-rankings',
      title: 'Featured Rankings',
      type: 'featured',
      enabled: true,
      maxItems: 10,
    },
    {
      id: 'recently-added',
      title: 'Recently Added',
      type: 'recent',
      enabled: true,
      maxItems: 4,
    },
  ],

  /** Indica si se debe mostrar la sección de tendencias en la página de inicio */
  showTrendingSection: true,

  /** Indica si se debe mostrar la vista previa de las clasificaciones destacadas en la página de inicio */
  showFeaturedRankings: true,
} as const;
