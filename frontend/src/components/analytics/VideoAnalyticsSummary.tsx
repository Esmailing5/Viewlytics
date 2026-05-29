'use client';

import { TrendingUp, ThumbsUp, MessageCircle, Users } from 'lucide-react';

interface GrowthProps {
  views_30d: number;
  likes_30d: number;
  comments_30d: number;
  videos_30d: number;
  subscribers_30d?: number;
}

export function VideoAnalyticsSummary({ growth }: { growth?: GrowthProps }) {
  const avgViews = growth?.videos_30d && growth.videos_30d > 0 ? growth.views_30d / growth.videos_30d : 0;
  const totalLikes = growth?.likes_30d || 0;
  const totalComments = growth?.comments_30d || 0;
  const totalSubs = growth?.subscribers_30d || 0;

  return (
    <div className="vl-card-dashboard p-6 h-full flex flex-col">
      <h3 className="text-lg font-bold text-[var(--vl-text-primary)] mb-6">Impacto Reciente <span className="text-sm font-normal text-[var(--vl-text-secondary)]">(Últimos 30 Días)</span></h3>
      <div className="space-y-4 flex-1 flex flex-col justify-center">
        
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--vl-cyan-soft)] flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-[var(--vl-cyan)]" />
          </div>
          <div>
            <p className="text-sm text-[var(--vl-text-secondary)]">Promedio Vistas (en {growth?.videos_30d || 0} videos)</p>
            <p className="text-xl font-bold text-[var(--vl-text-primary)]">{new Intl.NumberFormat('es-ES', { notation: "compact" }).format(avgViews)}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--vl-red-soft)] flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-[var(--vl-red)]" />
          </div>
          <div>
            <p className="text-sm text-[var(--vl-text-secondary)]">Suscriptores (30d)</p>
            <p className="text-xl font-bold text-[var(--vl-text-primary)]">+{new Intl.NumberFormat('es-ES', { notation: "compact" }).format(totalSubs)}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--vl-purple-soft)] flex items-center justify-center flex-shrink-0">
            <ThumbsUp className="w-5 h-5 text-[var(--vl-purple)]" />
          </div>
          <div>
            <p className="text-sm text-[var(--vl-text-secondary)]">Likes (30d)</p>
            <p className="text-xl font-bold text-[var(--vl-text-primary)]">{new Intl.NumberFormat('es-ES', { notation: "compact" }).format(totalLikes)}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--vl-purple-soft)] flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-5 h-5 text-[var(--vl-purple)]" />
          </div>
          <div>
            <p className="text-sm text-[var(--vl-text-secondary)]">Comentarios (30d)</p>
            <p className="text-xl font-bold text-[var(--vl-text-primary)]">{new Intl.NumberFormat('es-ES', { notation: "compact" }).format(totalComments)}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
