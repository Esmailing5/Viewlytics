// Placeholder YouTube Adapter

export interface NormalizedCreator {
  id: string;
  platform: 'youtube' | 'twitch' | 'kick';
  channel_id: string;
  slug: string;
  display_name: string;
  subscribers: number;
  verified: boolean;
  avatar_url?: string;
}

export class YouTubeAdapter {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY || '';
  }

  async searchChannels(query: string): Promise<NormalizedCreator[]> {
    console.log(`[YouTube Adapter] Searching for: ${query}`);
    // Mock for now until API key is verified
    return [
      {
        id: 'mock-uuid',
        platform: 'youtube',
        channel_id: 'UCX6OQ3DkcsbYNE6H8uQQuVA',
        slug: 'mock-channel',
        display_name: `YouTube Result: ${query}`,
        subscribers: 1500000,
        verified: true,
        avatar_url: 'https://via.placeholder.com/150'
      }
    ];
  }
}
