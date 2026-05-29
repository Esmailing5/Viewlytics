'use client';

import { Play, MessageCircle, ThumbsUp } from 'lucide-react';

interface VideoProps {
  id: string;
  title: string;
  published_at: string;
  thumbnail_url: string;
  views: number;
  likes: number;
  comments: number;
}

export function RecentVideosCard({ videos }: { videos: VideoProps[] }) {
  if (!videos || videos.length === 0) {
    return (
      <div className="vl-card-dashboard p-6 flex items-center justify-center h-full">
        <p className="text-[var(--vl-text-secondary)]">No hay videos recientes disponibles.</p>
      </div>
    );
  }

  return (
    <div className="vl-card-dashboard p-6 flex flex-col h-full">
      <h3 className="text-lg font-bold text-[var(--vl-text-primary)] mb-4">Últimos Videos</h3>
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {videos.slice(0, 20).map((video) => (
          <div key={video.id} className="flex gap-4 p-3 rounded-xl hover:bg-[var(--vl-bg-primary)] vl-transition-fast border border-transparent hover:border-[var(--vl-border)] group cursor-pointer">
            <div className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--vl-bg-primary)]">
              <img src={video.thumbnail_url} alt={video.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <h4 className="text-sm font-semibold text-[var(--vl-text-primary)] line-clamp-2" title={video.title}>
                {video.title}
              </h4>
              <div className="flex items-center gap-3 text-xs text-[var(--vl-text-secondary)]">
                <span className="flex items-center gap-1"><Play className="w-3 h-3" /> {new Intl.NumberFormat('es-ES', { notation: "compact" }).format(video.views)}</span>
                <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {new Intl.NumberFormat('es-ES', { notation: "compact" }).format(video.likes)}</span>
                <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {new Intl.NumberFormat('es-ES', { notation: "compact" }).format(video.comments)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
