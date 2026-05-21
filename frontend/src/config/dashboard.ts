/**
 * Viewlytics — Configuración del Panel de Control (Dashboard)
 *
 * Controla qué widgets analíticos, gráficos y secciones se muestran
 * en el panel de control del creador/página de canal.
 *
 * La Etapa 02 consumirá estos valores para renderizar la página de analíticas del canal.
 *
 * @see types/config.types.ts — Definiciones de tipo
 * @see execution-pack/03-configuration-system.md — Arquitectura de configuración
 */

import type { DashboardConfig } from '@/types';

export const dashboardConfig: DashboardConfig = {
  /**
   * Widgets del panel de control: cada uno se puede activar/desactivar y reordenar.
   * El orden determina la secuencia de visualización en el panel.
   */
  widgets: [
    {
      id: 'subscribers',
      label: 'Suscriptores',
      enabled: true,
      order: 1,
    },
    {
      id: 'total-views',
      label: 'Vistas Totales',
      enabled: true,
      order: 2,
    },
    {
      id: 'total-uploads',
      label: 'Videos Subidos',
      enabled: true,
      order: 3,
    },
    {
      id: 'engagement-score',
      label: 'Engagement',
      enabled: true,
      order: 4,
    },
    {
      id: 'growth-rate',
      label: 'Tasa de Crecimiento',
      enabled: true,
      order: 5,
    },
    {
      id: 'rank-position',
      label: 'Posición de Ranking',
      enabled: true,
      order: 6,
    },
  ],

  /**
   * Secciones de gráficos analíticos: visualizaciones de gráficos configurables.
   * Cada sección se asocia con un tipo de gráfico específico y una fuente de datos.
   */
  analyticsSections: [
    {
      id: 'subscriber-growth',
      title: 'Crecimiento de Suscriptores',
      enabled: true,
      chartType: 'area',
    },
    {
      id: 'view-trends',
      title: 'Tendencia de Vistas',
      enabled: true,
      chartType: 'line',
    },
    {
      id: 'upload-frequency',
      title: 'Frecuencia de Videos',
      enabled: true,
      chartType: 'bar',
    },
    {
      id: 'engagement-breakdown',
      title: 'Desglose de Interacción',
      enabled: true,
      chartType: 'pie',
    },
  ],

  /** Rango de tiempo predeterminado al cargar el panel de control */
  defaultTimeRange: '30d',
} as const;
