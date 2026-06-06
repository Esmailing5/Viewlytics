'use client';

import { Suspense, lazy, useEffect, useState, useMemo } from 'react';
import { Eye, Clock, Users, PlaySquare, TrendingUp, Sparkles, Share2, Star, Check } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

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
    <div className="vl-metric-card-interactive border border-[var(--vl-border)]/55 bg-[var(--vl-bg-surface)]/40 backdrop-blur-md">
      <div className="flex-1 min-w-0">
        <p className="vl-metric-label">
          {metric.label}
        </p>
        <p className="vl-metric-value truncate">
          {metric.value}
        </p>
        {metric.id === 'platform' ? (
          <div className="vl-platform-badge-container">
            <span className={`vl-platform-badge border ${badgeColorClass}`}>
              {platform.toUpperCase()} PARTNER
            </span>
          </div>
        ) : (
          metric.change && (
            <p className="vl-metric-comparison">
              <span className="text-[var(--vl-success)]">{metric.change}</span>
              <span className="text-[var(--vl-text-tertiary)] font-medium">vs 30d</span>
            </p>
          )
        )}
      </div>
      
      <div className={`vl-metric-icon-container ${iconColorClass}`}>
        {Icon && <Icon className="w-full h-full" />}
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
  // Create dual growth charts mock data based on channel snapshots to match DB records
  const growthChartsData = useMemo(() => {
    if (!data) return { subsData: [], viewsData: [], subsChangePercent: 'Datos insuficientes', subsChangeAbsolute: '—', viewsChangePercent: 'Datos insuficientes', viewsChangeAbsolute: '—' };

    let subsData: Array<{ date: string; value: number }> = [];
    let subsChangePercent = 'Datos insuficientes';
    let subsChangeAbsolute = '—';

    let viewsData: Array<{ date: string; value: number }> = [];
    let viewsChangePercent = 'Datos insuficientes';
    let viewsChangeAbsolute = '—';

    if (data.snapshots && data.snapshots.length >= 2) {
      const firstSubs = data.snapshots[0].subscribers;
      const lastSubs = data.snapshots[data.snapshots.length - 1].subscribers;
      const diff = lastSubs - firstSubs;
      subsChangeAbsolute = diff >= 0 ? `+${new Intl.NumberFormat('es-ES', { notation: 'compact' }).format(diff)}` : `${new Intl.NumberFormat('es-ES', { notation: 'compact' }).format(diff)}`;
      
      const pct = firstSubs > 0 ? (diff / firstSubs) * 100 : 0;
      subsChangePercent = `${pct >= 0 ? '↑' : '↓'} ${Math.abs(pct).toFixed(1)}%`;

      const firstViews = data.snapshots[0].totalViews;
      const lastViews = data.snapshots[data.snapshots.length - 1].totalViews;
      const diffViews = lastViews - firstViews;
      viewsChangeAbsolute = diffViews >= 0 ? `+${new Intl.NumberFormat('es-ES', { notation: 'compact' }).format(diffViews)}` : `${new Intl.NumberFormat('es-ES', { notation: 'compact' }).format(diffViews)}`;
      
      const pctViews = firstViews > 0 ? (diffViews / firstViews) * 100 : 0;
      viewsChangePercent = `${pctViews >= 0 ? '↑' : '↓'} ${Math.abs(pctViews).toFixed(1)}%`;
    }

    if (data.snapshots && data.snapshots.length >= 2) {
      // 1. Process Subscribers
      subsData = data.snapshots.map((s: any) => {
        const dateObj = new Date(s.snapshotDate);
        const formattedDate = dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
        return {
          date: formattedDate,
          value: Math.round((s.subscribers / 1000000) * 100) / 100 // format as e.g. 9.06M
        };
      });

      // 2. Process Views
      viewsData = data.snapshots.map((s: any) => {
        const dateObj = new Date(s.snapshotDate);
        const formattedDate = dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
        return {
          date: formattedDate,
          value: s.totalViews
        };
      });
    }

    return { subsData, viewsData, subsChangePercent, subsChangeAbsolute, viewsChangePercent, viewsChangeAbsolute };
  }, [data]);

  const recentViewsChartData = useMemo(() => {
    if (!data || !data.recentVideos) return [];

    const chartData = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const dateLabel = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });

      const videosOnDay = data.recentVideos.filter((v: any) => {
        const pubDate = v.published_at || v.publishedAt;
        return pubDate && pubDate.startsWith(dateKey);
      });

      const longViewsSum = videosOnDay
        .filter((v: any) => v.is_long || v.isLong)
        .reduce((acc: number, v: any) => acc + (v.views || 0), 0);

      const shortViewsSum = videosOnDay
        .filter((v: any) => !(v.is_long || v.isLong))
        .reduce((acc: number, v: any) => acc + (v.views || 0), 0);

      chartData.push({
        date: dateLabel,
        longViews: longViewsSum,
        shortViews: shortViewsSum,
      });
    }

    return chartData;
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
      change: data.growth?.subscribers_change_pct !== undefined 
        ? `${data.growth.subscribers_change_pct >= 0 ? '↑' : '↓'} ${Math.abs(data.growth.subscribers_change_pct)}%`
        : '—',
      icon: 'Users',
    },
    {
      id: 'total_views',
      label: 'Vistas Totales',
      value: new Intl.NumberFormat('es-ES', { notation: 'compact' }).format(
        data.metrics?.total_views || 0
      ),
      change: data.growth?.views_change_pct !== undefined 
        ? `${data.growth.views_change_pct >= 0 ? '↑' : '↓'} ${Math.abs(data.growth.views_change_pct)}%`
        : '—',
      icon: 'Eye',
    },
    {
      id: 'total_videos',
      label: 'Videos Totales',
      value: new Intl.NumberFormat('es-ES', { notation: 'standard' }).format(
        data.metrics?.total_videos || 0
      ),
      change: data.growth?.videos_change_pct !== undefined 
        ? `${data.growth.videos_change_pct >= 0 ? '↑' : '↓'} ${Math.abs(data.growth.videos_change_pct)}%`
        : '—',
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 z-1" />

          {data.profile?.banner_url ? (
            <img
              src={data.profile.banner_url}
              alt="Banner"
              className="absolute inset-0 w-full h-full object-cover opacity-85 sm:opacity-90"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[var(--vl-bg-primary)] via-[var(--vl-bg-surface)] to-[var(--vl-bg-primary)]" />
          )}

          {/* Desktop/Tablet Profile details */}
          <div className="relative w-full p-4 sm:p-8 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 z-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              {data.profile?.avatar_url && (
                <img
                  src={data.profile.avatar_url}
                  alt={data.profile.display_name}
                  className={`w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-[var(--vl-bg-surface)] object-cover shadow-2xl shrink-0 ${activeRingClass}`}
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
                
                <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-300 mt-2.5 font-semibold flex-wrap">
                  <span className="uppercase whitespace-nowrap">{platform}</span>
                  <span className="opacity-40">•</span>
                  <span className="whitespace-nowrap">
                    {new Intl.NumberFormat('es-ES', { notation: 'compact' }).format(
                      data.profile?.subscribers || 0
                    )}{' '}
                    Subs ▾
                  </span>
                  <span className="opacity-40">•</span>
                  <span className="flex items-center gap-1 whitespace-nowrap">
                    República Dominicana 🇩🇴
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {dynamicMetrics.map((metric) => (
          <StatCard key={metric.id} metric={metric} platform={platform} />
        ))}
      </div>

      {/* ── Dual Growth Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Subscriber Growth Chart */}
        <div className="vl-card-dashboard p-4 md:p-5 border border-[var(--vl-border)] rounded-2xl bg-[var(--vl-bg-surface)]/60 backdrop-blur-md overflow-hidden">
          <div className="flex justify-between items-start mb-4 md:mb-6 gap-2">
            <div className="min-w-0">
              <h3 className="text-xs md:text-sm font-bold text-[var(--vl-text-secondary)]">Crecimiento de Suscriptores</h3>
              <p className="text-xl md:text-2xl font-black text-[var(--vl-text-primary)] mt-1">{growthChartsData.subsChangeAbsolute}</p>
              <p className="text-[10px] text-[var(--vl-text-tertiary)] uppercase tracking-wider font-semibold mt-0.5">Nuevos suscriptores</p>
            </div>
            <span className="text-[10px] md:text-xs font-bold text-[var(--vl-success)] bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 whitespace-nowrap shrink-0">
              {growthChartsData.subsChangePercent} <span className="text-[var(--vl-text-secondary)] font-medium text-[9px] md:text-[10px]">vs 30d</span>
            </span>
          </div>

          <div className="h-[220px] w-full">
            {data.snapshots && data.snapshots.length >= 2 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthChartsData.subsData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--vl-warning)" stopOpacity={0.18}/>
                      <stop offset="95%" stopColor="var(--vl-warning)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(255,255,255,0.02)" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#667085', fontSize: 9, fontWeight: 600 }}
                  />
                  <YAxis 
                    domain={['auto', 'auto']}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#667085', fontSize: 9, fontWeight: 600 }}
                    tickFormatter={(val) => `${val}M`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#0b0c10]/90 backdrop-blur-md border border-white/[0.08] rounded-xl px-3.5 py-2.5 shadow-2xl">
                            <p className="text-[var(--vl-text-tertiary)] font-bold text-[9px] uppercase tracking-wider mb-0.5">{label}</p>
                            <p className="font-extrabold text-[var(--vl-text-primary)] text-sm tracking-tight">Subs: <span className="text-amber-500">{payload[0].value}M</span></p>
                          </div>
                        );
                      }
                      return null;
                    }}
                    cursor={{ stroke: 'rgba(255, 255, 255, 0.08)', strokeWidth: 1, strokeDasharray: '3 3' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="var(--vl-warning)" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorSubs)" 
                    dot={false}
                    activeDot={{ r: 4.5, fill: 'var(--vl-warning)', stroke: '#06070A', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center border border-dashed border-[var(--vl-border)] rounded-xl bg-white/[0.01]">
                <p className="text-xs font-semibold text-[var(--vl-text-tertiary)] uppercase tracking-wider">Recolectando historial</p>
              </div>
            )}
          </div>
        </div>

        {/* View Growth Chart */}
        <div className="vl-card-dashboard p-5 border border-[var(--vl-border)] rounded-2xl bg-[var(--vl-bg-surface)]/60 backdrop-blur-md">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-sm font-bold text-[var(--vl-text-secondary)]">Impacto Total · últimos 30 días</h3>
              <p className="text-2xl font-black text-[var(--vl-text-primary)] mt-1">
                {new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(data.growth?.total_views_30d || 0)} Views
              </p>
            </div>
          </div>

          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recentViewsChartData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                <defs>
                  <linearGradient id="rgbBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0052FF" />
                    <stop offset="100%" stopColor="#002299" />
                  </linearGradient>
                  <linearGradient id="rgbCyan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00FFFF" />
                    <stop offset="100%" stopColor="#00A3B8" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(255,255,255,0.02)" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#667085', fontSize: 9, fontWeight: 600 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#667085', fontSize: 9, fontWeight: 600 }}
                  tickFormatter={(val) => `${new Intl.NumberFormat('en-US', { notation: "compact" }).format(val)}`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const longVal = payload.find((p: any) => p.dataKey === 'longViews')?.value || 0;
                      const shortVal = payload.find((p: any) => p.dataKey === 'shortViews')?.value || 0;
                      return (
                        <div className="bg-[#0b0c10]/90 backdrop-blur-md border border-white/[0.08] rounded-xl px-3.5 py-2.5 shadow-2xl">
                          <p className="text-[var(--vl-text-tertiary)] font-bold text-[9px] uppercase tracking-wider mb-1">{label}</p>
                          <p className="font-extrabold text-[var(--vl-text-primary)] text-xs tracking-tight">
                            Videos largos: <span className="text-[#0052FF]">{new Intl.NumberFormat('en-US', { notation: "compact" }).format(longVal as number)}</span>
                          </p>
                          <p className="font-extrabold text-[var(--vl-text-primary)] text-xs tracking-tight mt-0.5">
                            Shorts: <span className="text-[#00FFFF]">{new Intl.NumberFormat('en-US', { notation: "compact" }).format(shortVal as number)}</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                />
                <Bar dataKey="longViews" stackId="a" fill="url(#rgbBlue)" name="Videos largos" />
                <Bar dataKey="shortViews" stackId="a" fill="url(#rgbCyan)" name="Shorts" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Bottom Legend */}
          <div className="flex items-center gap-6 mt-4 pl-2 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0052FF]" />
              <span className="text-[var(--vl-text-secondary)]">Videos largos</span>
              <span className="text-[var(--vl-text-primary)] font-bold">
                {new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(data.growth?.views_30d || 0)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00FFFF]" />
              <span className="text-[var(--vl-text-secondary)]">Shorts</span>
              <span className="text-[var(--vl-text-primary)] font-bold">
                {new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(data.growth?.shorts_views_30d || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Videos & Recent Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* Row 3: Recent Videos (span 2) + Video Analytics Summary (span 1) */}
        <div className="lg:col-span-2 min-h-[420px] flex flex-col">
          <RecentVideosCard videos={data.recentVideos?.filter((v: any) => v.is_long || v.isLong) || []} />
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
