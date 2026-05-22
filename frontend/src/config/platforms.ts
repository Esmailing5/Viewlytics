/**
 * Viewlytics — Platform Configuration
 *
 * Config-driven data for supported platforms (YouTube, Twitch, Kick, etc.)
 */

export const platformsConfig = {
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    domain: 'youtube.com',
    iconColor: '#FF0000',
    metrics: ['Subscribers', 'Views', 'Videos'],
  },
  twitch: {
    id: 'twitch',
    name: 'Twitch',
    domain: 'twitch.tv',
    iconColor: '#9146FF',
    metrics: ['Followers', 'Live Viewers', 'Hours Watched'],
  },
  kick: {
    id: 'kick',
    name: 'Kick',
    domain: 'kick.com',
    iconColor: '#53FC18',
    metrics: ['Followers', 'Live Viewers', 'Streams'],
  },
} as const;

export type PlatformId = keyof typeof platformsConfig;
