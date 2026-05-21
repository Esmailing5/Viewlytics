/**
 * Viewlytics — Exportación del Sistema de Tipos (Barrel Export)
 *
 * Re-exportación central para todas las definiciones de tipos.
 * Importe tipos desde '@/types' para mantener importaciones limpias y consistentes en todo el proyecto.
 *
 * Uso:
 *   import type { CreatorProfile, BrandConfig } from '@/types';
 */

export type {
  HexColor,
  BrandColors,
  BrandColorVariants,
  BrandGradient,
  BrandTypography,
  BrandWatermark,
  BrandLogo,
  BrandConfig,
} from './branding.types';

export type {
  NavigationItem,
  NavigationGroup,
  NavigationConfig,
} from './navigation.types';

export type {
  PlatformType,
  CreatorMetrics,
  GrowthDataPoint,
  GrowthData,
  CreatorProfile,
  RankingEntry,
  PaginatedResponse,
  TimeRange,
  SortDirection,
} from './analytics.types';

export type {
  HeroConfig,
  HomepageWidgetConfig,
  HomepageConfig,
  RankingCategory,
  RankingsConfig,
  DashboardWidgetConfig,
  AnalyticsSectionConfig,
  DashboardConfig,
  ExportDimension,
  SocialTemplate,
  ExportConfig,
} from './config.types';
