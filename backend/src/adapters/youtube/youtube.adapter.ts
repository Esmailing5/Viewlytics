import { YouTubeSearchResponse, YouTubeChannelResponse, NormalizedCreator, CreatorAnalyticsData, YouTubePlaylistItemsResponse, YouTubeVideosResponse, NormalizedVideo } from './youtube.types';
import { YouTubeMapper } from './youtube.mapper';

export class YouTubeAdapter {
  private apiKey: string;
  private readonly BASE_URL = 'https://www.googleapis.com/youtube/v3';

  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY || '';
  }

  /**
   * Main search function. Follows a 2-step process to get complete data:
   * 1. /search: To find channels matching the query (does not return subscriber counts).
   * 2. /channels: To get the full statistics (subscribers, views) for those channel IDs.
   */
  async searchChannels(query: string): Promise<NormalizedCreator[]> {
    if (!this.apiKey) {
      throw new Error('YOUTUBE_API_KEY is not configured in the environment.');
    }

    try {
      console.log(`[YouTube Adapter] Searching for: "${query}"`);
      
      // Step 1: Search for channels
      const searchUrl = new URL(`${this.BASE_URL}/search`);
      searchUrl.searchParams.append('q', query);
      searchUrl.searchParams.append('type', 'channel');
      searchUrl.searchParams.append('part', 'snippet');
      searchUrl.searchParams.append('maxResults', '5');
      searchUrl.searchParams.append('key', this.apiKey);

      const searchRes = await fetch(searchUrl.toString());
      if (!searchRes.ok) {
        const errorData = await searchRes.json();
        throw new Error(`YouTube Search API Error: ${errorData.error?.message || searchRes.statusText}`);
      }

      const searchData: YouTubeSearchResponse = await searchRes.json();
      
      if (!searchData.items || searchData.items.length === 0) {
        return [];
      }

      // Extract channel IDs from search results
      const channelIds = searchData.items.map(item => item.snippet.channelId).join(',');

      // Step 2: Fetch detailed statistics for those channels
      const channelsUrl = new URL(`${this.BASE_URL}/channels`);
      channelsUrl.searchParams.append('id', channelIds);
      channelsUrl.searchParams.append('part', 'snippet,statistics,brandingSettings');
      channelsUrl.searchParams.append('key', this.apiKey);

      const channelsRes = await fetch(channelsUrl.toString());
      if (!channelsRes.ok) {
        const errorData = await channelsRes.json();
        throw new Error(`YouTube Channels API Error: ${errorData.error?.message || channelsRes.statusText}`);
      }

      const channelsData: YouTubeChannelResponse = await channelsRes.json();

      if (!channelsData.items) {
        return [];
      }

      // Map the raw YouTube data to our internal NormalizedCreator structure
      const normalizedResults = channelsData.items.map(channel => 
        YouTubeMapper.toNormalizedCreator(channel)
      );

      // Sort results by subscribers (highest first) as an additional helpful step
      normalizedResults.sort((a, b) => b.subscribers - a.subscribers);

      return normalizedResults;

    } catch (error) {
      console.error('[YouTube Adapter] Error during search:', error);
      throw error;
    }
  }

  /**
   * Fetch detailed analytics for a specific creator including recent videos.
   */
  async getCreatorAnalytics(channelId: string): Promise<CreatorAnalyticsData> {
    if (!this.apiKey) {
      throw new Error('YOUTUBE_API_KEY is not configured in the environment.');
    }

    try {
      // 1. Fetch channel details
      const channelsUrl = new URL(`${this.BASE_URL}/channels`);
      channelsUrl.searchParams.append('id', channelId);
      channelsUrl.searchParams.append('part', 'snippet,statistics,contentDetails');
      channelsUrl.searchParams.append('key', this.apiKey);

      const channelRes = await fetch(channelsUrl.toString());
      if (!channelRes.ok) throw new Error('Failed to fetch channel details');
      const channelData: any = await channelRes.json();
      
      if (!channelData.items || channelData.items.length === 0) {
        throw new Error('Channel not found');
      }

      const channel = channelData.items[0];
      const profile = YouTubeMapper.toNormalizedCreator(channel);
      
      const metrics = {
        total_views: parseInt(channel.statistics?.viewCount || '0', 10),
        total_videos: parseInt(channel.statistics?.videoCount || '0', 10),
      };

      // 2. Fetch recent videos (from the uploads playlist)
      const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;
      let recent_videos: NormalizedVideo[] = [];

      if (uploadsPlaylistId) {
        const playlistUrl = new URL(`${this.BASE_URL}/playlistItems`);
        playlistUrl.searchParams.append('playlistId', uploadsPlaylistId);
        playlistUrl.searchParams.append('part', 'snippet');
        playlistUrl.searchParams.append('maxResults', '6'); // Get 6 recent videos
        playlistUrl.searchParams.append('key', this.apiKey);

        const playlistRes = await fetch(playlistUrl.toString());
        if (playlistRes.ok) {
          const playlistData: YouTubePlaylistItemsResponse = await playlistRes.json();
          const videoIds = playlistData.items?.map(item => item.snippet.resourceId.videoId).join(',') || '';

          if (videoIds) {
            // 3. Fetch video statistics
            const videosUrl = new URL(`${this.BASE_URL}/videos`);
            videosUrl.searchParams.append('id', videoIds);
            videosUrl.searchParams.append('part', 'snippet,statistics');
            videosUrl.searchParams.append('key', this.apiKey);

            const videosRes = await fetch(videosUrl.toString());
            if (videosRes.ok) {
              const videosData: YouTubeVideosResponse = await videosRes.json();
              recent_videos = (videosData.items || []).map(video => ({
                id: video.id,
                title: video.snippet.title,
                published_at: video.snippet.publishedAt,
                thumbnail_url: video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.medium?.url || '',
                views: parseInt(video.statistics?.viewCount || '0', 10),
                likes: parseInt(video.statistics?.likeCount || '0', 10),
                comments: parseInt(video.statistics?.commentCount || '0', 10),
              }));
            }
          }
        }
      }

      return {
        profile,
        metrics,
        recent_videos
      };

    } catch (error) {
      console.error('[YouTube Adapter] Error fetching creator analytics:', error);
      throw error;
    }
  }
}
