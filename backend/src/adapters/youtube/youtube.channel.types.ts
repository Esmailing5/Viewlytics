export interface YouTubeChannelDetailsResponse {
  items?: Array<{
    id: string;
    snippet: {
      title: string;
      description: string;
      customUrl?: string;
      publishedAt: string;
      thumbnails: {
        default: { url: string };
        medium: { url: string };
        high: { url: string };
      };
      country?: string;
    };
    statistics: {
      viewCount: string;
      subscriberCount: string;
      hiddenSubscriberCount: boolean;
      videoCount: string;
    };
    brandingSettings?: {
      image?: {
        bannerExternalUrl?: string;
      };
      channel?: {
        country?: string;
      };
    };
    contentDetails?: {
      relatedPlaylists?: {
        uploads?: string;
      };
    };
  }>;
}

export interface DetailedCreatorProfile {
  id: string;
  platform: 'youtube' | 'twitch' | 'kick';
  channel_id: string;
  slug: string;
  display_name: string;
  description: string;
  subscribers: number;
  verified: boolean;
  avatar_url: string;
  banner_url?: string;
  created_at: string;
  country?: string;
}

export interface ChannelMetrics {
  total_views: number;
  total_videos: number;
  average_views: number;
  engagement_rate: number;
  upload_frequency: string;
}

export interface GrowthPlaceholders {
  subscribers_30d: number;
  views_30d: number;
  likes_30d: number;
  comments_30d: number;
  videos_30d: number;
  subscribers_change_pct?: number;
  views_change_pct?: number;
  videos_change_pct?: number;
  likes_change_pct?: number;
  comments_change_pct?: number;
}

export interface FullCreatorAnalytics {
  profile: DetailedCreatorProfile;
  metrics: ChannelMetrics;
  recentVideos: any[]; // We will reuse NormalizedVideo from youtube.types
  growth: GrowthPlaceholders;
  snapshots?: any[];
}
