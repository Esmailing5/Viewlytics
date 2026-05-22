import { YouTubeChannelItem, NormalizedCreator } from './youtube.types';

export class YouTubeMapper {
  /**
   * Generates a slug from a channel's custom URL or title.
   * e.g., "@MrBeast" -> "mrbeast", "MrBeast Gaming" -> "mrbeast-gaming"
   */
  static generateSlug(customUrl?: string, title?: string): string {
    if (customUrl) {
      // Remove '@' if present and lowercase
      return customUrl.replace(/^@/, '').toLowerCase().trim();
    }
    
    if (title) {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric with dash
        .replace(/(^-|-$)+/g, ''); // remove leading/trailing dashes
    }
    
    return 'unknown-channel';
  }

  /**
   * Maps a raw YouTube Channel Item to our internal NormalizedCreator structure.
   */
  static toNormalizedCreator(channel: YouTubeChannelItem): NormalizedCreator {
    const subscriberCount = parseInt(channel.statistics?.subscriberCount || '0', 10);
    
    // YouTube doesn't explicitly return a "verified" boolean in the basic search/channel endpoint.
    // Usually it requires a different check or scraping. 
    // For now, we approximate: channels > 100k subs are highly likely to be verified.
    // If you need exact verification, YouTube Data API doesn't provide it directly in snippet.
    const isVerified = subscriberCount > 100000;

    return {
      id: channel.id, // Using channel_id as the primary id for now before DB insertion
      platform: 'youtube',
      channel_id: channel.id,
      slug: this.generateSlug(channel.snippet.customUrl, channel.snippet.title),
      display_name: channel.snippet.title,
      subscribers: subscriberCount,
      verified: isVerified,
      avatar_url: channel.snippet.thumbnails?.high?.url || channel.snippet.thumbnails?.default?.url,
    };
  }
}
