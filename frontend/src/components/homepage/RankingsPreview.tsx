'use client';

import Link from 'next/link';
import { Trophy, ChevronRight, ArrowUpRight, Play, Eye, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { FEATURED_RANKINGS } from '@/constants/dashboard-mock-data';

export function RankingsPreview() {
  return (
    <section className="py-28 bg-[var(--vl-bg-secondary)] border-y border-[var(--vl-border)] relative overflow-hidden vl-noise-container">
      {/* Background visual accent */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[var(--vl-red-glow)] rounded-full blur-[130px] opacity-20 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--vl-red-soft)] border border-[var(--vl-red)/15] mb-4">
            <Trophy className="w-3.5 h-3.5 text-[var(--vl-red)]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--vl-red)]">Leaderboard Oficial</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--vl-text-primary)] tracking-tight mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Rankings Oficiales
          </h2>
          <p className="text-base md:text-lg text-[var(--vl-text-secondary)] leading-relaxed">
            Descubre quién domina en cada categoría en tiempo real. Nuestra plataforma audita continuamente el rendimiento de cientos de canales para ofrecer el ranking definitivo de la República Dominicana.
          </p>
        </div>

        {/* Leaderboard Card Container */}
        <div className="max-w-4xl mx-auto bg-[var(--vl-bg-primary)]/80 backdrop-blur-md rounded-3xl border border-[var(--vl-border)] shadow-2xl overflow-hidden">
          
          {/* Leaderboard Header */}
          <div className="flex items-center justify-between p-6 sm:p-8 border-b border-[var(--vl-border)] bg-[var(--vl-bg-surface)]/40">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                <Trophy className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-lg text-[var(--vl-text-primary)] uppercase tracking-wide">
                Top 5 Global Dominicano
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[var(--vl-success)] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--vl-text-secondary)]">
                Actualizado Hoy
              </span>
            </div>
          </div>

          {/* Leaderboard Rows */}
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.08 }
              }
            }}
            className="divide-y divide-[var(--vl-border)]"
          >
            {FEATURED_RANKINGS.map((entry) => {
              // Top-3 highlights
              const rankStyles = {
                1: { text: 'text-yellow-500', bg: 'bg-yellow-500/10 border-yellow-500/30' },
                2: { text: 'text-slate-300', bg: 'bg-slate-300/10 border-slate-300/20' },
                3: { text: 'text-amber-600', bg: 'bg-amber-600/10 border-amber-600/20' },
              }[entry.rank] || { text: 'text-[var(--vl-text-secondary)]', bg: 'bg-[var(--vl-bg-surface)] border-[var(--vl-border)]' };

              return (
                <motion.div
                  key={entry.rank}
                  variants={{
                    hidden: { opacity: 0, x: -15 },
                    show: { opacity: 1, x: 0 }
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={`/channel/${entry.platform}/${entry.slug}`}
                    className="vl-broadcast-row flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:p-8 gap-4 hover:bg-white/[0.01] transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-5 min-w-0">
                      
                      {/* Rank Number Column */}
                      <div className={`vl-broadcast-number w-10 text-left ${rankStyles.text} transition-colors group-hover:text-[var(--vl-red)]`}>
                        #{entry.rank}
                      </div>
                      
                      {/* Avatar Initials */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-sm text-[var(--vl-text-primary)] border ${rankStyles.bg} shrink-0 shadow-inner transition-transform group-hover:scale-105 duration-300`}>
                        {entry.avatarInitials}
                      </div>

                      {/* Name and Platform Info */}
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-base md:text-lg text-[var(--vl-text-primary)] truncate group-hover:text-[var(--vl-red)] transition-colors duration-200">
                          {entry.creatorName}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs font-bold uppercase tracking-wider text-[var(--vl-text-tertiary)]">
                          <span className={`${
                            entry.platform === 'youtube' ? 'text-red-500' :
                            entry.platform === 'twitch' ? 'text-purple-500' : 'text-green-500'
                          }`}>{entry.platform}</span>
                          <span>•</span>
                          <span className="text-[var(--vl-text-secondary)]">{entry.category}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats columns */}
                    <div className="flex items-center justify-between sm:justify-end gap-8 sm:gap-12 mt-2 sm:mt-0 pt-4 sm:pt-0 border-t border-[var(--vl-border)] sm:border-0">
                      {/* Followers stat */}
                      <div className="text-left sm:text-right">
                        <div className="text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider flex items-center gap-1 sm:justify-end mb-1">
                          <Users className="w-3.5 h-3.5" /> Followers
                        </div>
                        <div className="text-sm md:text-base font-black text-[var(--vl-text-primary)] tracking-tight">{entry.followers}</div>
                      </div>

                      {/* Total views stat */}
                      <div className="hidden sm:block text-right">
                        <div className="text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider flex items-center gap-1 justify-end mb-1">
                          <Eye className="w-3.5 h-3.5" /> Total Views
                        </div>
                        <div className="text-sm md:text-base font-black text-[var(--vl-text-primary)] tracking-tight">{entry.views}</div>
                      </div>

                      {/* Growth stat */}
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider mb-1">
                          Growth
                        </div>
                        <div className="text-sm md:text-base font-bold text-[var(--vl-success)]">
                          {entry.growth}
                        </div>
                      </div>

                      {/* Arrow Icon */}
                      <div className="pl-2 text-[var(--vl-text-tertiary)] group-hover:text-[var(--vl-red)] group-hover:translate-x-1 transition-all duration-300">
                        <ChevronRight className="w-6 h-6" />
                      </div>

                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Footer Call-to-Action */}
          <div className="p-6 bg-[var(--vl-bg-surface)]/20 border-t border-[var(--vl-border)] text-center">
            <Link 
              href="/rankings" 
              className="inline-flex items-center justify-center gap-2 text-sm font-bold text-[var(--vl-red)] hover:text-[var(--vl-red-hover)] transition-colors duration-200 group"
            >
              <span>Explorar Rankings Completos</span> 
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
