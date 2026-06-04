import { prisma } from '../../lib/prisma';
import { TrackingStatus } from '@prisma/client';
import { calculateCreatorImpact } from '../../services/impactCalculator';
import { CreatorImpactRepository } from '../../repositories/creator-impact.repository';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

/**
 * Helper to fetch a channel's videos from the uploads playlist published in the last 30 days.
 */
async function fetchRecentVideos(uploadsPlaylistId: string, apiKey: string): Promise<any[]> {
  const BASE_URL = 'https://www.googleapis.com/youtube/v3';
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  let nextPageToken = '';
  let keepFetching = true;
  let pageCount = 0;
  const MAX_PAGES = 10;
  const allVideos: any[] = [];

  while (keepFetching && pageCount < MAX_PAGES) {
    pageCount++;
    const playlistUrl = new URL(`${BASE_URL}/playlistItems`);
    playlistUrl.searchParams.append('playlistId', uploadsPlaylistId);
    playlistUrl.searchParams.append('part', 'snippet');
    playlistUrl.searchParams.append('maxResults', '50');
    if (nextPageToken) playlistUrl.searchParams.append('pageToken', nextPageToken);
    playlistUrl.searchParams.append('key', apiKey);

    const playlistRes = await fetch(playlistUrl.toString());
    if (!playlistRes.ok) break;

    const playlistData = await playlistRes.json();
    nextPageToken = playlistData.nextPageToken || '';

    const videoIds = playlistData.items?.map((item: any) => item.snippet.resourceId.videoId).join(',') || '';
    if (!videoIds) break;

    const videosUrl = new URL(`${BASE_URL}/videos`);
    videosUrl.searchParams.append('id', videoIds);
    videosUrl.searchParams.append('part', 'snippet,statistics,contentDetails');
    videosUrl.searchParams.append('key', apiKey);

    const videosRes = await fetch(videosUrl.toString());
    if (!videosRes.ok) break;

    const videosData = await videosRes.json();
    const pageVideos = (videosData.items || []).map((video: any) => ({
      id: video.id,
      publishedAt: video.snippet.publishedAt,
      views: parseInt(video.statistics?.viewCount || '0', 10),
      duration: video.contentDetails?.duration,
      liveBroadcastContent: video.snippet?.liveBroadcastContent,
    }));

    allVideos.push(...pageVideos);

    if (playlistData.items && playlistData.items.length > 0) {
      const lastItemDate = new Date(playlistData.items[playlistData.items.length - 1].snippet.publishedAt).getTime();
      if (lastItemDate < thirtyDaysAgo) {
        keepFetching = false;
      }
    }

    if (!nextPageToken) keepFetching = false;
  }

  // Filter exact 30d videos (except for active livestreams, which are always included)
  return allVideos.filter(v => {
    if (v.liveBroadcastContent === 'live') {
      return true;
    }
    return new Date(v.publishedAt).getTime() >= thirtyDaysAgo;
  });
}

export async function runDailySnapshots() {
  console.log('Starting Daily Snapshot Engine...');
  
  if (!YOUTUBE_API_KEY) {
    throw new Error('YOUTUBE_API_KEY is not configured in environment variables');
  }

  const creators = await prisma.creator.findMany({
    where: {
      trackingStatus: TrackingStatus.tracked,
      platform: 'youtube',
    }
  });

  console.log(`Found ${creators.length} creators to process.`);

  let processed = 0;
  let created = 0;
  let skipped = 0;
  let failed = 0;

  // Get start of today to avoid duplicates
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const creator of creators) {
    processed++;
    try {
      // 1. Check if a snapshot for today already exists
      const existingSnapshot = await prisma.creatorSnapshot.findFirst({
        where: {
          creatorId: creator.id,
          snapshotDate: {
            gte: today,
          }
        }
      });

      console.log(`[Processing] Fetching data for: ${creator.displayName} (${creator.channelId})`);

      // 2. Fetch from YouTube Data API v3 (including contentDetails to get uploads playlist ID)
      const url = new URL('https://www.googleapis.com/youtube/v3/channels');
      url.searchParams.append('part', 'snippet,statistics,brandingSettings,contentDetails');
      url.searchParams.append('id', creator.channelId);
      url.searchParams.append('key', YOUTUBE_API_KEY);

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        console.error(`[Failed] Channel not found on YouTube: ${creator.channelId}`);
        failed++;
        continue;
      }

      const channel = data.items[0];
      const snippet = channel.snippet || {};
      const statistics = channel.statistics || {};
      const brandingSettings = channel.brandingSettings || {};
      const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;

      // 3. Conditional Snapshot creation (skip if it already exists)
      if (existingSnapshot) {
        console.log(`[Skipped] Existing snapshot for today: ${creator.displayName}`);
        skipped++;
      } else {
        // Extract metrics
        const subscribers = BigInt(statistics.subscriberCount || 0);
        const totalViews = BigInt(statistics.viewCount || 0);
        const totalVideos = parseInt(statistics.videoCount || '0', 10);
        const avgViews = totalVideos > 0 ? Number(totalViews) / totalVideos : 0;

        // Extract updated profile info
        const avatarUrl = snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || creator.avatarUrl;
        const description = snippet.description || creator.description;
        const bannerUrl = brandingSettings.image?.bannerExternalUrl || creator.bannerUrl;
        const country = snippet.country || creator.country;
        const verified = creator.verified || Number(subscribers) >= 100000;

        // Database transaction (Update creator and insert snapshot)
        await prisma.$transaction([
          prisma.creatorSnapshot.create({
            data: {
              creatorId: creator.id,
              subscribers: subscribers,
              totalViews: totalViews,
              totalVideos: totalVideos,
              avgViews: avgViews,
            }
          }),
          prisma.creator.update({
            where: { id: creator.id },
            data: {
              avatarUrl,
              description,
              bannerUrl,
              country,
              verified
            }
          })
        ]);

        console.log(`[Created] Snapshot for: ${creator.displayName}`);
        created++;
      }

      // 6. Calculate and persist CreatorImpact (runs in its own try-catch block to prevent breaking the snapshot flow)
      try {
        let impactResult = null;
        if (uploadsPlaylistId) {
          const recentVideos = await fetchRecentVideos(uploadsPlaylistId, YOUTUBE_API_KEY);
          impactResult = calculateCreatorImpact(recentVideos);
        }

        if (impactResult) {
          const now = new Date();
          const snapshotDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

          try {
            await CreatorImpactRepository.upsertImpact(creator.id, snapshotDate, impactResult);
            console.log(`[Created] CreatorImpact for: ${creator.displayName}`);
          } catch (err) {
            console.warn(`[Retry] First attempt failed for creator ${creator.displayName} (${creator.id}). Retrying in 2 seconds... Error: ${err instanceof Error ? err.message : String(err)}`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            try {
              await CreatorImpactRepository.upsertImpact(creator.id, snapshotDate, impactResult);
              console.log(`[Created/Retry] CreatorImpact for: ${creator.displayName} on retry`);
            } catch (retryErr) {
              console.error(`[Error] Upsert failed on retry for creator ${creator.displayName} (${creator.id}):`, retryErr);
            }
          }
        } else {
          console.log(`[Skipped] Sin videos en 30 días, skipping CreatorImpact for: ${creator.displayName}`);
        }
      } catch (impactErr) {
        console.error(`[Error] Failed CreatorImpact flow for creator ${creator.displayName} (${creator.id}):`, impactErr);
      }
      
    } catch (error) {
      console.error(`[Failed] YouTube API Error for ${creator.displayName}:`, error instanceof Error ? error.message : String(error));
      failed++;
    }
  }

  console.log(`Daily Snapshot Engine finished. Processed: ${processed}, Created: ${created}, Skipped: ${skipped}, Failed: ${failed}`);
  
  return {
    totalProcessed: processed,
    snapshotsCreated: created,
    skipped: skipped,
    failed: failed
  };
}
