/**
 * Viewlytics — Dashboard Configuration (Phase 1.5)
 *
 * Controls dashboard grid cards, widgets, and analytics sections.
 * The homepage now renders as a live analytics dashboard preview.
 *
 * @see types/config.types.ts — Type definitions
 */

import type { DashboardConfig } from '@/types';

export const dashboardConfig: DashboardConfig = {
  /**
   * Dashboard stat widgets — metric summary cards.
   */
  widgets: [
    {
      id: 'subscribers',
      label: 'Subscribers',
      enabled: true,
      order: 1,
    },
    {
      id: 'total-views',
      label: 'Total Views',
      enabled: true,
      order: 2,
    },
    {
      id: 'total-uploads',
      label: 'Videos Uploaded',
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
      label: 'Growth Rate',
      enabled: true,
      order: 5,
    },
    {
      id: 'rank-position',
      label: 'Rank Position',
      enabled: true,
      order: 6,
    },
  ],

  /**
   * Analytics chart sections.
   */
  analyticsSections: [
    {
      id: 'subscriber-growth',
      title: 'Subscriber Growth',
      enabled: true,
      chartType: 'area',
    },
    {
      id: 'view-trends',
      title: 'View Trends',
      enabled: true,
      chartType: 'line',
    },
    {
      id: 'upload-frequency',
      title: 'Upload Frequency',
      enabled: true,
      chartType: 'bar',
    },
    {
      id: 'engagement-breakdown',
      title: 'Engagement Breakdown',
      enabled: true,
      chartType: 'pie',
    },
  ],

  /**
   * Dashboard grid cards — Phase 1.5 homepage layout.
   * These define the 6 cards in the dashboard grid.
   */
  cards: [
    {
      id: 'viewers-chart',
      title: 'Viewers',
      subtitle: 'Last 30 days',
      chartType: 'area',
      enabled: true,
      colSpan: 2,
      rowSpan: 1,
      order: 1,
    },
    {
      id: 'playtime-distribution',
      title: 'Playtime Distribution',
      chartType: 'pie',
      enabled: true,
      colSpan: 1,
      rowSpan: 1,
      order: 2,
    },
    {
      id: 'engagement-chart',
      title: 'Engagement',
      subtitle: 'By category',
      chartType: 'bar',
      enabled: true,
      colSpan: 1,
      rowSpan: 1,
      order: 3,
    },
    {
      id: 'platforms-distribution',
      title: 'Platforms',
      chartType: 'donut',
      enabled: true,
      colSpan: 1,
      rowSpan: 1,
      order: 4,
    },
    {
      id: 'live-now',
      title: 'Live Now',
      chartType: 'list',
      enabled: true,
      colSpan: 1,
      rowSpan: 2,
      order: 5,
    },
    {
      id: 'realtime-data',
      title: 'Real-time Analytics',
      subtitle: 'Last 60 minutes',
      chartType: 'line',
      enabled: true,
      colSpan: 2,
      rowSpan: 1,
      order: 6,
    },
  ],

  /** Default time range on dashboard load */
  defaultTimeRange: '30d',
} as const;
