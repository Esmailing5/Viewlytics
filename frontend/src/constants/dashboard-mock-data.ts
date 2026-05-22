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
