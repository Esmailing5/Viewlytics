import { classifyVideo } from './video-classifier';

export interface Video {
  duration?: string;
  liveBroadcastContent?: string;
  views: number | bigint;
}

export interface ImpactResult {
  viewsVideos30d: bigint;
  viewsShorts30d: bigint;
  impactTotal30d: bigint;
  videos30d: number;
  shorts30d: number;
}

/**
 * Calculates creator impact metrics from a list of videos published in the last 30 days.
 * This function is pure and can be tested without a database connection.
 * 
 * @param videos List of videos from the creator within the last 30 days.
 * @returns ImpactResult or null if there are no valid (non-upcoming) videos.
 */
export function calculateCreatorImpact(videos: Video[]): ImpactResult | null {
  const validVideos = videos.filter(video => {
    const { isUpcoming } = classifyVideo({
      duration: video.duration,
      liveBroadcastContent: video.liveBroadcastContent,
    });
    // Las transmisiones activas ('live') no se excluyen como upcoming.
    return !isUpcoming;
  });

  if (validVideos.length === 0) {
    return null;
  }

  let viewsVideos30d = 0n;
  let viewsShorts30d = 0n;
  let videos30d = 0;
  let shorts30d = 0;

  for (const video of validVideos) {
    const { isLong } = classifyVideo({
      duration: video.duration,
      liveBroadcastContent: video.liveBroadcastContent,
    });

    const views = BigInt(video.views);

    // Los videos en vivo se clasifican automáticamente como largos (isLong = true)
    if (isLong) {
      viewsVideos30d += views;
      videos30d += 1;
    } else {
      viewsShorts30d += views;
      shorts30d += 1;
    }
  }

  return {
    viewsVideos30d,
    viewsShorts30d,
    impactTotal30d: viewsVideos30d + viewsShorts30d,
    videos30d,
    shorts30d,
  };
}
