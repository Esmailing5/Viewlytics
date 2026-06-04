'use client';

import Link from 'next/link';
import { TrendingUp, Users, ArrowRight, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface TrendingCreator {
  creatorId: string;
  displayName: string;
  avatarUrl: string | null;
  deltaViews: number;
  growthPct: number;
  platform: 'youtube' | 'twitch' | 'kick';
  slug: string;
}

interface TrendingPreviewProps {
  data?: {
    updatedAt: string;
    results: TrendingCreator[];
  };
}

function getInitials(name: string) {
  if (!name) return '??';
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function TrendingPreview({ data }: TrendingPreviewProps) {
  const results = data?.results || [];

  const formatViews = (val: number) => {
    return `${new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1,
    }).format(val)} views`;
  };

  return (
    <section className="py-28 bg-[var(--vl-bg-primary)] border-t border-[var(--vl-border)] relative">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[var(--vl-cyan-glow)] rounded-full blur-[100px] opacity-40 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--vl-cyan-soft)] border border-[var(--vl-cyan)/20] mb-4">
              <TrendingUp className="w-3.5 h-3.5 text-[var(--vl-cyan)]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--vl-cyan)]">En Alza</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--vl-text-primary)] tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              Creadores en Tendencia
            </h2>
            <p className="text-[var(--vl-text-secondary)] mt-3 text-base md:text-lg max-w-xl">
              Los canales con mayor crecimiento y tracción en las últimas 24 horas dentro del ecosistema dominicano.
            </p>
          </div>
          
          <Link href="/trending" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--vl-cyan)] hover:text-[var(--vl-cyan-hover)] transition-colors duration-200 group">
            <span>Ver tendencias completas</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Creators Grid */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.08 }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {results.slice(0, 6).map((creator) => {
            // Determine colors and branding based on platform
            const platformColors = {
              youtube: {
                border: 'group-hover:border-red-500/40',
                shadow: 'hover:shadow-red-500/5',
                ring: 'ring-red-500/20 bg-red-500/10 text-red-500',
                avatarRing: 'border-red-500/50',
                badgeBg: 'bg-red-500/10 text-red-500 border-red-500/20'
              },
              twitch: {
                border: 'group-hover:border-purple-500/40',
                shadow: 'hover:shadow-purple-500/5',
                ring: 'ring-purple-500/20 bg-purple-500/10 text-purple-500',
                avatarRing: 'border-purple-500/50',
                badgeBg: 'bg-purple-500/10 text-purple-500 border-purple-500/20'
              },
              kick: {
                border: 'group-hover:border-green-500/40',
                shadow: 'hover:shadow-green-500/5',
                ring: 'ring-green-500/20 bg-green-500/10 text-green-500',
                avatarRing: 'border-green-500/50',
                badgeBg: 'bg-green-500/10 text-green-500 border-green-500/20'
              }
            }[creator.platform] || {
              border: 'group-hover:border-slate-500/40',
              shadow: 'hover:shadow-slate-500/5',
              ring: 'ring-slate-500/20 bg-slate-500/10 text-slate-500',
              avatarRing: 'border-slate-500/50',
              badgeBg: 'bg-slate-500/10 text-slate-500 border-slate-500/20'
            };

            const growthText = creator.growthPct >= 0
              ? `+${creator.growthPct.toFixed(1)}%`
              : `${creator.growthPct.toFixed(1)}%`;

            return (
              <motion.div
                key={creator.creatorId}
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  show: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link 
                  href={`/channel/${creator.platform}/${creator.slug}`} // We default slug or let the frontend search slug
                  className={`group flex items-center justify-between p-6 rounded-2xl bg-[var(--vl-bg-surface)]/60 backdrop-blur-md border border-[var(--vl-border)] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${platformColors.border} ${platformColors.shadow}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar with dynamic platform-colored border ring */}
                    <div className={`w-14 h-14 rounded-full border-2 overflow-hidden ${platformColors.avatarRing} bg-gradient-to-br from-[var(--vl-bg-elevated)] to-[var(--vl-bg-surface)] flex items-center justify-center text-white font-extrabold text-md relative shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                      {creator.avatarUrl ? (
                        <img src={creator.avatarUrl} alt={creator.displayName} className="w-full h-full object-cover" />
                      ) : (
                        getInitials(creator.displayName)
                      )}
                      <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border border-[var(--vl-bg-surface)] flex items-center justify-center text-[8px] font-black uppercase ${
                        creator.platform === 'youtube' ? 'bg-red-600 text-white' : 
                        creator.platform === 'twitch' ? 'bg-purple-600 text-white' : 'bg-green-600 text-black'
                      }`}>
                        {creator.platform[0]}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-[var(--vl-text-primary)] group-hover:text-[var(--vl-text-primary)] transition-colors duration-200 truncate max-w-[150px]">
                        {creator.displayName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${platformColors.badgeBg}`}>
                          {creator.platform}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-[var(--vl-border)]" />
                        <span className="text-[11px] font-bold text-[var(--vl-success)] flex items-center gap-0.5">
                          {creator.growthPct >= 0 && <ArrowUp className="w-3.5 h-3.5 text-[var(--vl-cyan)]" />}
                          <span className={creator.growthPct >= 0 ? 'text-[var(--vl-cyan)]' : 'text-[var(--vl-text-secondary)]'}>
                            {growthText}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-base font-black text-[var(--vl-text-primary)] tracking-tight">
                      {formatViews(creator.deltaViews)}
                    </div>
                    <div className="text-[10px] font-bold text-[var(--vl-text-tertiary)] flex items-center gap-1 justify-end uppercase tracking-wider mt-0.5">
                      <Users className="w-3.5 h-3.5 text-[var(--vl-text-tertiary)]" /> views
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
