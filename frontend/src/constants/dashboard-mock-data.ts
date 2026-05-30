/**
 * Viewlytics — Dashboard Mock Data (Phase 1.5)
 *
 * Realistic mock data for all 6 dashboard cards.
 * Typed interfaces for each data shape — no `any` types.
 *
 * @see config/dashboard.ts — Card configurations
 */

// ---------------------------------------------------------------------------
// VIEWERS CHART DATA — 30-day viewer counts
// ---------------------------------------------------------------------------

export interface ViewerDataPoint {
  readonly date: string;
  readonly viewers: number;
  readonly uniqueViewers: number;
}

export const VIEWERS_DATA: ViewerDataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2026, 4, i + 1);
  const base = 12000 + Math.sin(i * 0.3) * 4000 + i * 200;
  const unique = base * 0.72 + Math.random() * 1000;
  return {
    date: date.toISOString().split('T')[0],
    viewers: Math.round(base + Math.random() * 2000),
    uniqueViewers: Math.round(unique),
  };
});

// ---------------------------------------------------------------------------
// PLAYTIME DISTRIBUTION — Platform percentages
// ---------------------------------------------------------------------------

export interface PlaytimeSegment {
  readonly name: string;
  readonly value: number;
  readonly color: string;
}

export const PLAYTIME_DATA: PlaytimeSegment[] = [
  { name: 'Twitch', value: 42, color: '#9146FF' },
  { name: 'YouTube', value: 35, color: '#FF0000' },
  { name: 'Kick', value: 15, color: '#53FC18' },
  { name: 'TikTok', value: 8, color: '#00F2EA' },
];

// ---------------------------------------------------------------------------
// ENGAGEMENT CHART — Category breakdown
// ---------------------------------------------------------------------------

export interface EngagementCategory {
  readonly category: string;
  readonly value: number;
  readonly fill: string;
}

export const ENGAGEMENT_DATA: EngagementCategory[] = [
  { category: 'Likes', value: 84200, fill: 'url(#engGrad1)' },
  { category: 'Comments', value: 32100, fill: 'url(#engGrad2)' },
  { category: 'Shares', value: 18700, fill: 'url(#engGrad3)' },
  { category: 'Watch Time', value: 126400, fill: 'url(#engGrad4)' },
  { category: 'Clips', value: 9300, fill: 'url(#engGrad5)' },
];

// ---------------------------------------------------------------------------
// PLATFORMS DISTRIBUTION — Donut chart
// ---------------------------------------------------------------------------

export interface PlatformSegment {
  readonly name: string;
  readonly value: number;
  readonly color: string;
}

export const PLATFORMS_DATA: PlatformSegment[] = [
  { name: 'YouTube', value: 1420000, color: '#FF0000' },
  { name: 'Twitch', value: 890000, color: '#9146FF' },
  { name: 'Kick', value: 340000, color: '#53FC18' },
  { name: 'TikTok', value: 210000, color: '#00F2EA' },
];

// ---------------------------------------------------------------------------
// LIVE NOW — Active streamers
// ---------------------------------------------------------------------------

export interface LiveCreator {
  readonly id: string;
  readonly name: string;
  readonly platform: 'youtube' | 'twitch' | 'kick' | 'tiktok';
  readonly viewers: number;
  readonly category: string;
  readonly avatarInitials: string;
}

export const LIVE_CREATORS: LiveCreator[] = [
  {
    id: 'live-01',
    name: 'El Circo Podcast',
    platform: 'youtube',
    viewers: 14200,
    category: 'Just Chatting',
    avatarInitials: 'EC',
  },
  {
    id: 'live-02',
    name: 'StreamersRD',
    platform: 'twitch',
    viewers: 8900,
    category: 'Gaming',
    avatarInitials: 'SR',
  },
  {
    id: 'live-03',
    name: 'Manny Viloria',
    platform: 'youtube',
    viewers: 6700,
    category: 'Podcast',
    avatarInitials: 'MV',
  },
  {
    id: 'live-04',
    name: 'RD Gamers',
    platform: 'kick',
    viewers: 3200,
    category: 'Fortnite',
    avatarInitials: 'RG',
  },
  {
    id: 'live-05',
    name: 'Nidea Reynoso',
    platform: 'twitch',
    viewers: 2100,
    category: 'IRL',
    avatarInitials: 'NR',
  },
  {
    id: 'live-06',
    name: 'El Pachá',
    platform: 'youtube',
    viewers: 1800,
    category: 'Entertainment',
    avatarInitials: 'EP',
  },
];

// ---------------------------------------------------------------------------
// REALTIME DATA — 60-minute analytics
// ---------------------------------------------------------------------------

export interface RealtimeDataPoint {
  readonly time: string;
  readonly value: number;
}

export const REALTIME_DATA: RealtimeDataPoint[] = Array.from({ length: 60 }, (_, i) => {
  const minutes = 60 - i;
  const base = 5000 + Math.sin(i * 0.15) * 2000;
  return {
    time: `${minutes}m`,
    value: Math.round(base + Math.random() * 1500),
  };
}).reverse();

// ---------------------------------------------------------------------------
// STAT CARDS — Summary metrics
// ---------------------------------------------------------------------------

export interface StatMetric {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly change: string;
  readonly changeType: 'positive' | 'negative' | 'neutral';
  readonly icon: string;
}

export const STAT_METRICS: StatMetric[] = [
  {
    id: 'total-viewers',
    label: 'Total Viewers',
    value: '2.86M',
    change: '+12.4%',
    changeType: 'positive',
    icon: 'Eye',
  },
  {
    id: 'avg-watch-time',
    label: 'Avg. Watch Time',
    value: '24m 30s',
    change: '+3.2%',
    changeType: 'positive',
    icon: 'Clock',
  },
  {
    id: 'active-creators',
    label: 'Active Creators',
    value: '1,247',
    change: '+8.7%',
    changeType: 'positive',
    icon: 'Users',
  },
  {
    id: 'engagement-rate',
    label: 'Engagement Rate',
    value: '6.8%',
    change: '-0.3%',
    changeType: 'negative',
    icon: 'TrendingUp',
  },
];

// ---------------------------------------------------------------------------
// TRENDING & RANKINGS (Phase 1.5)
// ---------------------------------------------------------------------------

export interface TrendingCreator {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly platform: 'youtube' | 'twitch' | 'kick';
  readonly avatarInitials: string;
  readonly growth: string;
  readonly viewers: string;
}

export const TRENDING_CREATORS: TrendingCreator[] = [
  { id: 't1', name: 'Alofoke Radio Show', slug: 'alofoke-radio-show', platform: 'youtube', avatarInitials: 'AR', growth: '+24%', viewers: '85.4K' },
  { id: 't2', name: 'El Dotol Nastra', slug: 'el-dotol-nastra', platform: 'youtube', avatarInitials: 'DN', growth: '+18%', viewers: '42.1K' },
  { id: 't3', name: 'Capricornio TV', slug: 'capricornio-tv', platform: 'youtube', avatarInitials: 'CT', growth: '+15%', viewers: '38.9K' },
  { id: 't4', name: 'Mata Lluvia', slug: 'mata-lluvia', platform: 'twitch', avatarInitials: 'ML', growth: '+32%', viewers: '12.5K' },
  { id: 't5', name: 'Jessica en Punto', slug: 'jessica-en-punto', platform: 'youtube', avatarInitials: 'JP', growth: '+11%', viewers: '28.3K' },
  { id: 't6', name: 'Sin Filtro', slug: 'sin-filtro', platform: 'youtube', avatarInitials: 'SF', growth: '+9%', viewers: '22.1K' },
];

export interface RankingEntry {
  readonly rank: number;
  readonly creatorName: string;
  readonly slug: string;
  readonly platform: 'youtube' | 'twitch' | 'kick';
  readonly avatarInitials: string;
  readonly category: string;
  readonly subscribers: number;
  readonly views_30d: number;
  readonly videos_30d: number;
  readonly growth: string;
}

export const FEATURED_RANKINGS: RankingEntry[] = [
  { rank: 1, creatorName: 'Alofoke Radio Show', slug: 'alofoke-radio-show', platform: 'youtube', avatarInitials: 'AR', category: 'Podcast', subscribers: 9100000, views_30d: 880000, videos_30d: 4, growth: '+12%' },
  { rank: 2, creatorName: 'Carlos Durán', slug: 'carlos-duran', platform: 'youtube', avatarInitials: 'CD', category: 'Entertainment', subscribers: 4800000, views_30d: 640000, videos_30d: 4, growth: '+8%' },
  { rank: 3, creatorName: 'Capricornio TV', slug: 'capricornio-tv', platform: 'youtube', avatarInitials: 'CT', category: 'Interviews', subscribers: 3100000, views_30d: 480000, videos_30d: 4, growth: '+15%' },
  { rank: 4, creatorName: 'El Dotol Nastra', slug: 'el-dotol-nastra', platform: 'youtube', avatarInitials: 'DN', category: 'Podcast', subscribers: 2400000, views_30d: 400000, videos_30d: 4, growth: '+10%' },
  { rank: 5, creatorName: 'Mata Lluvia', slug: 'mata-lluvia', platform: 'twitch', avatarInitials: 'ML', category: 'Gaming', subscribers: 850000, views_30d: 150000, videos_30d: 3, growth: '+25%' },
];
