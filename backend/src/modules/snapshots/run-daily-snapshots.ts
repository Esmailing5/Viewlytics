import { prisma } from '../../lib/prisma';
import { TrackingStatus } from '@prisma/client';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

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

      if (existingSnapshot) {
        console.log(`[Skipped] Existing snapshot for today: ${creator.displayName}`);
        skipped++;
        continue;
      }

      console.log(`[Processing] Fetching data for: ${creator.displayName} (${creator.channelId})`);

      // 2. Fetch from YouTube Data API v3
      const url = new URL('https://www.googleapis.com/youtube/v3/channels');
      url.searchParams.append('part', 'snippet,statistics,brandingSettings');
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

      // 3. Extract metrics
      const subscribers = BigInt(statistics.subscriberCount || 0);
      const totalViews = BigInt(statistics.viewCount || 0);
      const totalVideos = parseInt(statistics.videoCount || '0', 10);
      const avgViews = totalVideos > 0 ? Number(totalViews) / totalVideos : 0;

      // 4. Extract updated profile info
      const avatarUrl = snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || creator.avatarUrl;
      const description = snippet.description || creator.description;
      const bannerUrl = brandingSettings.image?.bannerExternalUrl || creator.bannerUrl;
      const country = snippet.country || creator.country;
      
      // Verified status logic: typically 100k+ subs qualifies for verification check. 
      // YouTube Data API doesn't return the verified badge status. 
      // We will leave it as is, or mark it conditionally if you want.
      const verified = creator.verified || Number(subscribers) >= 100000;

      // 5. Database transaction (Update creator and insert snapshot)
      await prisma.$transaction([
        prisma.creatorSnapshot.create({
          data: {
            creatorId: creator.id,
            subscribers: subscribers,
            totalViews: totalViews,
            totalVideos: totalVideos,
            avgViews: avgViews,
            // engagementRate can be calculated in a separate worker or kept 0 initially
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
