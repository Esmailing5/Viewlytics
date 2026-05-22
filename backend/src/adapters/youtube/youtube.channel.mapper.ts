import { YouTubeChannelDetailsResponse, DetailedCreatorProfile } from './youtube.channel.types';
import { YouTubeMapper } from './youtube.mapper';

export class YouTubeChannelMapper {
  static toDetailedProfile(channel: NonNullable<YouTubeChannelDetailsResponse['items']>[0]): DetailedCreatorProfile {
    const subscriberCount = parseInt(channel.statistics.subscriberCount || '0', 10);
    const isVerified = subscriberCount > 100000;

    return {
      id: channel.id,
      platform: 'youtube',
      channel_id: channel.id,
      slug: YouTubeMapper.generateSlug(channel.snippet.customUrl, channel.snippet.title),
      display_name: channel.snippet.title,
      description: channel.snippet.description || '',
      subscribers: subscriberCount,
      verified: isVerified,
      avatar_url: channel.snippet.thumbnails.high?.url || channel.snippet.thumbnails.default.url,
      banner_url: channel.brandingSettings?.image?.bannerExternalUrl,
      created_at: channel.snippet.publishedAt,
      country: channel.snippet.country || channel.brandingSettings?.channel?.country
    };
  }
}
