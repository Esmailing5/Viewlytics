'use client';

import { Suspense, lazy, useEffect, useState } from 'react';
import { Eye, Clock, Users, PlaySquare } from 'lucide-react';

// Lazy-loaded chart components for performance
const EstimatedIncomeChart = lazy(() => import('./EstimatedIncomeChart').then((m) => ({ default: m.EstimatedIncomeChart })));
import { RecentVideosCard } from './RecentVideosCard';
import { VideoAnalyticsSummary } from './VideoAnalyticsSummary';

/** Icon map for stat cards */
const STAT_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Eye,
  Clock,
  Users,
  Youtube: PlaySquare,
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      } catch (err) {
        setError((err as Error).message);
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

  if (!data) return null;

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
      icon: data.platform === 'youtube' ? 'Youtube' : 'TrendingUp',
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Visual Header */}
      <div className="relative mb-8 sm:mb-0">
        {/* Banner Image */}
        <div className="relative w-full h-32 sm:h-72 rounded-t-2xl sm:rounded-2xl overflow-hidden bg-[var(--bg-surface)] border border-[var(--border-color)]">
          {data.profile?.banner_url ? (
            <img src={data.profile.banner_url} alt="Banner" className="absolute inset-0 w-full h-full object-cover sm:opacity-70" />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[var(--bg-main)] to-[var(--bg-surface)]" />
          )}
          <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          
          {/* Desktop Overlay Content */}
          <div className="hidden sm:flex absolute bottom-0 left-0 w-full p-6 items-end gap-6">
            {data.profile?.avatar_url && (
              <img src={data.profile.avatar_url} alt={data.profile.display_name} className="w-24 h-24 rounded-full border-4 border-[var(--bg-surface)] object-cover shadow-xl shrink-0" />
            )}
            <div className="mb-2 flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-white drop-shadow-md flex items-center gap-2 flex-wrap">
                <span className="truncate">{data.profile?.display_name || 'Analytics'}</span>
                {data.profile?.verified && (
                  <span className="text-[var(--accent-blue)] bg-white rounded-full w-5 h-5 flex items-center justify-center text-sm shrink-0" title="Verified">✓</span>
                )}
              </h1>
              <p className="text-gray-200 text-sm mt-1">
                {data.platform.toUpperCase()} • {new Intl.NumberFormat('es-ES', { notation: "compact" }).format(data.profile?.subscribers || 0)} Subs
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Content (Below Banner) */}
        <div className="sm:hidden px-4 relative z-10 flex flex-col items-center text-center -mt-10">
          {data.profile?.avatar_url && (
            <img src={data.profile.avatar_url} alt={data.profile.display_name} className="w-20 h-20 rounded-full border-4 border-[var(--bg-main)] object-cover shadow-lg mb-2" />
          )}
          <h1 className="text-xl font-bold text-[var(--text-primary)] flex items-center justify-center gap-1 flex-wrap">
            {data.profile?.display_name || 'Analytics'}
            {data.profile?.verified && (
              <span className="text-[var(--accent-blue)] bg-[var(--bg-surface)] rounded-full w-4 h-4 flex items-center justify-center text-xs shrink-0" title="Verified">✓</span>
            )}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-0.5">
            {data.platform.toUpperCase()} • {new Intl.NumberFormat('es-ES', { notation: "compact" }).format(data.profile?.subscribers || 0)} Subs
          </p>
        </div>
      </div>

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
          <VideoAnalyticsSummary growth={data.growth} />
        </div>

        {/* Row 2: Estimated Income Chart (span 3) */}
        <div className="lg:col-span-3 min-h-[500px] flex flex-col">
          <Suspense fallback={<ChartSkeleton />}>
            <EstimatedIncomeChart growth={data.growth} recentVideos={data.recentVideos} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
