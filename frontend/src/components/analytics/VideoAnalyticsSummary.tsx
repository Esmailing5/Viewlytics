'use client';

import { TrendingUp, ThumbsUp, MessageCircle } from 'lucide-react';

interface VideoProps {
  id: string;
  views: number;
  likes: number;
  comments: number;
}

export function VideoAnalyticsSummary({ videos }: { videos: VideoProps[] }) {
  const totalViews = videos.reduce((acc, v) => acc + v.views, 0);
  const totalLikes = videos.reduce((acc, v) => acc + v.likes, 0);
  const totalComments = videos.reduce((acc, v) => acc + v.comments, 0);
  const avgViews = videos.length > 0 ? totalViews / videos.length : 0;

  return (
    <div className="dashboard-card p-6 h-full flex flex-col">
      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6">Tracción Reciente</h3>
      <div className="space-y-6 flex-1 flex flex-col justify-center">
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent-cyan)]/10 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-[var(--accent-cyan)]" />
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Promedio Vistas (Últimos {videos.length})</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{new Intl.NumberFormat('es-ES', { notation: "compact" }).format(avgViews)}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent-blue)]/10 flex items-center justify-center flex-shrink-0">
            <ThumbsUp className="w-6 h-6 text-[var(--accent-blue)]" />
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Total Likes Recientes</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{new Intl.NumberFormat('es-ES', { notation: "compact" }).format(totalLikes)}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Total Comentarios</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{new Intl.NumberFormat('es-ES', { notation: "compact" }).format(totalComments)}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
