export function parseIsoDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

export interface VideoClassificationInput {
  duration?: string;
  liveBroadcastContent?: string;
}

export function classifyVideo(video: VideoClassificationInput): {
  isUpcoming: boolean;
  isLong: boolean;
} {
  // Exclusión de Upcoming: Solo videos que están programados como 'upcoming'.
  // Las transmisiones activas ('live') con duración 'P0D' NO se consideran upcoming.
  const isUpcoming = video.liveBroadcastContent === 'upcoming';
  
  const duration = parseIsoDuration(video.duration || '');
  
  // Un video es largo si su duración es > 65 segundos o si es una transmisión en vivo activa.
  const isLive = video.liveBroadcastContent === 'live';
  const isLong = duration > 65 || isLive;
  
  return { isUpcoming, isLong };
}
