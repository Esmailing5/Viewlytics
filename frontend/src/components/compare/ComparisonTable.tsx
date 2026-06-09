'use client';

import type { ChannelData } from './ChannelSlot';

/* ── Metric Row Definition ── */
interface MetricRow {
  label: string;
  key: string;
  getValue: (data: ChannelData) => number;
  format: (n: number) => string;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('es-ES', { notation: 'compact', maximumFractionDigits: 1 }).format(n);

const fmtStandard = (n: number) =>
  new Intl.NumberFormat('es-ES').format(n);

const fmtPercent = (n: number) => `${n.toFixed(1)}%`;

const METRICS: MetricRow[] = [
  { label: 'Suscriptores',       key: 'subscribers',     getValue: (d) => d.subscribers,       format: fmt },
  { label: 'Vistas Totales',     key: 'totalViews',      getValue: (d) => d.totalViews,        format: fmt },
  { label: 'Videos Totales',     key: 'totalVideos',     getValue: (d) => d.totalVideos,       format: fmtStandard },
  { label: 'Impacto 30D',        key: 'total_views_30d', getValue: (d) => d.total_views_30d,   format: fmt },
  { label: 'Videos Largos 30D',  key: 'views30d',        getValue: (d) => d.views30d,          format: fmt },
  { label: 'Shorts 30D',         key: 'shorts_views',    getValue: (d) => d.shorts_views_30d,  format: fmt },
  { label: 'Videos publicados',  key: 'videos_30d',      getValue: (d) => d.videos_30d,        format: fmtStandard },
  { label: 'Shorts publicados',  key: 'shorts_count',    getValue: (d) => d.shorts_count_30d,  format: fmtStandard },
  { label: 'Promedio por video', key: 'average_views',   getValue: (d) => d.average_views,     format: fmt },
  { label: 'Engagement Rate',    key: 'engagement_rate', getValue: (d) => d.engagement_rate,   format: fmtPercent },
];

/* ════════════════════════════════════════════════════════════════════════════
 * ComparisonTable — Side-by-side metric comparison
 * Highlights the winning value per row in cyan.
 * ════════════════════════════════════════════════════════════════════════════ */
export function ComparisonTable({
  channelA,
  channelB,
}: {
  channelA: ChannelData;
  channelB: ChannelData;
}) {
  return (
    <div className="vl-card-dashboard border border-[var(--vl-border)] rounded-2xl bg-[var(--vl-bg-surface)]/60 backdrop-blur-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-[var(--vl-border)] bg-white/[0.01]">
        <h3 className="text-sm font-bold text-[var(--vl-text-secondary)] uppercase tracking-wider">
          Comparación Detallada
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--vl-border)]">
              <th className="text-left px-6 py-3.5 text-[10px] uppercase tracking-widest font-bold text-[var(--vl-text-tertiary)] w-[35%]">
                Métrica
              </th>
              <th className="text-right px-6 py-3.5 w-[32.5%]">
                <div className="flex items-center justify-end gap-2">
                  {channelA.avatarUrl ? (
                    <img src={channelA.avatarUrl} alt={channelA.displayName} className="w-6 h-6 rounded-full ring-1 ring-[var(--vl-border)] object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[var(--vl-bg-elevated)] border border-[var(--vl-border)] flex items-center justify-center text-[8px] font-bold text-[var(--vl-text-tertiary)]">
                      {channelA.displayName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-bold text-[var(--vl-text-primary)] truncate max-w-[120px]">{channelA.displayName}</span>
                </div>
              </th>
              <th className="text-right px-6 py-3.5 w-[32.5%]">
                <div className="flex items-center justify-end gap-2">
                  {channelB.avatarUrl ? (
                    <img src={channelB.avatarUrl} alt={channelB.displayName} className="w-6 h-6 rounded-full ring-1 ring-[var(--vl-border)] object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[var(--vl-bg-elevated)] border border-[var(--vl-border)] flex items-center justify-center text-[8px] font-bold text-[var(--vl-text-tertiary)]">
                      {channelB.displayName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-bold text-[var(--vl-text-primary)] truncate max-w-[120px]">{channelB.displayName}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {METRICS.map((metric, i) => {
              const valA = metric.getValue(channelA);
              const valB = metric.getValue(channelB);
              const aWins = valA > valB;
              const bWins = valB > valA;

              return (
                <tr
                  key={metric.key}
                  className={`border-b border-[var(--vl-border)]/50 transition-colors duration-200 hover:bg-white/[0.015] ${
                    i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.008]'
                  }`}
                >
                  <td className="px-6 py-3.5 text-[var(--vl-text-secondary)] font-semibold text-xs">
                    {metric.label}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <span
                      className={`font-bold text-sm tabular-nums ${
                        aWins
                          ? 'text-[var(--vl-cyan)]'
                          : 'text-[var(--vl-text-primary)]'
                      }`}
                    >
                      {metric.format(valA)}
                    </span>
                    {aWins && (
                      <span className="inline-block ml-1.5 w-1.5 h-1.5 rounded-full bg-[var(--vl-cyan)] animate-pulse" />
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <span
                      className={`font-bold text-sm tabular-nums ${
                        bWins
                          ? 'text-[var(--vl-cyan)]'
                          : 'text-[var(--vl-text-primary)]'
                      }`}
                    >
                      {metric.format(valB)}
                    </span>
                    {bWins && (
                      <span className="inline-block ml-1.5 w-1.5 h-1.5 rounded-full bg-[var(--vl-cyan)] animate-pulse" />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
