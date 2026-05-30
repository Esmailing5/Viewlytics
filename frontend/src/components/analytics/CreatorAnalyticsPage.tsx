'use client';

import { Suspense, lazy, useEffect, useState, useMemo } from 'react';
import { Eye, Clock, Users, PlaySquare, TrendingUp, Sparkles, Share2, Star, Check } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Lazy-loaded chart components for performance
const EstimatedIncomeChart = lazy(() =>
  import('./EstimatedIncomeChart').then((m) => ({
    default: m.EstimatedIncomeChart,
  }))
);
import { RecentVideosCard } from './RecentVideosCard';
import { VideoAnalyticsSummary } from './VideoAnalyticsSummary';

/** Icon map for stat cards */
const STAT_ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Eye,
  Clock,
  Users,
  Youtube: PlaySquare,
};

/** Loading skeleton for chart cards */
function ChartSkeleton() {
  return (
    <div className="vl-card-dashboard p-6 vl-animate-shimmer min-h-[300px]">
      <div className="h-4 w-24 bg-[var(--vl-border)] rounded mb-4" />
      <div className="h-[200px] bg-[var(--vl-border)] rounded-xl opacity-30" />
    </div>
  );
}

interface StatCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metric: any;
  platform: string;
}

/** Stat metric card matching IMAGE B styling */
function StatCard({ metric, platform }: StatCardProps) {
  const Icon = STAT_ICON_MAP[metric.icon] || TrendingUp;

  // Colors based on platform
  const iconColorClass = {
    youtube: 'text-red-500 bg-red-500/10 border-red-500/20',
    twitch: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    kick: 'text-green-500 bg-green-500/10 border-green-500/20'
  }[platform.toLowerCase()] || 'text-[var(--vl-red)] bg-[var(--vl-red-soft)]';

  const badgeColorClass = {
    youtube: 'bg-red-500/10 text-red-500 border-red-500/20',
    twitch: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    kick: 'bg-green-500/10 text-green-500 border-green-500/20'
  }[platform.toLowerCase()] || 'bg-[var(--vl-bg-primary)] text-[var(--vl-text-secondary)] border-[var(--vl-border)]';

  return (
    <div className="vl-metric-card-interactive border border-[var(--vl-border)]/55 rounded-xl flex items-start justify-between gap-3 p-4 bg-[var(--vl-bg-surface)]/40 backdrop-blur-md">
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider">
          {metric.label}
        </p>
        <p className="text-2xl font-black text-[var(--vl-text-primary)] tracking-tight mt-1.5 leading-none">
          {metric.value}
        </p>
        {metric.id === 'platform' ? (
          <div className="mt-3 flex">
            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold border ${badgeColorClass} tracking-wider`}>
              {platform.toUpperCase()} PARTNER
            </span>
          </div>
        ) : (
          metric.change && (
            <p className="text-[10px] font-bold text-[var(--vl-success)] mt-3 flex items-center gap-1.5 flex-wrap">
              <span>{metric.change}</span>
              <span className="text-[var(--vl-text-tertiary)] font-medium">vs 30 días anteriores</span>
            </p>
          )
        )}
      </div>
      
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0 ${iconColorClass}`}>
        {Icon && <Icon className="w-4.5 h-4.5" />}
      </div>
    </div>
  );
}

export function CreatorAnalyticsPage({
  platform,
  channelId,
}: {
  platform: string;
  channelId: string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const response = await fetch(
          `${apiUrl}/api/channel/${platform}/${channelId}`
        );
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

  // Create dual growth charts mock data based on channel metrics to match IMAGE B
  const growthChartsData = useMemo(() => {
    if (!data) return { subsData: [], viewsData: [] };
    
    const subsBase = data.profile?.subscribers || 9100000;
    const viewsBase = data.metrics?.total_views || 3014000000;
    
    // Generate dates: 15 abr, 22 abr, 29 abr, 6 may, 13 may, 20 may, 28 may
    const dates = ['15 abr', '22 abr', '29 abr', '6 may', '13 may', '20 may', '28 may'];
    
    // Custom curves matching image graphs
    const subFactors = [0.963, 0.971, 0.978, 0.976, 0.988, 0.986, 1.0];
    const viewFactors = [0.25, 0.35, 0.33, 0.42, 0.4, 0.65, 0.58]; // views30d scale spikes
    
    const subsData = dates.map((date, i) => ({
      date,
      value: Math.round(subsBase * subFactors[i] / 1000000 * 100) / 100 // format as e.g. 9.06M
    }));

    const viewsData = dates.map((date, i) => ({
      date,
      value: Math.round(viewsBase * 0.05 + viewFactors[i] * 180000000)
    }));

    return { subsData, viewsData };
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-10 h-10 rounded-full border-4 border-[var(--vl-red)] border-t-transparent vl-animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 vl-card-dashboard border-[var(--vl-danger)]/25 bg-[var(--vl-danger-soft)]/20 rounded-2xl">
        <h3 className="text-[var(--vl-danger)] text-lg font-bold mb-2">
          Error cargando analytics
        </h3>
        <p className="text-[var(--vl-text-secondary)] font-medium">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  // Platform styling ring class
  const activeRingClass = {
    youtube: 'vl-avatar-ring-youtube',
    twitch: 'vl-avatar-ring-twitch',
    kick: 'vl-avatar-ring-kick'
  }[platform.toLowerCase()] || '';

  const activeBadgeBg = {
    youtube: 'bg-red-500/10 text-red-500 border-red-500/20',
    twitch: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    kick: 'bg-green-500/10 text-green-500 border-green-500/20'
  }[platform.toLowerCase()] || 'bg-[var(--vl-bg-primary)] text-[var(--vl-text-secondary)] border-[var(--vl-border)]';

  // Dynamic stat metrics formatting matching IMAGE B
  const dynamicMetrics = [
    {
      id: 'subscribers',
      label: 'Suscriptores',
      value: new Intl.NumberFormat('es-ES', { notation: 'compact' }).format(
        data.profile?.subscribers || 0
      ),
      change: '↑ 1.7%',
      icon: 'Users',
    },
    {
      id: 'total_views',
      label: 'Vistas Totales',
      value: new Intl.NumberFormat('es-ES', { notation: 'compact' }).format(
        data.metrics?.total_views || 0
      ),
      change: '↑ 8.4%',
      icon: 'Eye',
    },
    {
      id: 'total_videos',
      label: 'Videos Totales',
      value: new Intl.NumberFormat('es-ES', { notation: 'standard' }).format(
        data.metrics?.total_videos || 0
      ),
      change: '↑ 2',
      icon: 'Clock',
    },
    {
      id: 'platform',
      label: 'Plataforma',
      value: data.platform.toUpperCase(),
      icon: data.platform === 'youtube' ? 'Youtube' : 'TrendingUp',
    },
  ];

  return (
    <div className="space-y-6 px-4 sm:px-0">
      {/* ── Premium Banner Header ── */}
      <div className="relative">
        <div className="vl-dashboard-banner h-auto min-h-[340px] sm:h-[350px] flex items-end">
          {/* Banner Overlays */}
          <div className="vl-dashboard-banner-overlay" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-black/80 z-1" />

          {data.profile?.banner_url ? (
            <img
              src={data.profile.banner_url}
              alt="Banner"
              className="absolute inset-0 w-full h-full object-cover opacity-50 sm:opacity-75"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[var(--vl-bg-primary)] via-[var(--vl-bg-surface)] to-[var(--vl-bg-primary)]" />
          )}

          {/* Desktop/Tablet Profile details */}
          <div className="relative w-full p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 z-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              {data.profile?.avatar_url && (
                <img
                  src={data.profile.avatar_url}
                  alt={data.profile.display_name}
                  className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-[var(--vl-bg-surface)] object-cover shadow-2xl shrink-0 ${activeRingClass}`}
                />
              )}
              <div className="sm:mb-2 min-w-0">
                <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white drop-shadow-md tracking-tight">
                    {data.profile?.display_name || 'Analytics'}
                  </h1>
                  {data.profile?.verified && (
                    <span
                      className="text-white bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow"
                      title="Verified"
                    >
                      ✓
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-gray-300 mt-2.5 font-semibold">
                  <span className="uppercase">{platform}</span>
                  <span className="opacity-40">•</span>
                  <span>
                    {new Intl.NumberFormat('es-ES', { notation: 'compact' }).format(
                      data.profile?.subscribers || 0
                    )}{' '}
                    Subs ▾
                  </span>
                  <span className="opacity-40">•</span>
                  <span className="flex items-center gap-1">
                    República Dominicana 🇩🇴
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons (Compartir / Favorite) */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('¡Enlace de canal copiado al portapapeles!');
                }}
                className="vl-header-btn"
              >
                <Share2 className="w-4 h-4 text-white/95" />
                <span>Compartir</span>
              </button>
              <button 
                onClick={() => setIsFavorited(!isFavorited)}
                className={`vl-header-btn vl-header-btn-icon ${isFavorited ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-500' : ''}`}
              >
                <Star className={`w-4 h-4 ${isFavorited ? 'fill-yellow-500' : 'text-white/95'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI Cards Redesign ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {dynamicMetrics.map((metric) => (
          <StatCard key={metric.id} metric={metric} platform={platform} />
        ))}
      </div>

      {/* ── Dual Growth Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Subscriber Growth Chart */}
        <div className="vl-card-dashboard p-5 border border-[var(--vl-border)] rounded-2xl bg-[var(--vl-bg-surface)]/60 backdrop-blur-md">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-sm font-bold text-[var(--vl-text-secondary)]">Crecimiento de Suscriptores</h3>
              <p className="text-2xl font-black text-[var(--vl-text-primary)] mt-1">+150K</p>
              <p className="text-[10px] text-[var(--vl-text-tertiary)] uppercase tracking-wider font-semibold mt-0.5">Nuevos suscriptores</p>
            </div>
            <span className="text-xs font-bold text-[var(--vl-success)] bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
              ↑ 12.4% <span className="text-[var(--vl-text-secondary)] font-medium text-[10px]">vs 30 días</span>
            </span>
          </div>

          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthChartsData.subsData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--vl-warning)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--vl-warning)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#667085', fontSize: 10 }}
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#667085', fontSize: 10 }}
                  tickFormatter={(val) => `${val}M`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="vl-chart-tooltip text-xs">
                          <p className="text-[var(--vl-text-tertiary)] uppercase tracking-wider font-bold mb-0.5">{label}</p>
                          <p className="font-extrabold text-[var(--vl-text-primary)]">Subs: <span className="text-amber-500">{payload[0].value}M</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--vl-warning)" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorSubs)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* View Growth Chart */}
        <div className="vl-card-dashboard p-5 border border-[var(--vl-border)] rounded-2xl bg-[var(--vl-bg-surface)]/60 backdrop-blur-md">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-sm font-bold text-[var(--vl-text-secondary)]">Vistas Totales</h3>
              <p className="text-2xl font-black text-[var(--vl-text-primary)] mt-1">+412M</p>
              <p className="text-[10px] text-[var(--vl-text-tertiary)] uppercase tracking-wider font-semibold mt-0.5">Nuevas vistas</p>
            </div>
            <span className="text-xs font-bold text-[var(--vl-success)] bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
              ↑ 9.3% <span className="text-[var(--vl-text-secondary)] font-medium text-[10px]">vs 30 días</span>
            </span>
          </div>

          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthChartsData.viewsData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--vl-red)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--vl-red)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#667085', fontSize: 10 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#667085', fontSize: 10 }}
                  tickFormatter={(val) => `${new Intl.NumberFormat('es-ES', { notation: "compact" }).format(val)}`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="vl-chart-tooltip text-xs">
                          <p className="text-[var(--vl-text-tertiary)] uppercase tracking-wider font-bold mb-0.5">{label}</p>
                          <p className="font-extrabold text-[var(--vl-text-primary)]">Vistas: <span className="text-red-500">{new Intl.NumberFormat('es-ES', { notation: "compact" }).format(payload[0].value as number)}</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--vl-red)" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Latest Videos & Recent Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Row 3: Recent Videos (span 2) + Video Analytics Summary (span 1) */}
        <div className="lg:col-span-2 min-h-[420px] flex flex-col">
          <RecentVideosCard videos={data.recentVideos || []} />
        </div>
        <div className="min-h-[420px] flex flex-col">
          <VideoAnalyticsSummary growth={data.growth} />
        </div>

        {/* Row 4: Estimated Income Chart (span 3) */}
        <div className="lg:col-span-3 min-h-[500px] flex flex-col">
          <Suspense fallback={<ChartSkeleton />}>
            <EstimatedIncomeChart
              growth={data.growth}
              recentVideos={data.recentVideos}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
