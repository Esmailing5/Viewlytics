'use client';

import { Suspense, lazy, useEffect, useState } from 'react';
import { Eye, Clock, Users, TrendingUp } from 'lucide-react';

// Lazy-loaded chart components for performance
const ViewersChart = lazy(() => import('./ViewersChart').then((m) => ({ default: m.ViewersChart })));
const RealtimeChart = lazy(() => import('./RealtimeChart').then((m) => ({ default: m.RealtimeChart })));
import { RecentVideosCard } from './RecentVideosCard';
import { VideoAnalyticsSummary } from './VideoAnalyticsSummary';

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
function StatCard({ metric }: { metric: any }) {
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
        </div>
      </div>
    </div>
  );
}

export function CreatorAnalyticsPage({ platform, channelId }: { platform: string; channelId: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const response = await fetch(`${apiUrl}/api/channel/${platform}/${channelId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        const json = await response.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [platform, channelId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-4 border-[var(--accent-blue)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 dashboard-card border-red-500/20 bg-red-500/5">
        <h3 className="text-red-500 font-bold mb-2">Error cargando analytics</h3>
        <p className="text-[var(--text-secondary)]">{error}</p>
      </div>
    );
  }

  // Transform backend data into the 4 stat cards format
  const dynamicMetrics = [
    {
      id: 'subscribers',
      label: 'Suscriptores',
      value: new Intl.NumberFormat('es-ES', { notation: "compact" }).format(data.profile?.subscribers || 0),
      icon: 'Users',
    },
    {
      id: 'total_views',
      label: 'Vistas Totales',
      value: new Intl.NumberFormat('es-ES', { notation: "compact" }).format(data.metrics?.total_views || 0),
      icon: 'Eye',
    },
    {
      id: 'total_videos',
      label: 'Videos Totales',
      value: new Intl.NumberFormat('es-ES', { notation: "standard" }).format(data.metrics?.total_videos || 0),
      icon: 'Clock',
    },
    {
      id: 'platform',
      label: 'Plataforma',
      value: data.platform.toUpperCase(),
      icon: 'TrendingUp',
    }
  ];

  return (
    <div className="space-y-6">
      {/* Dynamic Stat metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {dynamicMetrics.map((metric) => (
          <StatCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Chart grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Row 1: Recent Videos (span 2) + Video Analytics Summary (span 1) */}
        <div className="lg:col-span-2 h-[400px]">
          <RecentVideosCard videos={data.recentVideos || []} />
        </div>
        <div className="h-[400px]">
          <VideoAnalyticsSummary videos={data.recentVideos || []} />
        </div>

        {/* Row 2: Viewers Chart (span 3) */}
        <div className="lg:col-span-3">
          <Suspense fallback={<ChartSkeleton />}>
            <ViewersChart />
          </Suspense>
        </div>

        {/* Row 3: Realtime (span 3) */}
        <div className="lg:col-span-3">
          <Suspense fallback={<ChartSkeleton />}>
            <RealtimeChart />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
