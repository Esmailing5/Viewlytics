/**
 * Viewlytics — Type System Barrel Export (Phase 1.5)
 *
 * Central re-export for all type definitions.
 * Import types from '@/types' for clean, consistent imports.
 *
 * Usage:
 *   import type { CreatorProfile, BrandConfig, Theme } from '@/types';
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
  SidebarItem,
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
  HomepageConfig,
  RankingCategory,
  RankingsConfig,
  DashboardWidgetConfig,
  AnalyticsSectionConfig,
  DashboardCardConfig,
  DashboardConfig,
  ExportDimension,
  SocialTemplate,
  ExportConfig,
} from './config.types';

export type {
  Theme,
  ThemeContextValue,
} from './theme.types';

export type {
  User,
  AuthState,
} from './auth.types';

