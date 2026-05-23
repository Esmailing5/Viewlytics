import { YouTubeChannelDetailsResponse, FullCreatorAnalytics, ChannelMetrics } from './youtube.channel.types';
import { YouTubeChannelMapper } from './youtube.channel.mapper';
import { YouTubePlaylistItemsResponse, YouTubeVideosResponse, NormalizedVideo } from './youtube.types';

function parseIsoDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

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

      // 30d metrics
      let views30d = 0;
      let likes30d = 0;
      let comments30d = 0;
      let videos30dCount = 0;

      if (uploadsPlaylistId) {
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        let nextPageToken = '';
        let keepFetching = true;
        let pageCount = 0;
        const MAX_PAGES = 10; // safety limit to prevent infinite loops (max 500 videos/month)

        while (keepFetching && pageCount < MAX_PAGES) {
          pageCount++;
          const playlistUrl = new URL(`${this.BASE_URL}/playlistItems`);
          playlistUrl.searchParams.append('playlistId', uploadsPlaylistId);
          playlistUrl.searchParams.append('part', 'snippet');
          playlistUrl.searchParams.append('maxResults', '50');
          if (nextPageToken) playlistUrl.searchParams.append('pageToken', nextPageToken);
          playlistUrl.searchParams.append('key', this.apiKey);

          const playlistRes = await fetch(playlistUrl.toString());
          if (!playlistRes.ok) break;
          
          const playlistData = await playlistRes.json();
          nextPageToken = playlistData.nextPageToken || '';
          
          const videoIds = playlistData.items?.map((item: any) => item.snippet.resourceId.videoId).join(',') || '';
          if (!videoIds) break;

          const videosUrl = new URL(`${this.BASE_URL}/videos`);
          videosUrl.searchParams.append('id', videoIds);
          videosUrl.searchParams.append('part', 'snippet,statistics,contentDetails');
          videosUrl.searchParams.append('key', this.apiKey);

          const videosRes = await fetch(videosUrl.toString());
          if (!videosRes.ok) break;

          const videosData: any = await videosRes.json();
          
          const pageVideos = (videosData.items || [])
            .filter((video: any) => {
              const duration = parseIsoDuration(video.contentDetails?.duration || '');
              const isLive = video.snippet?.liveBroadcastContent === 'live';
              return duration > 65 || isLive;
            })
            .map((video: any) => ({
              id: video.id,
              title: video.snippet.title,
              published_at: video.snippet.publishedAt,
              thumbnail_url: video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.medium?.url || '',
              views: parseInt(video.statistics?.viewCount || '0', 10),
              likes: parseInt(video.statistics?.likeCount || '0', 10),
              comments: parseInt(video.statistics?.commentCount || '0', 10),
            }));

          recentVideos.push(...pageVideos);

          // Check if we hit videos older than 30 days
          if (playlistData.items && playlistData.items.length > 0) {
            const lastItemDate = new Date(playlistData.items[playlistData.items.length - 1].snippet.publishedAt).getTime();
            if (lastItemDate < thirtyDaysAgo) {
              keepFetching = false;
            }
          }

          if (!nextPageToken) keepFetching = false;
        }

        // Filter exact 30d videos
        const videos30d = recentVideos.filter(v => new Date(v.published_at).getTime() >= thirtyDaysAgo);
        
        videos30dCount = videos30d.length;
        views30d = videos30d.reduce((acc, v) => acc + v.views, 0);
        likes30d = videos30d.reduce((acc, v) => acc + v.likes, 0);
        comments30d = videos30d.reduce((acc, v) => acc + v.comments, 0);

        // Calculate Metrics based exclusively on 30d videos
        if (videos30d.length > 0) {
          avgViews = views30d / videos30d.length;
          const total30dInteractions = likes30d + comments30d;
          engagementRate = views30d > 0 ? (total30dInteractions / views30d) * 100 : 0;

          if (videos30d.length > 1) {
            const newest = new Date(videos30d[0].published_at).getTime();
            const oldest = new Date(videos30d[videos30d.length - 1].published_at).getTime();
            const diffDays = (newest - oldest) / (1000 * 3600 * 24);
            const daysPerVideo = diffDays / (videos30d.length - 1);
            if (daysPerVideo <= 1) uploadFreq = 'Daily';
            else if (daysPerVideo <= 3) uploadFreq = 'Multiple per week';
            else if (daysPerVideo <= 7) uploadFreq = 'Weekly';
            else if (daysPerVideo <= 14) uploadFreq = 'Bi-weekly';
            else uploadFreq = 'Monthly+';
          }
        }
        
        // Output exactly what was published in the last 30 days
        recentVideos = videos30d;
      }

      const metrics: ChannelMetrics = {
        total_views: totalViews,
        total_videos: totalVideos,
        average_views: avgViews,
        engagement_rate: engagementRate,
        upload_frequency: uploadFreq
      };

      const growth = {
        subscribers_30d: Math.floor(views30d * 0.002), // Conservative estimate: 2 subs per 1000 views
        views_30d: views30d,
        likes_30d: likes30d,
        comments_30d: comments30d,
        videos_30d: videos30dCount
      };

      return {
        profile,
        metrics,
        recentVideos: recentVideos.slice(0, 10), // only return top 10 to frontend to save bandwidth
        growth
      };

    } catch (error) {
      console.error('[YouTube Channel Adapter] Error:', error);
      throw error;
    }
  }
}
