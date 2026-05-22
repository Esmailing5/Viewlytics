'use client';

import { LIVE_CREATORS } from '@/constants/dashboard-mock-data';
import { DashboardCard } from './DashboardCard';
import { formatCount } from '@/utils/format';

/** Platform badge colors */
const PLATFORM_COLORS: Record<string, string> = {
  youtube: '#FF0000',
  twitch: '#9146FF',
  kick: '#53FC18',
  tiktok: '#00F2EA',
};

const PLATFORM_LABELS: Record<string, string> = {
  youtube: 'YT',
  twitch: 'TW',
  kick: 'KK',
  tiktok: 'TT',
};

/**
 * LiveNowPanel — List of currently live creators.
 * Shows avatar, name, platform icon, viewer count, and pulsing LIVE badge.
 */
export function LiveNowPanel() {
  return (
    <DashboardCard
      title="Live Now"
      action={
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--danger-red)]/10 text-[var(--danger-red)] text-[10px] font-bold uppercase tracking-wider">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--danger-red)] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--danger-red)]" />
          </span>
          {LIVE_CREATORS.length} Live
        </span>
      }
    >
      <div className="space-y-1 max-h-[400px] overflow-y-auto">
        {LIVE_CREATORS.map((creator) => (
          <div
            key={creator.id}
            className="
              flex items-center gap-3
              px-3 py-2.5 rounded-xl
              hover:bg-[var(--bg-main)]
              transition-colors duration-200
              cursor-pointer
            "
          >
            {/* Avatar */}
            <div
              className="
                w-9 h-9 rounded-full flex-shrink-0
                flex items-center justify-center
                text-xs font-bold text-white
              "
              style={{
                background: `linear-gradient(135deg, ${PLATFORM_COLORS[creator.platform]}, ${PLATFORM_COLORS[creator.platform]}88)`,
              }}
            >
              {creator.avatarInitials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {creator.name}
                </p>
                <span
                  className="flex-shrink-0 text-[9px] font-bold px-1 py-0.5 rounded"
                  style={{
                    color: PLATFORM_COLORS[creator.platform],
                    backgroundColor: `${PLATFORM_COLORS[creator.platform]}15`,
                  }}
                >
                  {PLATFORM_LABELS[creator.platform]}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] truncate">
                {creator.category}
              </p>
            </div>

            {/* Viewer count */}
            <div className="flex-shrink-0 text-right">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {formatCount(creator.viewers)}
              </p>
              <p className="text-[10px] text-[var(--text-secondary)]">viewers</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
