'use client';

import {
  TrendingUp,
  ThumbsUp,
  MessageCircle,
  Users,
  Activity,
  Eye,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface GrowthProps {
  views_30d: number;
  likes_30d: number;
  comments_30d: number;
  videos_30d: number;
  subscribers_30d?: number;
  subscribers_change_pct?: number;
  views_change_pct?: number;
  videos_change_pct?: number;
  likes_change_pct?: number;
  comments_change_pct?: number;
}

export function VideoAnalyticsSummary({ growth }: { growth?: GrowthProps }) {
  const avgViews =
    growth?.videos_30d && growth.videos_30d > 0
      ? growth.views_30d / growth.videos_30d
      : 0;
  const totalLikes = growth?.likes_30d || 0;
  const totalComments = growth?.comments_30d || 0;
  const totalSubs = growth?.subscribers_30d || 0;

  const metrics = [
    {
      label: 'Views 30 días',
      value: new Intl.NumberFormat('es-ES', { notation: 'compact' }).format(
        growth?.views_30d || 0
      ),
      color: 'text-[var(--vl-cyan)]',
      bg: 'bg-[var(--vl-cyan-soft)] border-[var(--vl-cyan)]/25',
      icon: <Eye className="w-4.5 h-4.5" />,
      change: growth?.views_change_pct !== undefined 
        ? `${growth.views_change_pct >= 0 ? '↑' : '↓'} ${Math.abs(growth.views_change_pct)}%`
        : '—',
    },
    {
      label: `Promedio Vistas (${growth?.videos_30d || 0} videos)`,
      value: new Intl.NumberFormat('es-ES', { notation: 'compact' }).format(
        avgViews
      ),
      color: 'text-[var(--vl-cyan)]',
      bg: 'bg-[var(--vl-cyan-soft)] border-[var(--vl-cyan)]/25',
      icon: <TrendingUp className="w-4.5 h-4.5" />,
      change: growth?.views_change_pct !== undefined 
        ? `${growth.views_change_pct >= 0 ? '↑' : '↓'} ${Math.abs(growth.views_change_pct)}%`
        : '—',
    },
    {
      label: 'Nuevos Suscriptores',
      value: `+${new Intl.NumberFormat('es-ES', { notation: 'compact' }).format(totalSubs)}`,
      color: 'text-[var(--vl-red)]',
      bg: 'bg-[var(--vl-red-soft)] border-[var(--vl-red)]/25',
      icon: <Users className="w-4.5 h-4.5" />,
      change: growth?.subscribers_change_pct !== undefined 
        ? `${growth.subscribers_change_pct >= 0 ? '↑' : '↓'} ${Math.abs(growth.subscribers_change_pct)}%`
        : '—',
    },
    {
      label: 'Likes Acumulados',
      value: new Intl.NumberFormat('es-ES', { notation: 'compact' }).format(
        totalLikes
      ),
      color: 'text-[var(--vl-purple)]',
      bg: 'bg-[var(--vl-purple-soft)] border-[var(--vl-purple)]/25',
      icon: <ThumbsUp className="w-4.5 h-4.5" />,
      change: growth?.likes_change_pct !== undefined 
        ? `${growth.likes_change_pct >= 0 ? '↑' : '↓'} ${Math.abs(growth.likes_change_pct)}%`
        : '—',
    },
    {
      label: 'Comentarios Nuevos',
      value: new Intl.NumberFormat('es-ES', { notation: 'compact' }).format(
        totalComments
      ),
      color: 'text-amber-500',
      bg: 'bg-amber-500/10 border-amber-500/20',
      icon: <MessageCircle className="w-4.5 h-4.5" />,
      change: growth?.comments_change_pct !== undefined 
        ? `${growth.comments_change_pct >= 0 ? '↑' : '↓'} ${Math.abs(growth.comments_change_pct)}%`
        : '—',
    },
  ];

  return (
    <div className="vl-card-dashboard p-6 h-full flex flex-col border border-[var(--vl-border)] rounded-2xl bg-[var(--vl-bg-surface)]/60 backdrop-blur-md">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-[var(--vl-cyan)]" />
        <h3 className="text-lg font-bold text-[var(--vl-text-primary)]">
          Impacto Reciente{' '}
          <span className="text-xs font-semibold text-[var(--vl-text-secondary)] lowercase">
            / últimos 30 días
          </span>
        </h3>
      </div>

      <div className="space-y-3.5 flex-1 flex flex-col justify-center">
        {metrics.map((m, idx) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] border border-transparent hover:border-[var(--vl-border)]/40 transition-all duration-300 w-full"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${m.bg} ${m.color}`}
            >
              {m.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider truncate">
                {m.label}
              </p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <p className="text-base font-black text-[var(--vl-text-primary)] tracking-tight">
                  {m.value}
                </p>
                {m.change && (
                  <span className="text-[10px] font-bold text-[var(--vl-success)]">
                    {m.change}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
