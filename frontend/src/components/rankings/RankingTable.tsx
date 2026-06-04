import React from 'react';
import { RankingResult } from '@/services/rankingsService';
import { RankingTab } from '@/hooks/useRankings';
import { ShieldCheck } from 'lucide-react';

interface RankingTableProps {
  results: RankingResult[];
  tab: RankingTab;
  isLoading: boolean;
}

export function RankingTable({ results, tab, isLoading }: RankingTableProps) {
  const formatStat = (val?: number) => {
    if (val === undefined) return '0';
    return new Intl.NumberFormat('es-ES', { notation: 'compact' }).format(val);
  };

  const formatCompleteNumber = (val?: number) => {
    if (val === undefined) return '0';
    return new Intl.NumberFormat('es-ES').format(val);
  };

  // Skeleton rows for loading state
  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left table-fixed">
          <thead>
            <tr className="border-b border-[var(--vl-border)]/45 text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider">
              <th className="p-2.5 pl-3 md:p-4 md:pl-6 w-12 md:w-20">Pos.</th>
              <th className="p-2.5 md:p-4">Canal</th>
              {tab === 'impact-total' && (
                <>
                  <th className="p-2.5 md:p-4 text-right w-20 md:w-auto">Impacto</th>
                  <th className="hidden md:table-cell p-4 text-right">Vistas Videos</th>
                  <th className="hidden md:table-cell p-4 text-right">Vistas Shorts</th>
                </>
              )}
              {tab === 'videos-largos' && (
                <>
                  <th className="p-2.5 md:p-4 text-right w-20 md:w-auto">Vistas</th>
                  <th className="hidden md:table-cell p-4 text-right">Videos (30d)</th>
                </>
              )}
              {tab === 'shorts' && (
                <>
                  <th className="p-2.5 md:p-4 text-right w-20 md:w-auto">Vistas</th>
                  <th className="hidden md:table-cell p-4 text-right">Shorts (30d)</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--vl-border)]/20">
            {Array.from({ length: 5 }).map((_, idx) => (
              <tr key={idx} className="animate-pulse">
                <td className="p-2.5 pl-3 md:p-4 md:pl-6">
                  <div className="h-5 w-8 bg-white/[0.05] rounded" />
                </td>
                <td className="p-2.5 md:p-4">
                  <div className="flex items-center gap-2 md:gap-3 min-w-0">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/[0.05] shrink-0" />
                    <div className="space-y-2">
                      <div className="h-4 w-20 md:w-32 bg-white/[0.05] rounded" />
                      <div className="h-3 w-12 md:w-20 bg-white/[0.05] rounded" />
                    </div>
                  </div>
                </td>
                {tab === 'impact-total' && (
                  <>
                    <td className="p-2.5 md:p-4 text-right"><div className="h-5 w-14 md:w-20 bg-white/[0.05] rounded ml-auto" /></td>
                    <td className="hidden md:table-cell p-4 text-right"><div className="h-5 w-20 bg-white/[0.05] rounded ml-auto" /></td>
                    <td className="hidden md:table-cell p-4 text-right"><div className="h-5 w-20 bg-white/[0.05] rounded ml-auto" /></td>
                  </>
                )}
                {tab === 'videos-largos' && (
                  <>
                    <td className="p-2.5 md:p-4 text-right"><div className="h-5 w-14 md:w-20 bg-white/[0.05] rounded ml-auto" /></td>
                    <td className="hidden md:table-cell p-4 text-right"><div className="h-5 w-16 bg-white/[0.05] rounded ml-auto" /></td>
                  </>
                )}
                {tab === 'shorts' && (
                  <>
                    <td className="p-2.5 md:p-4 text-right"><div className="h-5 w-14 md:w-20 bg-white/[0.05] rounded ml-auto" /></td>
                    <td className="hidden md:table-cell p-4 text-right"><div className="h-5 w-16 bg-white/[0.05] rounded ml-auto" /></td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-sm font-semibold text-[var(--vl-text-secondary)]">No hay registros disponibles</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left table-fixed">
        <thead>
          <tr className="border-b border-[var(--vl-border)]/45 text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider">
            <th className="p-2.5 pl-3 md:p-4 md:pl-6 w-12 md:w-20">Pos.</th>
            <th className="p-2.5 md:p-4">Canal</th>
            {tab === 'impact-total' && (
              <>
                <th className="p-2.5 md:p-4 text-right w-20 md:w-auto">Impacto</th>
                <th className="hidden md:table-cell p-4 text-right">Vistas Videos</th>
                <th className="hidden md:table-cell p-4 text-right">Vistas Shorts</th>
              </>
            )}
            {tab === 'videos-largos' && (
              <>
                <th className="p-3 md:p-4 text-right">Vistas Videos</th>
                <th className="hidden md:table-cell p-4 text-right">Videos (30d)</th>
              </>
            )}
            {tab === 'shorts' && (
              <>
                <th className="p-2.5 md:p-4 text-right w-20 md:w-auto">Vistas</th>
                <th className="hidden md:table-cell p-4 text-right">Shorts (30d)</th>
              </>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--vl-border)]/35">
          {results.map((creator) => {
            const isFirst = creator.position === 1;
            const initials = creator.displayName ? creator.displayName.substring(0, 2) : 'CH';
            const positionClass = isFirst
              ? 'text-cyan-400 font-black text-base drop-shadow-[0_0_8px_rgba(34,211,238,0.2)]'
              : 'text-[var(--vl-text-secondary)] font-bold';

            return (
              <tr 
                key={creator.creatorId} 
                className="hover:bg-white/[0.015] transition-colors duration-200 cursor-pointer group"
                onClick={() => {
                  window.location.href = `/channel/youtube/${creator.displayName.toLowerCase().replace(/\s+/g, '-')}`;
                }}
              >
                {/* Posición */}
                <td className="p-2.5 pl-3 md:p-4 md:pl-6">
                  <span className={positionClass}>
                    #{creator.position}
                  </span>
                </td>

                {/* Canal */}
                <td className="p-2.5 md:p-4">
                  <div className="flex items-center gap-2 md:gap-3.5 min-w-0">
                    <div className="relative shrink-0">
                      {creator.avatarUrl ? (
                        <img
                          src={creator.avatarUrl}
                          alt={creator.displayName}
                          className={`w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border ${
                            isFirst ? 'border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.15)]' : 'border-[var(--vl-border)]/60'
                          }`}
                        />
                      ) : (
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/[0.04] border border-[var(--vl-border)]/60 flex items-center justify-center text-[10px] md:text-xs font-bold text-[var(--vl-text-tertiary)] uppercase">
                          {initials}
                        </div>
                      )}
                      {isFirst && (
                        <span className="absolute bottom-0 right-0 w-2 h-2 md:w-2.5 md:h-2.5 bg-cyan-400 border-2 border-[var(--vl-bg-surface)] rounded-full shadow-[0_0_8px_#22d3ee]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-xs md:text-sm text-[var(--vl-text-primary)] group-hover:text-cyan-400 transition-colors flex items-center gap-1 truncate">
                        <span className="truncate">{creator.displayName}</span>
                        <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500 fill-blue-500/10 shrink-0" />
                      </h4>
                      <span className="text-[9px] md:text-[10px] font-semibold text-[var(--vl-text-tertiary)] uppercase tracking-wider">
                        YouTube
                      </span>
                    </div>
                  </div>
                </td>

                {/* Columnas específicas */}
                {tab === 'impact-total' && (
                  <>
                    <td className="p-2.5 md:p-4 text-right font-black text-xs md:text-sm text-[var(--vl-text-primary)]">
                      {formatStat(creator.impactTotal30d)}
                    </td>
                    <td className="hidden md:table-cell p-4 text-right font-medium text-sm text-[var(--vl-text-secondary)]">
                      {formatStat(creator.viewsVideos30d)}
                    </td>
                    <td className="hidden md:table-cell p-4 text-right font-medium text-sm text-[var(--vl-text-secondary)]">
                      {formatStat(creator.viewsShorts30d)}
                    </td>
                  </>
                )}

                {tab === 'videos-largos' && (
                  <>
                    <td className="p-2.5 md:p-4 text-right font-black text-xs md:text-sm text-[var(--vl-text-primary)]">
                      {formatStat(creator.viewsVideos30d)}
                    </td>
                    <td className="hidden md:table-cell p-4 text-right font-semibold text-sm text-[var(--vl-text-secondary)]">
                      {creator.videos30d}
                    </td>
                  </>
                )}

                {tab === 'shorts' && (
                  <>
                    <td className="p-2.5 md:p-4 text-right font-black text-xs md:text-sm text-[var(--vl-text-primary)]">
                      {formatStat(creator.viewsShorts30d)}
                    </td>
                    <td className="hidden md:table-cell p-4 text-right font-semibold text-sm text-[var(--vl-text-secondary)]">
                      {creator.shorts30d}
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
