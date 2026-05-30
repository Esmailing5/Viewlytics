'use client';

import Link from 'next/link';
import { Trophy, ArrowUpRight, Eye, Users, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { FEATURED_RANKINGS } from '@/constants/dashboard-mock-data';

export function RankingsPreview() {
  // Construct a list of 7 creators for the Top 7 Leaderboard
  const HOMEPAGE_RANKINGS = [
    ...FEATURED_RANKINGS,
    { rank: 6, creatorName: 'Manny Viloria', slug: 'manny-viloria', platform: 'youtube' as const, avatarInitials: 'MV', category: 'Podcast', subscribers: 890000, views_30d: 480000, videos_30d: 4, growth: '+21%' },
    { rank: 7, creatorName: 'El Pachá Oficial', slug: 'el-pacha', platform: 'youtube' as const, avatarInitials: 'EP', category: 'Entertainment', subscribers: 1200000, views_30d: 650000, videos_30d: 5, growth: '+5%' }
  ];

  // Separate top 3 for the podium showcase and the rest for list
  const top3 = [
    HOMEPAGE_RANKINGS[1], // #2 is left (Index 1)
    HOMEPAGE_RANKINGS[0], // #1 is center (Index 0)
    HOMEPAGE_RANKINGS[2], // #3 is right (Index 2)
  ].filter(Boolean);

  const remaining = HOMEPAGE_RANKINGS.slice(3);

  // SVG trend indicators helper
  const getTrendIcon = (growth: string) => {
    if (growth.startsWith('+')) {
      return (
        <span className="vl-trend-indicator vl-trend-up">
          <ArrowUp className="w-3.5 h-3.5" strokeWidth={3} />
        </span>
      );
    } else if (growth.startsWith('-')) {
      return (
        <span className="vl-trend-indicator vl-trend-down">
          <ArrowDown className="w-3.5 h-3.5" strokeWidth={3} />
        </span>
      );
    }
    return (
      <span className="vl-trend-indicator vl-trend-stable">
        <Minus className="w-3.5 h-3.5" strokeWidth={3} />
      </span>
    );
  };

  const formatStat = (val: number) => {
    return new Intl.NumberFormat('es-ES', { notation: 'compact' }).format(val);
  };

  return (
    <section className="py-28 bg-[var(--vl-bg-secondary)] border-y border-[var(--vl-border)] relative overflow-hidden vl-noise-container">
      {/* Background visual accent */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[var(--vl-red-glow)] rounded-full blur-[130px] opacity-20 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--vl-red-soft)] border border-[rgba(255,59,48,0.15)] mb-4">
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

        {/* Main Leaderboard Card */}
        <div className="max-w-4xl mx-auto bg-[var(--vl-bg-primary)]/80 backdrop-blur-md rounded-3xl border border-[var(--vl-border)] shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 sm:p-8 border-b border-[var(--vl-border)] bg-[var(--vl-bg-surface)]/40">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                <Trophy className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-lg text-[var(--vl-text-primary)] uppercase tracking-wide">
                Top 7 Global Dominicano
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[var(--vl-success)] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--vl-text-secondary)]">
                Actualizado Hoy
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* ─── Premium Podium Showcase (Top 3) ─── */}
            <div className="hidden sm:grid grid-cols-3 gap-6 items-end mb-10 max-w-3xl mx-auto">
              
              {/* Rank 2 (Left) */}
              {top3[0] && (
                <Link href={`/channel/${top3[0].platform}/${top3[0].slug}`} className="vl-podium-card vl-podium-2nd group">
                  <div className="vl-podium-glow" />
                  <span className="vl-podium-badge">#2</span>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg bg-slate-300/10 border border-slate-300/20 text-slate-300 shadow-inner group-hover:scale-105 transition-transform duration-300">
                    {top3[0].avatarInitials}
                  </div>
                  <h4 className="font-black text-sm text-[var(--vl-text-primary)] mt-4 text-center truncate w-full group-hover:text-[var(--vl-red)] transition-colors">
                    {top3[0].creatorName}
                  </h4>
                  <p className="text-[10px] font-bold text-[var(--vl-text-secondary)] uppercase mt-1">
                    {top3[0].category}
                  </p>
                  
                  <div className="mt-5 flex items-center gap-3 justify-center w-full">
                    <div className="text-center">
                      <p className="text-[8px] font-bold text-[var(--vl-text-tertiary)] uppercase">Followers</p>
                      <p className="text-xs font-black text-[var(--vl-text-primary)]">{formatStat(top3[0].subscribers)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] font-bold text-[var(--vl-text-tertiary)] uppercase">Views (30d)</p>
                      <p className="text-xs font-black text-[var(--vl-text-primary)]">{formatStat(top3[0].videos_30d > 0 ? top3[0].views_30d / top3[0].videos_30d : 0)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] font-bold text-[var(--vl-text-tertiary)] uppercase">Crecimiento</p>
                      <p className="text-xs font-bold text-[var(--vl-success)]">{top3[0].growth}</p>
                    </div>
                  </div>
                </Link>
              )}

              {/* Rank 1 (Center - Taller) */}
              {top3[1] && (
                <Link href={`/channel/${top3[1].platform}/${top3[1].slug}`} className="vl-podium-card vl-podium-1st group scale-[1.03]">
                  <div className="vl-podium-glow" />
                  <span className="vl-podium-badge">#1</span>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl bg-yellow-500/15 border-2 border-yellow-500/30 text-yellow-500 shadow-lg shadow-yellow-500/5 group-hover:scale-105 transition-transform duration-300">
                    {top3[1].avatarInitials}
                  </div>
                  <h4 className="font-black text-base text-[var(--vl-text-primary)] mt-4 text-center truncate w-full group-hover:text-[var(--vl-red)] transition-colors">
                    {top3[1].creatorName}
                  </h4>
                  <p className="text-[10px] font-bold text-yellow-500 uppercase mt-1">
                    {top3[1].category}
                  </p>
                  
                  <div className="mt-6 flex items-center gap-4 justify-center w-full">
                    <div className="text-center">
                      <p className="text-[8px] font-bold text-[var(--vl-text-tertiary)] uppercase">Followers</p>
                      <p className="text-sm font-black text-[var(--vl-text-primary)]">{formatStat(top3[1].subscribers)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] font-bold text-[var(--vl-text-tertiary)] uppercase">Views (30d)</p>
                      <p className="text-sm font-black text-[var(--vl-text-primary)]">{formatStat(top3[1].videos_30d > 0 ? top3[1].views_30d / top3[1].videos_30d : 0)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] font-bold text-[var(--vl-text-tertiary)] uppercase">Crecimiento</p>
                      <p className="text-sm font-bold text-[var(--vl-success)]">{top3[1].growth}</p>
                    </div>
                  </div>
                </Link>
              )}

              {/* Rank 3 (Right) */}
              {top3[2] && (
                <Link href={`/channel/${top3[2].platform}/${top3[2].slug}`} className="vl-podium-card vl-podium-3rd group">
                  <div className="vl-podium-glow" />
                  <span className="vl-podium-badge">#3</span>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg bg-amber-600/10 border border-amber-600/20 text-amber-600 shadow-inner group-hover:scale-105 transition-transform duration-300">
                    {top3[2].avatarInitials}
                  </div>
                  <h4 className="font-black text-sm text-[var(--vl-text-primary)] mt-4 text-center truncate w-full group-hover:text-[var(--vl-red)] transition-colors">
                    {top3[2].creatorName}
                  </h4>
                  <p className="text-[10px] font-bold text-[var(--vl-text-secondary)] uppercase mt-1">
                    {top3[2].category}
                  </p>
                  
                  <div className="mt-5 flex items-center gap-3 justify-center w-full">
                    <div className="text-center">
                      <p className="text-[8px] font-bold text-[var(--vl-text-tertiary)] uppercase">Followers</p>
                      <p className="text-xs font-black text-[var(--vl-text-primary)]">{formatStat(top3[2].subscribers)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] font-bold text-[var(--vl-text-tertiary)] uppercase">Views (30d)</p>
                      <p className="text-xs font-black text-[var(--vl-text-primary)]">{formatStat(top3[2].videos_30d > 0 ? top3[2].views_30d / top3[2].videos_30d : 0)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] font-bold text-[var(--vl-text-tertiary)] uppercase">Crecimiento</p>
                      <p className="text-xs font-bold text-[var(--vl-success)]">{top3[2].growth}</p>
                    </div>
                  </div>
                </Link>
              )}
            </div>

            {/* Mobile View: Render Top 3 as large cards with stats grid */}
            <div className="sm:hidden space-y-3 mb-6">
              {HOMEPAGE_RANKINGS.slice(0, 3).map((entry) => {
                const badgeColor = 
                  entry.rank === 1 ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                  entry.rank === 2 ? 'bg-slate-300/10 text-slate-300 border-slate-300/20' :
                  'bg-amber-600/10 text-amber-600 border-amber-600/20';

                return (
                  <Link 
                    key={entry.rank}
                    href={`/channel/${entry.platform}/${entry.slug}`}
                    className="flex flex-col p-4.5 rounded-2xl bg-[var(--vl-bg-surface)] border border-[var(--vl-border)] hover:border-[var(--vl-border-hover)] transition-all duration-300 group"
                  >
                    {/* Header: Rank, Avatar, Creator Info & Platform */}
                    <div className="flex items-center justify-between border-b border-[var(--vl-border)]/45 pb-3">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs border ${badgeColor}`}>
                          #{entry.rank}
                        </span>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs bg-[var(--vl-bg-surface)] border border-[var(--vl-border)] text-[var(--vl-text-primary)] shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
                          {entry.avatarInitials}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-[var(--vl-text-primary)] group-hover:text-[var(--vl-red)] transition-colors flex items-center gap-1">
                            {entry.creatorName}
                          </h4>
                          <p className="text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider mt-0.5">
                            {entry.platform}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid: Followers, Views, Growth */}
                    <div className="grid grid-cols-3 gap-2 pt-3 text-center">
                      <div>
                        <p className="text-[8px] font-bold text-[var(--vl-text-tertiary)] uppercase">Followers</p>
                        <p className="text-xs font-black text-[var(--vl-text-primary)] mt-0.5">{formatStat(entry.subscribers)}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-bold text-[var(--vl-text-tertiary)] uppercase">Views (30d)</p>
                        <p className="text-xs font-black text-[var(--vl-text-primary)] mt-0.5">{formatStat(entry.videos_30d > 0 ? entry.views_30d / entry.videos_30d : 0)}</p>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-[8px] font-bold text-[var(--vl-text-tertiary)] uppercase">Growth</p>
                        <div className="inline-flex items-center gap-1 mt-0.5">
                          <span className="text-xs font-bold text-[var(--vl-success)]">{entry.growth}</span>
                          {getTrendIcon(entry.growth)}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* ─── Remaining Leaderboard Mobile View (#4+) ─── */}
            <div className="sm:hidden space-y-3">
              {remaining.map((entry) => (
                <Link 
                  key={entry.rank}
                  href={`/channel/${entry.platform}/${entry.slug}`}
                  className="flex flex-col xs:flex-row xs:items-center justify-between p-4 gap-4 rounded-2xl bg-[var(--vl-bg-surface)] border border-[var(--vl-border)] hover:border-[var(--vl-border-hover)] transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs border border-[var(--vl-border)] bg-[var(--vl-bg-surface)] text-[var(--vl-text-secondary)]">
                      #{entry.rank}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-sm text-[var(--vl-text-primary)] group-hover:text-[var(--vl-red)] transition-colors">
                        {entry.creatorName}
                      </h4>
                      <p className="text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase">
                        {entry.platform}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 w-full xs:w-auto xs:flex xs:items-center xs:gap-4 pt-3 xs:pt-0 border-t border-[var(--vl-border)]/45 xs:border-0 text-center xs:text-right">
                    <div>
                      <p className="text-[8px] font-bold text-[var(--vl-text-tertiary)] uppercase">Followers</p>
                      <p className="text-xs font-black text-[var(--vl-text-primary)] mt-0.5 xs:mt-0">{formatStat(entry.subscribers)}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-[var(--vl-text-tertiary)] uppercase">Views (30d)</p>
                      <p className="text-xs font-black text-[var(--vl-text-primary)] mt-0.5 xs:mt-0">{formatStat(entry.videos_30d > 0 ? entry.views_30d / entry.videos_30d : 0)}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-[var(--vl-text-tertiary)] uppercase">Growth</p>
                      <p className="text-xs font-bold text-[var(--vl-success)] mt-0.5 xs:mt-0">{entry.growth}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* ─── Remaining Leaderboard Table (#4 and #5 - Desktop) ─── */}
            <div className="hidden sm:block border border-[var(--vl-border)] rounded-2xl overflow-hidden bg-[var(--vl-bg-surface)]/20">
              <div className="vl-rankings-scroll-container">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-[var(--vl-border)] bg-[var(--vl-bg-surface)]/50">
                      <th className="p-4 pl-6 text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider w-16">Rank</th>
                      <th className="p-4 text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider">Creador</th>
                      <th className="p-4 text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider text-right">Seguidores</th>
                      <th className="p-4 text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider text-right">Vistas (30d)</th>
                      <th className="p-4 text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider text-right w-32">Tendencia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--vl-border)]">
                    {remaining.map((entry) => (
                      <tr 
                        key={entry.rank}
                        className="vl-broadcast-row hover:bg-white/[0.015] dark:hover:bg-white/[0.015] transition-colors duration-200 cursor-pointer group"
                        onClick={() => window.location.href = `/channel/${entry.platform}/${entry.slug}`}
                      >
                        <td className="p-4 pl-6">
                          <span className="vl-broadcast-number text-[var(--vl-text-secondary)] group-hover:text-[var(--vl-red)] transition-colors">
                            #{entry.rank}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs bg-[var(--vl-bg-surface)] border border-[var(--vl-border)] text-[var(--vl-text-primary)] shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
                              {entry.avatarInitials}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-sm text-[var(--vl-text-primary)] group-hover:text-[var(--vl-red)] transition-colors">
                                {entry.creatorName}
                              </h4>
                              <p className="text-[10px] font-bold uppercase tracking-wider mt-0.5">
                                <span className={entry.platform === 'youtube' ? 'text-red-500' : 'text-purple-500'}>
                                  {entry.platform}
                                </span>
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-sm font-black text-[var(--vl-text-primary)] tracking-tight">
                            {formatStat(entry.subscribers)}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-sm font-black text-[var(--vl-text-primary)] tracking-tight">
                            {formatStat(entry.videos_30d > 0 ? entry.views_30d / entry.videos_30d : 0)}
                          </span>
                        </td>
                        <td className="p-4 text-right pr-6">
                          <div className="inline-flex items-center gap-2 justify-end">
                            <span className="text-xs font-extrabold text-[var(--vl-success)]">{entry.growth}</span>
                            {getTrendIcon(entry.growth)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

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
