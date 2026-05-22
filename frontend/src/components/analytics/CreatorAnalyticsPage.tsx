'use client';

import { Suspense, lazy } from 'react';
import { Eye, Clock, Users, TrendingUp } from 'lucide-react';
import { STAT_METRICS } from '@/constants/dashboard-mock-data';
import type { StatMetric } from '@/constants/dashboard-mock-data';

// Lazy-loaded chart components for performance
const ViewersChart = lazy(() => import('./ViewersChart').then((m) => ({ default: m.ViewersChart })));
const PlaytimeDistribution = lazy(() => import('./PlaytimeDistribution').then((m) => ({ default: m.PlaytimeDistribution })));
const EngagementChart = lazy(() => import('./EngagementChart').then((m) => ({ default: m.EngagementChart })));
const PlatformsDistribution = lazy(() => import('./PlatformsDistribution').then((m) => ({ default: m.PlatformsDistribution })));
const LiveNowPanel = lazy(() => import('./LiveNowPanel').then((m) => ({ default: m.LiveNowPanel })));
const RealtimeChart = lazy(() => import('./RealtimeChart').then((m) => ({ default: m.RealtimeChart })));

/** Icon map for stat cards */
const STAT_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Eye,
  Clock,
  Users,
  TrendingUp,
};

/** Loading skeleton for chart cards */
function ChartSkeleton() {
  return (
    <div className="dashboard-card p-5 animate-pulse">
      <div className="h-4 w-24 bg-[var(--border-color)] rounded mb-4" />
      <div className="h-[200px] bg-[var(--border-color)] rounded-xl opacity-30" />
    </div>
  );
}

/** Stat metric card */
function StatCard({ metric }: { metric: StatMetric }) {
  const Icon = STAT_ICON_MAP[metric.icon];

  return (
    <div className="dashboard-card p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center flex-shrink-0">
        {Icon && <Icon className="w-5 h-5 text-white" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[var(--text-secondary)] truncate">{metric.label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-lg font-bold text-[var(--text-primary)]">{metric.value}</p>
          <span
            className={`text-xs font-semibold ${
              metric.changeType === 'positive'
                ? 'text-[var(--success-green)]'
                : metric.changeType === 'negative'
                  ? 'text-[var(--danger-red)]'
                  : 'text-[var(--text-secondary)]'
            }`}
          >
            {metric.change}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * CreatorAnalyticsPage — The main data grid for a creator's analytics.
 *
 * Uses CSS Grid to create a responsive, masonry-like layout.
 */
export function CreatorAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Stat metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_METRICS.map((metric) => (
          <StatCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Chart grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Row 1: Viewers (span 2) + Playtime (1) */}
        <div className="lg:col-span-2">
          <Suspense fallback={<ChartSkeleton />}>
            <ViewersChart />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<ChartSkeleton />}>
            <PlaytimeDistribution />
          </Suspense>
        </div>

        {/* Row 2: Engagement (1) + Platforms (1) + Live Now (1, row-span 2) */}
        <div>
          <Suspense fallback={<ChartSkeleton />}>
            <EngagementChart />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<ChartSkeleton />}>
            <PlatformsDistribution />
          </Suspense>
        </div>
        <div className="lg:row-span-2">
          <Suspense fallback={<ChartSkeleton />}>
            <LiveNowPanel />
          </Suspense>
        </div>

        {/* Row 3: Realtime (span 2) */}
        <div className="lg:col-span-2">
          <Suspense fallback={<ChartSkeleton />}>
            <RealtimeChart />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
