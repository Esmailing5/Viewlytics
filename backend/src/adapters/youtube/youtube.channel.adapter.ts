import { YouTubeChannelDetailsResponse, FullCreatorAnalytics, ChannelMetrics } from './youtube.channel.types';
import { YouTubeChannelMapper } from './youtube.channel.mapper';
import { YouTubePlaylistItemsResponse, YouTubeVideosResponse, NormalizedVideo } from './youtube.types';

export class YouTubeChannelAdapter {
  private apiKey: string;
  private readonly BASE_URL = 'https://www.googleapis.com/youtube/v3';

  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY || '';
  }

  private async fetchChannelIdBySlug(slug: string): Promise<string | null> {
    const searchUrl = new URL(`${this.BASE_URL}/search`);
    searchUrl.searchParams.append('q', slug);
    searchUrl.searchParams.append('type', 'channel');
    searchUrl.searchParams.append('part', 'snippet');
    searchUrl.searchParams.append('maxResults', '1');
    searchUrl.searchParams.append('key', this.apiKey);

    const res = await fetch(searchUrl.toString());
    if (!res.ok) throw new Error('Failed to search channel by slug');
    const data = await res.json();
    return data.items && data.items.length > 0 ? data.items[0].snippet.channelId : null;
  }

  async getFullAnalytics(identifier: string): Promise<FullCreatorAnalytics> {
    if (!this.apiKey) {
      throw new Error('YOUTUBE_API_KEY is not configured');
    }

    try {
      let channelId = identifier;

      // Determine if identifier is a channel ID (UC...) or a slug
      if (!identifier.startsWith('UC') || identifier.length !== 24) {
        const foundId = await this.fetchChannelIdBySlug(identifier);
        if (!foundId) throw new Error(`Channel not found for slug: ${identifier}`);
        channelId = foundId;
      }

      // 1. Fetch full channel details
      const channelsUrl = new URL(`${this.BASE_URL}/channels`);
      channelsUrl.searchParams.append('id', channelId);
      channelsUrl.searchParams.append('part', 'snippet,statistics,brandingSettings,contentDetails');
      channelsUrl.searchParams.append('key', this.apiKey);

      const channelRes = await fetch(channelsUrl.toString());
      if (!channelRes.ok) throw new Error('Failed to fetch channel details');
      const channelData: YouTubeChannelDetailsResponse = await channelRes.json();

      if (!channelData.items || channelData.items.length === 0) {
        throw new Error('Channel not found in API');
      }

      const channelItem = channelData.items[0];
      const profile = YouTubeChannelMapper.toDetailedProfile(channelItem);

      const totalViews = parseInt(channelItem.statistics.viewCount || '0', 10);
      const totalVideos = parseInt(channelItem.statistics.videoCount || '0', 10);

      // 2. Fetch recent videos
      let recentVideos: NormalizedVideo[] = [];
      const uploadsPlaylistId = channelItem.contentDetails?.relatedPlaylists?.uploads;

      let avgViews = 0;
      let engagementRate = 0;
      let uploadFreq = 'N/A';

      if (uploadsPlaylistId) {
        const playlistUrl = new URL(`${this.BASE_URL}/playlistItems`);
        playlistUrl.searchParams.append('playlistId', uploadsPlaylistId);
        playlistUrl.searchParams.append('part', 'snippet');
        playlistUrl.searchParams.append('maxResults', '10');
        playlistUrl.searchParams.append('key', this.apiKey);

        const playlistRes = await fetch(playlistUrl.toString());
        if (playlistRes.ok) {
          const playlistData: YouTubePlaylistItemsResponse = await playlistRes.json();
          const videoIds = playlistData.items?.map(item => item.snippet.resourceId.videoId).join(',') || '';

          if (videoIds) {
            const videosUrl = new URL(`${this.BASE_URL}/videos`);
            videosUrl.searchParams.append('id', videoIds);
            videosUrl.searchParams.append('part', 'snippet,statistics');
            videosUrl.searchParams.append('key', this.apiKey);

            const videosRes = await fetch(videosUrl.toString());
            if (videosRes.ok) {
              const videosData: YouTubeVideosResponse = await videosRes.json();
              recentVideos = (videosData.items || []).map(video => ({
                id: video.id,
                title: video.snippet.title,
                published_at: video.snippet.publishedAt,
                thumbnail_url: video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.medium?.url || '',
                views: parseInt(video.statistics?.viewCount || '0', 10),
                likes: parseInt(video.statistics?.likeCount || '0', 10),
                comments: parseInt(video.statistics?.commentCount || '0', 10),
              }));

              // Calculate Metrics
              if (recentVideos.length > 0) {
                const totalRecentViews = recentVideos.reduce((acc, v) => acc + v.views, 0);
                const totalRecentInteractions = recentVideos.reduce((acc, v) => acc + v.likes + v.comments, 0);
                
                avgViews = totalRecentViews / recentVideos.length;
                engagementRate = totalRecentViews > 0 ? (totalRecentInteractions / totalRecentViews) * 100 : 0;

                if (recentVideos.length > 1) {
                  const newest = new Date(recentVideos[0].published_at).getTime();
                  const oldest = new Date(recentVideos[recentVideos.length - 1].published_at).getTime();
                  const diffDays = (newest - oldest) / (1000 * 3600 * 24);
                  const daysPerVideo = diffDays / (recentVideos.length - 1);
                  if (daysPerVideo <= 1) uploadFreq = 'Daily';
                  else if (daysPerVideo <= 3) uploadFreq = 'Multiple per week';
                  else if (daysPerVideo <= 7) uploadFreq = 'Weekly';
                  else if (daysPerVideo <= 14) uploadFreq = 'Bi-weekly';
                  else uploadFreq = 'Monthly+';
                }
              }
            }
          }
        }
      }

      const metrics: ChannelMetrics = {
        total_views: totalViews,
        total_videos: totalVideos,
        average_views: avgViews,
        engagement_rate: engagementRate,
        upload_frequency: uploadFreq
      };

      // Future placeholders
      const growth = {
        subscribers_30d: 0,
        views_30d: 0
      };

      return {
        profile,
        metrics,
        recentVideos, // note casing as requested by user prompt
        growth
      };

    } catch (error) {
      console.error('[YouTube Channel Adapter] Error:', error);
      throw error;
    }
  }
}
