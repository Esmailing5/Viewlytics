'use client';

import Link from 'next/link';
import { Trophy, ArrowUpRight } from 'lucide-react';

interface CreatorRanking {
  position: number;
  creatorId: string;
  displayName: string;
  avatarUrl: string | null;
  platform: string;
  slug: string;
  impactTotal30d: number;
  viewsVideos30d: number;
  viewsShorts30d: number;
  subscribers?: number;
}

interface RankingsPreviewProps {
  data?: {
    snapshotDate: string | null;
    total: number;
    results: CreatorRanking[];
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

function formatDate(dateStr?: string | null) {
  if (!dateStr) return 'Actualizado Hoy';
  try {
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length === 3) {
      return `Actualizado: ${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  } catch (e) {
    // fallback
  }
  return 'Actualizado Hoy';
}

export function RankingsPreview({ data }: RankingsPreviewProps) {
  const results = data?.results || [];

  const top1 = results.find((r) => r.position === 1);
  const top2 = results.find((r) => r.position === 2);
  const top3 = results.find((r) => r.position === 3);

  const top3Ordered = [top2, top1, top3].filter((x): x is CreatorRanking => !!x);
  const remaining = results.filter((r) => r.position > 3);

  const formatStat = (val: number) => {
    return new Intl.NumberFormat('es-ES', { notation: 'compact' }).format(val);
  };

  return (
    <section className="py-16 md:py-24 bg-[var(--vl-bg-secondary)] border-y border-[var(--vl-border)] relative overflow-hidden vl-noise-container">
      {/* Background visual accent */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[var(--vl-red-glow)] rounded-full blur-[130px] opacity-20 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
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
                {formatDate(data?.snapshotDate)}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* ─── Premium Podium Showcase (Top 3) ─── */}
            <div className="hidden sm:grid grid-cols-3 gap-3 items-end mb-10 max-w-3xl mx-auto">
              {top3Ordered.map((entry) => {
                const isFirst = entry.position === 1;
                const isSecond = entry.position === 2;

                const borderClass = isFirst
                  ? 'border-2 border-yellow-500/30'
                  : isSecond
                  ? 'border border-slate-300/20'
                  : 'border border-amber-600/20';

                const textClass = isFirst
                  ? 'text-yellow-500'
                  : isSecond
                  ? 'text-slate-300'
                  : 'text-amber-600';

                const bgClass = isFirst
                  ? 'bg-yellow-500/15'
                  : isSecond
                  ? 'bg-slate-300/10'
                  : 'bg-amber-600/10';

                const cardClass = isFirst
                  ? 'vl-podium-card vl-podium-1st group scale-[1.03] p-6'
                  : isSecond
                  ? 'vl-podium-card vl-podium-2nd group p-6'
                  : 'vl-podium-card vl-podium-3rd group p-6';

                const avatarSize = isFirst ? 'w-24 h-24' : 'w-20 h-20';

                return (
                  <Link
                    key={entry.creatorId}
                    href={`/channel/${entry.platform}/${entry.slug}`}
                    className={cardClass}
                  >
                    <div className="vl-podium-glow" />
                    <span className="vl-podium-badge">#{entry.position}</span>
                    <div className={`${avatarSize} rounded-2xl flex items-center justify-center font-black overflow-hidden bg-gradient-to-br from-[var(--vl-bg-elevated)] to-[var(--vl-bg-surface)] ${borderClass} ${textClass} ${bgClass} shadow-inner group-hover:scale-105 transition-transform duration-300`}>
                      {entry.avatarUrl ? (
                        <img
                          src={entry.avatarUrl}
                          alt={entry.displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getInitials(entry.displayName)
                      )}
                    </div>
                    <h4 className={`font-black text-center truncate w-full group-hover:text-[var(--vl-red)] transition-colors mt-3 ${isFirst ? 'text-base' : 'text-sm text-[var(--vl-text-primary)]'}`}>
                      {entry.displayName}
                    </h4>
                    <p className="text-xs font-bold text-[var(--vl-text-secondary)] uppercase mt-1">
                      {entry.platform}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-2 w-full">
                      <div className="flex flex-col items-center">
                        <p className="text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider">Vistas (30d)</p>
                        <p className="text-sm font-black text-[var(--vl-text-primary)] mt-0.5">{formatStat(entry.impactTotal30d)}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <p className="text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider">Suscriptores</p>
                        <p className="text-sm font-black text-[var(--vl-text-primary)] mt-0.5">{formatStat(entry.subscribers ?? 0)}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Mobile View: Render Top 3 as large cards with stats grid */}
            <div className="sm:hidden space-y-3 mb-6">
              {results.slice(0, 3).map((entry) => {
                const badgeColor =
                  entry.position === 1
                    ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                    : entry.position === 2
                    ? 'bg-slate-300/10 text-slate-300 border-slate-300/20'
                    : 'bg-amber-600/10 text-amber-600 border-amber-600/20';

                return (
                  <Link
                    key={entry.creatorId}
                    href={`/channel/${entry.platform}/${entry.slug}`}
                    className="flex flex-col p-3.5 rounded-2xl bg-[var(--vl-bg-surface)] border border-[var(--vl-border)] hover:border-[var(--vl-border-hover)] transition-all duration-300 group"
                  >
                    {/* Header: Rank, Avatar, Creator Info & Platform */}
                    <div className="flex items-center justify-between border-b border-[var(--vl-border)]/45 pb-3">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs border ${badgeColor}`}>
                          #{entry.position}
                        </span>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs overflow-hidden bg-[var(--vl-bg-surface)] border border-[var(--vl-border)] text-[var(--vl-text-primary)] shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
                          {entry.avatarUrl ? (
                            <img
                              src={entry.avatarUrl}
                              alt={entry.displayName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            getInitials(entry.displayName)
                          )}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-[var(--vl-text-primary)] group-hover:text-[var(--vl-red)] transition-colors flex items-center gap-1">
                            {entry.displayName}
                          </h4>
                          <p className="text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider mt-0.5">
                            {entry.platform}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid: Views & Subscribers */}
                    <div className="grid grid-cols-2 gap-3 pt-3 text-center">
                      <div>
                        <p className="text-[8px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider">Vistas (30d)</p>
                        <p className="text-xs font-black text-[var(--vl-text-primary)] mt-1">{formatStat(entry.impactTotal30d)}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider">SUSCRIPTORES</p>
                        <p className="text-xs font-black text-[var(--vl-text-primary)] mt-1">{formatStat(entry.subscribers ?? 0)}</p>
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
                  key={entry.creatorId}
                  href={`/channel/${entry.platform}/${entry.slug}`}
                  className="flex flex-col xs:flex-row xs:items-center justify-between p-4 gap-4 rounded-2xl bg-[var(--vl-bg-surface)] border border-[var(--vl-border)] hover:border-[var(--vl-border-hover)] transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs border border-[var(--vl-border)] bg-[var(--vl-bg-surface)] text-[var(--vl-text-secondary)]">
                      #{entry.position}
                    </span>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs overflow-hidden bg-[var(--vl-bg-surface)] border border-[var(--vl-border)] text-[var(--vl-text-primary)] shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
                      {entry.avatarUrl ? (
                        <img
                          src={entry.avatarUrl}
                          alt={entry.displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getInitials(entry.displayName)
                      )}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[var(--vl-text-primary)] group-hover:text-[var(--vl-red)] transition-colors">
                        {entry.displayName}
                      </h4>
                      <p className="text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase">
                        {entry.platform}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-3 xs:pt-0 xs:border-0 text-center xs:text-right">
                    <div>
                      <p className="text-[8px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider">Vistas (30d)</p>
                      <p className="text-xs font-black text-[var(--vl-text-primary)] mt-1">{formatStat(entry.impactTotal30d)}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider">SUSCRIPTORES</p>
                      <p className="text-xs font-black text-[var(--vl-text-primary)] mt-1">{formatStat(entry.subscribers ?? 0)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* ─── Remaining Leaderboard Table (#4 to #7 - Desktop) ─── */}
            <div className="hidden sm:block border border-[var(--vl-border)] rounded-2xl overflow-hidden bg-[var(--vl-bg-surface)]/20">
              <div className="vl-rankings-scroll-container">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-[var(--vl-border)] bg-[var(--vl-bg-surface)]/50">
                      <th className="p-4 pl-6 text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider w-16">Rank</th>
                      <th className="p-4 text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider">Creador</th>
                      <th className="p-4 text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider text-right">Suscriptores</th>
                      <th className="p-4 text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider text-right pr-6">Vistas (30d)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--vl-border)]">
                    {remaining.map((entry) => (
                      <tr
                        key={entry.creatorId}
                        className="vl-broadcast-row hover:bg-white/[0.015] dark:hover:bg-white/[0.015] transition-colors duration-200 cursor-pointer group"
                        onClick={() => (window.location.href = `/channel/${entry.platform}/${entry.slug}`)}
                      >
                        <td className="p-4 pl-6">
                          <span className="vl-broadcast-number text-[var(--vl-text-secondary)] group-hover:text-[var(--vl-red)] transition-colors">
                            #{entry.position}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs overflow-hidden bg-[var(--vl-bg-surface)] border border-[var(--vl-border)] text-[var(--vl-text-primary)] shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
                              {entry.avatarUrl ? (
                                <img
                                  src={entry.avatarUrl}
                                  alt={entry.displayName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                getInitials(entry.displayName)
                              )}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-sm text-[var(--vl-text-primary)] group-hover:text-[var(--vl-red)] transition-colors">
                                {entry.displayName}
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
                            {formatStat(entry.subscribers ?? 0)}
                          </span>
                        </td>
                        <td className="p-4 text-right pr-6">
                          <span className="text-sm font-black text-[var(--vl-text-primary)] tracking-tight">
                            {formatStat(entry.impactTotal30d)}
                          </span>
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
