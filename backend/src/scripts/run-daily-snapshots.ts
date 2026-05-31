import { prisma } from '../lib/prisma';
import { TrackingStatus } from '@prisma/client';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

async function run() {
  console.log('[Snapshot Worker Started]');
  
  if (!YOUTUBE_API_KEY) {
    console.error('YOUTUBE_API_KEY is not configured in environment variables');
    process.exit(1);
  }

  let processed = 0;
  let created = 0;
  let skipped = 0;
  let failed = 0;

  try {
    const creators = await prisma.creator.findMany({
      where: {
        trackingStatus: TrackingStatus.tracked,
        platform: 'youtube',
      }
    });

    // Get start of today to avoid duplicate snapshots
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const creator of creators) {
      processed++;
      console.log(`[Processing Channel] ${creator.displayName} (${creator.channelId})`);
      
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
          skipped++;
          continue;
        }

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
          throw new Error(`Channel not found on YouTube for ID: ${creator.channelId}`);
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

        console.log(`[Snapshot Created] ${creator.displayName}`);
        created++;
        
      } catch (error: any) {
        console.error(`[Channel Failed] ${creator.displayName} - ${error?.message || String(error)}`);
        failed++;
      }
    }

  } catch (error: any) {
    console.error(`Fatal error in snapshot query: ${error?.message || String(error)}`);
  } finally {
    await prisma.$disconnect();
    console.log(`[Worker Completed] Processed: ${processed}, Created: ${created}, Skipped: ${skipped}, Failed: ${failed}`);
  }
}

run();
