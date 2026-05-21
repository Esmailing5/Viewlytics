/**
 * Viewlytics — Tipos de Configuración
 *
 * Definiciones de tipo para la capa de configuración.
 * Cada archivo de configuración (página de inicio, rankings, panel, exportación) está fuertemente tipado
 * para permitir paneles de administración y futuras integraciones con CMS.
 *
 * @see execution-pack/03-configuration-system.md — Arquitectura de configuración
 */

/**
 * Configuración de la sección Hero para la página de inicio.
 */
export interface HeroConfig {
  readonly title: string;
  readonly subtitle: string;
  readonly ctaText: string;
  readonly ctaHref: string;
  readonly secondaryCtaText?: string;
  readonly secondaryCtaHref?: string;
}

/**
 * Configuración de widgets para las secciones destacadas de la página de inicio.
 */
export interface HomepageWidgetConfig {
  readonly id: string;
  readonly title: string;
  readonly type: 'trending' | 'featured' | 'growth' | 'recent';
  readonly enabled: boolean;
  readonly maxItems: number;
}

/**
 * Configuración completa de la página de inicio.
 */
export interface HomepageConfig {
  readonly hero: HeroConfig;
  readonly widgets: readonly HomepageWidgetConfig[];
  readonly showTrendingSection: boolean;
  readonly showFeaturedRankings: boolean;
}

/**
 * Definición de categoría de clasificación (ranking).
 */
export interface RankingCategory {
  readonly id: string;
  readonly label: string;
  readonly slug: string;
  readonly description: string;
  readonly seoTitle: string;
  readonly seoDescription: string;
  readonly enabled: boolean;
  readonly sortOrder: number;
}

/**
 * Configuración completa de clasificaciones (rankings).
 */
export interface RankingsConfig {
  readonly categories: readonly RankingCategory[];
  readonly defaultCategory: string;
  readonly itemsPerPage: number;
  readonly showRankChange: boolean;
}

/**
 * Configuración de visibilidad del widget en el panel de control.
 */
export interface DashboardWidgetConfig {
  readonly id: string;
  readonly label: string;
  readonly enabled: boolean;
  readonly order: number;
}

/**
 * Configuración de la sección de gráficos analíticos.
 */
export interface AnalyticsSectionConfig {
  readonly id: string;
  readonly title: string;
  readonly enabled: boolean;
  readonly chartType: 'line' | 'bar' | 'area' | 'pie';
}

/**
 * Configuración completa del panel de control (dashboard).
 */
export interface DashboardConfig {
  readonly widgets: readonly DashboardWidgetConfig[];
  readonly analyticsSections: readonly AnalyticsSectionConfig[];
  readonly defaultTimeRange: '7d' | '30d' | '90d' | '1y';
}

/**
 * Ajuste preestablecido de dimensiones de exportación.
 */
export interface ExportDimension {
  readonly id: string;
  readonly label: string;
  readonly width: number;
  readonly height: number;
  readonly platform: string;
}

/**
 * Plantilla de exportación para redes sociales.
 */
export interface SocialTemplate {
  readonly id: string;
  readonly name: string;
  readonly platform: 'instagram' | 'facebook' | 'twitter' | 'tiktok';
  readonly dimension: ExportDimension;
  readonly enabled: boolean;
}

/**
 * Configuración completa del sistema de exportación.
 */
export interface ExportConfig {
  readonly dimensions: readonly ExportDimension[];
  readonly templates: readonly SocialTemplate[];
  readonly watermarkEnabled: boolean;
  readonly watermarkText: string;
  readonly defaultFormat: 'png' | 'jpg';
  readonly defaultQuality: number;
}
