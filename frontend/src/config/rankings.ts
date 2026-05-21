/**
 * Viewlytics — Configuración de Clasificaciones (Rankings)
 *
 * Controla las categorías de clasificación, los metadatos de SEO y los ajustes de visualización.
 * El motor de clasificación se ejecuta en el servidor — el frontend solo muestra los resultados.
 *
 * La Etapa 04 consumirá estos valores para renderizar las páginas de clasificación.
 *
 * @see types/config.types.ts — Definiciones de tipo
 * @see execution-pack/03-configuration-system.md — Arquitectura de configuración
 * @see execution-pack/10-core-protection.md — Aislamiento del motor de clasificación
 */

import type { RankingsConfig } from '@/types';

export const rankingsConfig: RankingsConfig = {
  /**
   * Categorías de clasificación: cada una genera su propia página optimizada para SEO.
   * Las categorías están ordenadas por sortOrder para una visualización consistente.
   */
  categories: [
    {
      id: 'top-creators',
      label: 'Top Creators',
      slug: 'top-creators',
      description: 'The most-followed creators in the Dominican Republic',
      seoTitle: 'Top Dominican Creators — Viewlytics Rankings',
      seoDescription: 'Discover the top creators from the Dominican Republic. Real-time rankings powered by analytics intelligence.',
      enabled: true,
      sortOrder: 1,
    },
    {
      id: 'top-growth',
      label: 'Top Growth',
      slug: 'top-growth',
      description: 'Fastest growing creators this month',
      seoTitle: 'Fastest Growing Creators — Viewlytics Rankings',
      seoDescription: 'Track which Dominican creators are growing the fastest. Updated daily with real analytics.',
      enabled: true,
      sortOrder: 2,
    },
    {
      id: 'top-podcasts',
      label: 'Top Podcasts',
      slug: 'top-podcasts',
      description: 'Most popular podcast channels',
      seoTitle: 'Top Dominican Podcasts — Viewlytics Rankings',
      seoDescription: 'Rankings of the most popular Dominican podcasts by subscribers, views, and engagement.',
      enabled: true,
      sortOrder: 3,
    },
    {
      id: 'top-gaming',
      label: 'Top Gaming',
      slug: 'top-gaming',
      description: 'Leading gaming creators and streamers',
      seoTitle: 'Top Dominican Gaming Creators — Viewlytics Rankings',
      seoDescription: 'Discover the top Dominican gaming creators across YouTube, Twitch, and Kick.',
      enabled: true,
      sortOrder: 4,
    },
    {
      id: 'top-streamers',
      label: 'Top Streamers',
      slug: 'top-streamers',
      description: 'Most watched live streamers',
      seoTitle: 'Top Dominican Streamers — Viewlytics Rankings',
      seoDescription: 'Rankings of the most-watched Dominican streamers across all platforms.',
      enabled: true,
      sortOrder: 5,
    },
  ],

  /** Categoría predeterminada al navegar a /rankings */
  defaultCategory: 'top-creators',

  /** Número de elementos por página en las listas de clasificación */
  itemsPerPage: 25,

  /** Indica si se deben mostrar los indicadores de cambio de clasificación (+/- posiciones) */
  showRankChange: true,
} as const;
