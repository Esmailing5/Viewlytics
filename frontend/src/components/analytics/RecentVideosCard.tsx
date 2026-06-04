'use client';

import { Play, MessageCircle, ThumbsUp, Eye } from 'lucide-react';

interface VideoProps {
  id: string;
  title: string;
  published_at: string;
  thumbnail_url: string;
  views: number;
  likes: number;
  comments: number;
  is_long?: boolean;
  live_broadcast_content?: string;
  duration_seconds?: number;
}

const MONTHS: Record<string, string> = {
  '01': 'Ene', '02': 'Feb', '03': 'Mar', '04': 'Abr', '05': 'May', '06': 'Jun',
  '07': 'Jul', '08': 'Ago', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dic'
};

function formatRealDate(dateStr: string) {
  try {
    const datePart = dateStr.split('T')[0];
    const [year, month, day] = datePart.split('-');
    const monthName = MONTHS[month] || month;
    return `${day} ${monthName} ${year}`;
  } catch (e) {
    return dateStr;
  }
}

function formatDuration(seconds?: number) {
  if (!seconds) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  if (h > 0) {
    return `${h}:${pad(m)}:${pad(s)}`;
  }
  return `${m}:${pad(s)}`;
}

export function RecentVideosCard({ videos }: { videos: VideoProps[] }) {
  if (!videos || videos.length === 0) {
    return (
      <div className="vl-card-dashboard p-5 flex items-center justify-center h-full border border-[var(--vl-border)] rounded-2xl bg-[var(--vl-bg-surface)]/60">
        <p className="text-[var(--vl-text-secondary)] font-medium">No hay videos recientes disponibles.</p>
      </div>
    );
  }

  const displayedVideos = videos.filter(v => v.is_long === true).slice(0, 4);

  return (
    <div className="vl-card-dashboard p-5 flex flex-col h-full border border-[var(--vl-border)] rounded-2xl bg-[var(--vl-bg-surface)]/60 backdrop-blur-md justify-between">
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-[var(--vl-text-primary)]">Últimos Videos</h3>
        </div>

        <div className="space-y-2">
          {displayedVideos.map((video) => {
            return (
              <div 
                key={video.id} 
                className="flex gap-4 p-1.5 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300 border border-[var(--vl-border)]/40 hover:border-white/10 group cursor-pointer"
              >
                {/* Thumbnail Wrapper */}
                <a 
                  href={`https://www.youtube.com/watch?v=${video.id}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="vl-video-thumbnail-container relative w-24 sm:w-28 h-14 sm:h-16 flex-shrink-0 overflow-hidden rounded-lg block"
                >
                  <div className="vl-video-play-overlay">
                    <Play className="w-5 h-5 text-white fill-white scale-90 group-hover:scale-100 transition-transform duration-300" />
                  </div>
                  {video.live_broadcast_content === 'live' && (
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 text-[9px] font-black bg-[var(--vl-red)] text-white rounded uppercase tracking-wider select-none z-10 animate-pulse">
                      EN VIVO
                    </span>
                  )}
                  {video.duration_seconds && video.duration_seconds > 0 ? (
                    <span className="absolute bottom-1 right-1 px-1 py-0.5 text-[10px] font-semibold bg-black/75 text-white rounded select-none z-10">
                      {formatDuration(video.duration_seconds)}
                    </span>
                  ) : null}
                  <img 
                    src={video.thumbnail_url} 
                    alt={video.title} 
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                  />
                </a>

                {/* Video Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <a 
                    href={`https://www.youtube.com/watch?v=${video.id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <h4 className="text-xs sm:text-sm font-bold text-[var(--vl-text-primary)] line-clamp-1 leading-snug group-hover:text-[var(--vl-red)] transition-colors duration-200" title={video.title}>
                      {video.title}
                    </h4>
                  </a>
                  
                  <div className="flex items-center gap-x-2.5 text-[10px] sm:text-xs text-[var(--vl-text-secondary)] font-semibold mt-1 flex-wrap">
                    <span className="flex items-center gap-0.5"><Eye className="w-3 h-3 text-[var(--vl-text-tertiary)]" /> {new Intl.NumberFormat('es-ES', { notation: "compact" }).format(video.views)}</span>
                    <span className="opacity-40">•</span>
                    <span className="flex items-center gap-0.5"><ThumbsUp className="w-3 h-3 text-[var(--vl-text-tertiary)]" /> {new Intl.NumberFormat('es-ES', { notation: "compact" }).format(video.likes)}</span>
                    <span className="opacity-40">•</span>
                    <span className="flex items-center gap-0.5"><MessageCircle className="w-3 h-3 text-[var(--vl-text-tertiary)]" /> {new Intl.NumberFormat('es-ES', { notation: "compact" }).format(video.comments)}</span>
                    <span className="opacity-40">•</span>
                    <span className="text-[var(--vl-text-tertiary)]">{formatRealDate(video.published_at)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
