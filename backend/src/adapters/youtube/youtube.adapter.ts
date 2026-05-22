import { YouTubeSearchResponse, YouTubeChannelResponse, NormalizedCreator } from './youtube.types';
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
}
