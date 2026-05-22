/**
 * Viewlytics — Config Types (Phase 1.5)
 *
 * Type definitions for the configuration layer.
 * Homepage, rankings, dashboard, and export configs are all strongly typed.
 *
 * @see execution-pack/03-configuration-system.md — Config architecture
 */

/**
 * Hero section configuration for the homepage.
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
 * Homepage widget section configuration.
 */
export interface HomepageWidgetConfig {
  readonly id: string;
  readonly title: string;
  readonly type: 'trending' | 'featured' | 'growth' | 'recent';
  readonly enabled: boolean;
  readonly maxItems: number;
}

/**
 * Complete homepage configuration.
 */
export interface HomepageConfig {
  readonly hero: HeroConfig;
  readonly widgets: readonly HomepageWidgetConfig[];
  readonly showTrendingSection: boolean;
  readonly showFeaturedRankings: boolean;
}

/**
 * Ranking category definition.
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
 * Complete rankings configuration.
 */
export interface RankingsConfig {
  readonly categories: readonly RankingCategory[];
  readonly defaultCategory: string;
  readonly itemsPerPage: number;
  readonly showRankChange: boolean;
}

/**
 * Dashboard widget visibility configuration.
 */
export interface DashboardWidgetConfig {
  readonly id: string;
  readonly label: string;
  readonly enabled: boolean;
  readonly order: number;
}

/**
 * Analytics chart section configuration.
 */
export interface AnalyticsSectionConfig {
  readonly id: string;
  readonly title: string;
  readonly enabled: boolean;
  readonly chartType: 'line' | 'bar' | 'area' | 'pie' | 'donut';
}

/**
 * Dashboard card configuration — Phase 1.5 grid card system.
 */
export interface DashboardCardConfig {
  /** Unique card identifier */
  readonly id: string;
  /** Card display title */
  readonly title: string;
  /** Optional subtitle */
  readonly subtitle?: string;
  /** Chart type rendered inside the card */
  readonly chartType: 'line' | 'bar' | 'area' | 'pie' | 'donut' | 'list';
  /** Whether this card is enabled */
  readonly enabled: boolean;
  /** Grid column span (1-3) */
  readonly colSpan: 1 | 2 | 3;
  /** Grid row span (1-2) */
  readonly rowSpan: 1 | 2;
  /** Display order in the grid */
  readonly order: number;
}

/**
 * Complete dashboard configuration.
 */
export interface DashboardConfig {
  readonly widgets: readonly DashboardWidgetConfig[];
  readonly analyticsSections: readonly AnalyticsSectionConfig[];
  readonly cards: readonly DashboardCardConfig[];
  readonly defaultTimeRange: '7d' | '30d' | '90d' | '1y';
}

/**
 * Export dimension preset.
 */
export interface ExportDimension {
  readonly id: string;
  readonly label: string;
  readonly width: number;
  readonly height: number;
  readonly platform: string;
}

/**
 * Social export template.
 */
export interface SocialTemplate {
  readonly id: string;
  readonly name: string;
  readonly platform: 'instagram' | 'facebook' | 'twitter' | 'tiktok';
  readonly dimension: ExportDimension;
  readonly enabled: boolean;
}

/**
 * Complete export system configuration.
 */
export interface ExportConfig {
  readonly dimensions: readonly ExportDimension[];
  readonly templates: readonly SocialTemplate[];
  readonly watermarkEnabled: boolean;
  readonly watermarkText: string;
  readonly defaultFormat: 'png' | 'jpg';
  readonly defaultQuality: number;
}
