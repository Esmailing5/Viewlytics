'use client';

import { Play, MessageCircle, ThumbsUp, Eye } from 'lucide-react';
import Link from 'next/link';

interface VideoProps {
  id: string;
  title: string;
  published_at: string;
  thumbnail_url: string;
  views: number;
  likes: number;
  comments: number;
}

function formatTimeAgo(dateStr: string) {
  try {
    const published = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - published.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 1) return 'Hace 1 día';
    return `Hace ${diffDays} días`;
  } catch (e) {
    return 'Hace unos días';
  }
}

export function RecentVideosCard({ videos }: { videos: VideoProps[] }) {
  if (!videos || videos.length === 0) {
    return (
      <div className="vl-card-dashboard p-6 flex items-center justify-center h-full border border-[var(--vl-border)] rounded-2xl bg-[var(--vl-bg-surface)]/60">
        <p className="text-[var(--vl-text-secondary)] font-medium">No hay videos recientes disponibles.</p>
      </div>
    );
  }

  return (
    <div className="vl-card-dashboard p-5 flex flex-col h-full border border-[var(--vl-border)] rounded-2xl bg-[var(--vl-bg-surface)]/60 backdrop-blur-md justify-between">
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-[var(--vl-text-primary)]">Últimos Videos</h3>
          <Link href="#all-videos" className="text-xs font-semibold text-[var(--vl-red)] hover:underline flex items-center gap-1">
            Ver todos ➔
          </Link>
        </div>

        <div className="space-y-3.5">
          {videos.slice(0, 3).map((video) => (
            <div 
              key={video.id} 
              className="flex gap-4 p-2.5 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300 border border-[var(--vl-border)]/40 hover:border-white/10 group cursor-pointer"
            >
              {/* Thumbnail Wrapper */}
              <div className="vl-video-thumbnail-container relative w-24 sm:w-28 h-14 sm:h-16 flex-shrink-0">
                <div className="vl-video-play-overlay">
                  <Play className="w-5 h-5 text-white fill-white scale-90 group-hover:scale-100 transition-transform duration-300" />
                </div>
                <img 
                  src={video.thumbnail_url} 
                  alt={video.title} 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                />
              </div>

              {/* Video Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <h4 className="text-xs sm:text-sm font-bold text-[var(--vl-text-primary)] line-clamp-1 leading-snug group-hover:text-[var(--vl-red)] transition-colors duration-200" title={video.title}>
                  {video.title}
                </h4>
                
                <div className="flex items-center gap-x-2.5 text-[10px] sm:text-xs text-[var(--vl-text-secondary)] font-semibold mt-1 flex-wrap">
                  <span className="flex items-center gap-0.5"><Eye className="w-3 h-3 text-[var(--vl-text-tertiary)]" /> {new Intl.NumberFormat('es-ES', { notation: "compact" }).format(video.views)}</span>
                  <span className="opacity-40">•</span>
                  <span className="flex items-center gap-0.5"><ThumbsUp className="w-3 h-3 text-[var(--vl-text-tertiary)]" /> {new Intl.NumberFormat('es-ES', { notation: "compact" }).format(video.likes)}</span>
                  <span className="opacity-40">•</span>
                  <span className="flex items-center gap-0.5"><MessageCircle className="w-3 h-3 text-[var(--vl-text-tertiary)]" /> {new Intl.NumberFormat('es-ES', { notation: "compact" }).format(video.comments)}</span>
                  <span className="opacity-40">•</span>
                  <span className="text-[var(--vl-text-tertiary)]">{formatTimeAgo(video.published_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full py-2.5 mt-4 text-xs font-bold text-[var(--vl-text-secondary)] hover:text-white bg-white/[0.02] border border-[var(--vl-border)] rounded-xl hover:bg-white/[0.05] transition-all duration-300">
        Ver más videos
      </button>
    </div>
  );
}
