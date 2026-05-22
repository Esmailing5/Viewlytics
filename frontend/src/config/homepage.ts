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
    title: 'Analítica Inteligente para Creadores y Streams',
    subtitle: 'Descubre estadísticas, crecimiento y tendencias de YouTube, Twitch y Kick en tiempo real.',
    ctaText: 'Buscar un canal',
    ctaHref: '/search',
    secondaryCtaText: 'Explorar Rankings',
    secondaryCtaHref: '/rankings',
  },

  features: [
    {
      id: 'historical',
      title: 'Historical Analytics',
      description: 'Accede al historial de crecimiento y visualizaciones de los últimos años.',
      icon: 'BarChart3',
    },
    {
      id: 'realtime',
      title: 'Real-time Tracking',
      description: 'Monitoreo en vivo de espectadores y métricas de streams.',
      icon: 'Activity',
    },
    {
      id: 'growth',
      title: 'Growth Intelligence',
      description: 'Proyecciones de crecimiento basadas en algoritmos avanzados.',
      icon: 'TrendingUp',
    },
    {
      id: 'ranking',
      title: 'Ranking Engine',
      description: 'Descubre quién domina cada categoría en la República Dominicana.',
      icon: 'Trophy',
    },
    {
      id: 'crossplatform',
      title: 'Cross-platform Metrics',
      description: 'YouTube, Twitch y Kick unificados en un solo panel.',
      icon: 'Globe',
    },
    {
      id: 'engagement',
      title: 'Engagement Tracking',
      description: 'Mide la fidelidad de la audiencia y la interacción real.',
      icon: 'Users',
    },
  ],

  cta: {
    title: '¿Listo para descubrir los datos detrás del éxito?',
    subtitle: 'Busca a tu creador favorito y sumérgete en las analíticas detalladas.',
  },
} as const;
