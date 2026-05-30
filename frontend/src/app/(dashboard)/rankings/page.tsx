'use client';

import { useState } from 'react';
import { rankingsConfig } from '@/config/rankings';
import { Trophy, Users, Eye, ArrowUp, ArrowDown, Minus, Activity, ShieldCheck, Flame, Radio, Gamepad2, Tv } from 'lucide-react';
import Link from 'next/link';

// Detailed mock data for each ranking category to make it extremely complete and realistic
interface CreatorRanking {
  rank: number;
  creatorName: string;
  slug: string;
  platform: 'youtube' | 'twitch' | 'kick';
  avatarInitials: string;
  category: string;
  subscribers: number;
  views_30d: number;
  videos_30d: number;
  growth: string;
  verified: boolean;
}

const CATEGORY_DATA: Record<string, CreatorRanking[]> = {
  'top-creators': [
    { rank: 1, creatorName: 'Alofoke Radio Show', slug: 'alofoke-radio-show', platform: 'youtube', avatarInitials: 'AR', category: 'Podcast', subscribers: 9100000, views_30d: 880000, videos_30d: 4, growth: '+12%', verified: true },
    { rank: 2, creatorName: 'Carlos Durán', slug: 'carlos-duran', platform: 'youtube', avatarInitials: 'CD', category: 'Entertainment', subscribers: 4800000, views_30d: 640000, videos_30d: 4, growth: '+8%', verified: true },
    { rank: 3, creatorName: 'Capricornio TV', slug: 'capricornio-tv', platform: 'youtube', avatarInitials: 'CT', category: 'Interviews', subscribers: 3100000, views_30d: 480000, videos_30d: 4, growth: '+15%', verified: true },
    { rank: 4, creatorName: 'El Dotol Nastra', slug: 'el-dotol-nastra', platform: 'youtube', avatarInitials: 'DN', category: 'Podcast', subscribers: 2400000, views_30d: 400000, videos_30d: 4, growth: '+10%', verified: false },
    { rank: 5, creatorName: 'Mata Lluvia', slug: 'mata-lluvia', platform: 'twitch', avatarInitials: 'ML', category: 'Gaming', subscribers: 850000, views_30d: 150000, videos_30d: 3, growth: '+25%', verified: false },
    { rank: 6, creatorName: 'Manny Viloria', slug: 'manny-viloria', platform: 'youtube', avatarInitials: 'MV', category: 'Podcast', subscribers: 890000, views_30d: 480000, videos_30d: 4, growth: '+21%', verified: false },
    { rank: 7, creatorName: 'El Pachá Oficial', slug: 'el-pacha', platform: 'youtube', avatarInitials: 'EP', category: 'Entertainment', subscribers: 1200000, views_30d: 650000, videos_30d: 5, growth: '+5%', verified: true },
    { rank: 8, creatorName: 'Nidea Reynoso', slug: 'nidea-reynoso', platform: 'twitch', avatarInitials: 'NR', category: 'IRL', subscribers: 540000, views_30d: 950000, videos_30d: 10, growth: '+18%', verified: false },
    { rank: 9, creatorName: 'RD Gamers', slug: 'rd-gamers', platform: 'kick', avatarInitials: 'RG', category: 'Gaming', subscribers: 380000, views_30d: 420000, videos_30d: 6, growth: '+30%', verified: false },
    { rank: 10, creatorName: 'StreamersRD', slug: 'streamers-rd', platform: 'twitch', avatarInitials: 'SR', category: 'Gaming', subscribers: 290000, views_30d: 310000, videos_30d: 5, growth: '+28%', verified: false },
  ],
  'top-growth': [
    { rank: 1, creatorName: 'RD Gamers', slug: 'rd-gamers', platform: 'kick', avatarInitials: 'RG', category: 'Gaming', subscribers: 380000, views_30d: 420000, videos_30d: 6, growth: '+30%', verified: false },
    { rank: 2, creatorName: 'StreamersRD', slug: 'streamers-rd', platform: 'twitch', avatarInitials: 'SR', category: 'Gaming', subscribers: 290000, views_30d: 310000, videos_30d: 5, growth: '+28%', verified: false },
    { rank: 3, creatorName: 'Mata Lluvia', slug: 'mata-lluvia', platform: 'twitch', avatarInitials: 'ML', category: 'Gaming', subscribers: 850000, views_30d: 150000, videos_30d: 3, growth: '+25%', verified: false },
    { rank: 4, creatorName: 'Manny Viloria', slug: 'manny-viloria', platform: 'youtube', avatarInitials: 'MV', category: 'Podcast', subscribers: 890000, views_30d: 480000, videos_30d: 4, growth: '+21%', verified: false },
    { rank: 5, creatorName: 'Nidea Reynoso', slug: 'nidea-reynoso', platform: 'twitch', avatarInitials: 'NR', category: 'IRL', subscribers: 540000, views_30d: 950000, videos_30d: 10, growth: '+18%', verified: false },
    { rank: 6, creatorName: 'Capricornio TV', slug: 'capricornio-tv', platform: 'youtube', avatarInitials: 'CT', category: 'Interviews', subscribers: 3100000, views_30d: 480000, videos_30d: 4, growth: '+15%', verified: true },
    { rank: 7, creatorName: 'Alofoke Radio Show', slug: 'alofoke-radio-show', platform: 'youtube', avatarInitials: 'AR', category: 'Podcast', subscribers: 9100000, views_30d: 880000, videos_30d: 4, growth: '+12%', verified: true },
    { rank: 8, creatorName: 'El Dotol Nastra', slug: 'el-dotol-nastra', platform: 'youtube', avatarInitials: 'DN', category: 'Podcast', subscribers: 2400000, views_30d: 400000, videos_30d: 4, growth: '+10%', verified: false },
    { rank: 9, creatorName: 'Carlos Durán', slug: 'carlos-duran', platform: 'youtube', avatarInitials: 'CD', category: 'Entertainment', subscribers: 4800000, views_30d: 640000, videos_30d: 4, growth: '+8%', verified: true },
    { rank: 10, creatorName: 'El Pachá Oficial', slug: 'el-pacha', platform: 'youtube', avatarInitials: 'EP', category: 'Entertainment', subscribers: 1200000, views_30d: 650000, videos_30d: 5, growth: '+5%', verified: true },
  ],
  'top-podcasts': [
    { rank: 1, creatorName: 'Alofoke Radio Show', slug: 'alofoke-radio-show', platform: 'youtube', avatarInitials: 'AR', category: 'Podcast', subscribers: 9100000, views_30d: 880000, videos_30d: 4, growth: '+12%', verified: true },
    { rank: 2, creatorName: 'El Dotol Nastra', slug: 'el-dotol-nastra', platform: 'youtube', avatarInitials: 'DN', category: 'Podcast', subscribers: 2400000, views_30d: 400000, videos_30d: 4, growth: '+10%', verified: false },
    { rank: 3, creatorName: 'Manny Viloria', slug: 'manny-viloria', platform: 'youtube', avatarInitials: 'MV', category: 'Podcast', subscribers: 890000, views_30d: 480000, videos_30d: 4, growth: '+21%', verified: false },
    { rank: 4, creatorName: 'Nidea Reynoso', slug: 'nidea-reynoso', platform: 'twitch', avatarInitials: 'NR', category: 'IRL', subscribers: 540000, views_30d: 950000, videos_30d: 10, growth: '+18%', verified: false },
    { rank: 5, creatorName: 'El Circo Podcast', slug: 'creator-001', platform: 'youtube', avatarInitials: 'EC', category: 'Podcast', subscribers: 1400000, views_30d: 640000, videos_30d: 4, growth: '+12%', verified: false },
  ],
  'top-gaming': [
    { rank: 1, creatorName: 'Mata Lluvia', slug: 'mata-lluvia', platform: 'twitch', avatarInitials: 'ML', category: 'Gaming', subscribers: 850000, views_30d: 150000, videos_30d: 3, growth: '+25%', verified: false },
    { rank: 2, creatorName: 'RD Gamers', slug: 'rd-gamers', platform: 'kick', avatarInitials: 'RG', category: 'Gaming', subscribers: 380000, views_30d: 420000, videos_30d: 6, growth: '+30%', verified: false },
    { rank: 3, creatorName: 'StreamersRD', slug: 'streamers-rd', platform: 'twitch', avatarInitials: 'SR', category: 'Gaming', subscribers: 290000, views_30d: 310000, videos_30d: 5, growth: '+28%', verified: false },
    { rank: 4, creatorName: 'Carlos Durán', slug: 'carlos-duran', platform: 'youtube', avatarInitials: 'CD', category: 'Entertainment', subscribers: 4800000, views_30d: 640000, videos_30d: 4, growth: '+8%', verified: true },
    { rank: 5, creatorName: 'Capricornio TV', slug: 'capricornio-tv', platform: 'youtube', avatarInitials: 'CT', category: 'Interviews', subscribers: 3100000, views_30d: 480000, videos_30d: 4, growth: '+15%', verified: true },
  ],
  'top-streamers': [
    { rank: 1, creatorName: 'StreamersRD', slug: 'streamers-rd', platform: 'twitch', avatarInitials: 'SR', category: 'Gaming', subscribers: 290000, views_30d: 310000, videos_30d: 5, growth: '+28%', verified: false },
    { rank: 2, creatorName: 'Mata Lluvia', slug: 'mata-lluvia', platform: 'twitch', avatarInitials: 'ML', category: 'Gaming', subscribers: 850000, views_30d: 150000, videos_30d: 3, growth: '+25%', verified: false },
    { rank: 3, creatorName: 'RD Gamers', slug: 'rd-gamers', platform: 'kick', avatarInitials: 'RG', category: 'Gaming', subscribers: 380000, views_30d: 420000, videos_30d: 6, growth: '+30%', verified: false },
    { rank: 4, creatorName: 'Alofoke Radio Show', slug: 'alofoke-radio-show', platform: 'youtube', avatarInitials: 'AR', category: 'Podcast', subscribers: 9100000, views_30d: 880000, videos_30d: 4, growth: '+12%', verified: true },
    { rank: 5, creatorName: 'Manny Viloria', slug: 'manny-viloria', platform: 'youtube', avatarInitials: 'MV', category: 'Podcast', subscribers: 890000, views_30d: 480000, videos_30d: 4, growth: '+21%', verified: false },
  ],
};

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  'top-creators': <Trophy className="w-4 h-4" />,
  'top-growth': <Flame className="w-4 h-4" />,
  'top-podcasts': <Radio className="w-4 h-4" />,
  'top-gaming': <Gamepad2 className="w-4 h-4" />,
  'top-streamers': <Tv className="w-4 h-4" />,
};

export default function RankingsPage() {
  const [activeCategory, setActiveCategory] = useState<string>(rankingsConfig.defaultCategory);

  const creators = CATEGORY_DATA[activeCategory] || [];
  
  // Split data into Top 3 podium format, and remaining elements for table
  const top3 = [
    creators[1], // #2 Left
    creators[0], // #1 Center
    creators[2], // #3 Right
  ].filter(Boolean);

  const remaining = creators.slice(3);

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
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      
      {/* ─── Hero Section ─── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-[var(--vl-border)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--vl-red-soft)] border border-[rgba(255,59,48,0.15)] mb-3">
            <Activity className="w-3.5 h-3.5 text-[var(--vl-red)]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--vl-red)]">
              Auditoría en Tiempo Real
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-[var(--vl-text-primary)] tracking-tight">
            Clasificaciones Globales
          </h1>
          <p className="text-[var(--vl-text-secondary)] mt-2 max-w-xl text-sm md:text-base font-medium">
            El ranking definitivo de los creadores más influyentes en la República Dominicana. Filtra por categoría y explora estadísticas de rendimiento.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[var(--vl-bg-surface)]/60 backdrop-blur border border-[var(--vl-border)] px-4 py-2.5 rounded-2xl">
          <span className="flex h-2.5 w-2.5 rounded-full bg-[var(--vl-success)] animate-pulse" />
          <p className="text-xs font-bold text-[var(--vl-text-secondary)] uppercase tracking-wider">
            Actualizado: Hoy 09:00 AM
          </p>
        </div>
      </div>

      {/* ─── Category Selection Tabs ─── */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[var(--vl-border)]/40">
        {rankingsConfig.categories.map((cat) => {
          const isActive = cat.id === activeCategory;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shrink-0 border ${
                isActive
                  ? 'bg-[var(--vl-red)] text-white border-[var(--vl-red)] shadow-md shadow-[var(--vl-red)]/15 scale-[1.02]'
                  : 'bg-[var(--vl-bg-surface)]/50 text-[var(--vl-text-secondary)] border-[var(--vl-border)] hover:text-[var(--vl-text-primary)] hover:border-[var(--vl-border-hover)]'
              }`}
            >
              {CATEGORY_ICON_MAP[cat.id]}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── Top 3 Podium (Larger devices) ─── */}
      <div className="hidden md:grid grid-cols-3 gap-6 items-end max-w-4xl mx-auto pt-6">
        
        {/* #2 Rank (Left) */}
        {top3[0] && (
          <Link href={`/channel/${top3[0].platform}/${top3[0].slug}`} className="vl-podium-card vl-podium-2nd group">
            <div className="vl-podium-glow" />
            <span className="vl-podium-badge">#2</span>
            
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl bg-slate-300/10 border border-slate-300/20 text-slate-300 shadow-inner group-hover:scale-105 transition-transform duration-300">
              {top3[0].avatarInitials}
            </div>

            <div className="mt-4 text-center w-full min-w-0">
              <h3 className="font-black text-base text-[var(--vl-text-primary)] truncate group-hover:text-[var(--vl-red)] transition-colors flex items-center justify-center gap-1">
                {top3[0].creatorName}
                {top3[0].verified && <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0 fill-blue-500/10" />}
              </h3>
              <p className="text-[10px] font-bold text-[var(--vl-text-secondary)] uppercase mt-1">
                {top3[0].category}
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-[var(--vl-border)]/40 w-full grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-[9px] font-bold text-[var(--vl-text-tertiary)] uppercase">Followers</p>
                <p className="text-sm font-black text-[var(--vl-text-primary)] mt-0.5">{formatStat(top3[0].subscribers)}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-[var(--vl-text-tertiary)] uppercase">Vistas (30d)</p>
                <p className="text-sm font-black text-[var(--vl-text-primary)] mt-0.5">{formatStat(top3[0].videos_30d > 0 ? top3[0].views_30d / top3[0].videos_30d : 0)}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-[var(--vl-text-tertiary)] uppercase">Crecimiento</p>
                <p className="text-sm font-bold text-[var(--vl-success)] mt-0.5">{top3[0].growth}</p>
              </div>
            </div>
          </Link>
        )}

        {/* #1 Rank (Center - Highlighted) */}
        {top3[1] && (
          <Link href={`/channel/${top3[1].platform}/${top3[1].slug}`} className="vl-podium-card vl-podium-1st group scale-[1.04]">
            <div className="vl-podium-glow" />
            <span className="vl-podium-badge">#1</span>
            
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-2xl bg-yellow-500/15 border-2 border-yellow-500/35 text-yellow-500 shadow-xl shadow-yellow-500/5 group-hover:scale-105 transition-transform duration-300">
              {top3[1].avatarInitials}
            </div>

            <div className="mt-5 text-center w-full min-w-0">
              <h3 className="font-black text-lg text-[var(--vl-text-primary)] truncate group-hover:text-[var(--vl-red)] transition-colors flex items-center justify-center gap-1.5">
                {top3[1].creatorName}
                {top3[1].verified && <ShieldCheck className="w-4.5 h-4.5 text-blue-500 shrink-0 fill-blue-500/10" />}
              </h3>
              <p className="text-[11px] font-black text-yellow-500 uppercase tracking-wide mt-1">
                {top3[1].category}
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-[var(--vl-border)]/40 w-full grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-[9px] font-bold text-[var(--vl-text-tertiary)] uppercase">Followers</p>
                <p className="text-base font-black text-[var(--vl-text-primary)] mt-0.5">{formatStat(top3[1].subscribers)}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-[var(--vl-text-tertiary)] uppercase">Vistas (30d)</p>
                <p className="text-base font-black text-[var(--vl-text-primary)] mt-0.5">{formatStat(top3[1].videos_30d > 0 ? top3[1].views_30d / top3[1].videos_30d : 0)}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-[var(--vl-text-tertiary)] uppercase">Crecimiento</p>
                <p className="text-base font-bold text-[var(--vl-success)] mt-0.5">{top3[1].growth}</p>
              </div>
            </div>
          </Link>
        )}

        {/* #3 Rank (Right) */}
        {top3[2] && (
          <Link href={`/channel/${top3[2].platform}/${top3[2].slug}`} className="vl-podium-card vl-podium-3rd group">
            <div className="vl-podium-glow" />
            <span className="vl-podium-badge">#3</span>
            
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl bg-amber-600/10 border border-amber-600/20 text-amber-600 shadow-inner group-hover:scale-105 transition-transform duration-300">
              {top3[2].avatarInitials}
            </div>

            <div className="mt-4 text-center w-full min-w-0">
              <h3 className="font-black text-base text-[var(--vl-text-primary)] truncate group-hover:text-[var(--vl-red)] transition-colors flex items-center justify-center gap-1">
                {top3[2].creatorName}
                {top3[2].verified && <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0 fill-blue-500/10" />}
              </h3>
              <p className="text-[10px] font-bold text-[var(--vl-text-secondary)] uppercase mt-1">
                {top3[2].category}
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-[var(--vl-border)]/40 w-full grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-[9px] font-bold text-[var(--vl-text-tertiary)] uppercase">Followers</p>
                <p className="text-sm font-black text-[var(--vl-text-primary)] mt-0.5">{formatStat(top3[2].subscribers)}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-[var(--vl-text-tertiary)] uppercase">Vistas (30d)</p>
                <p className="text-sm font-black text-[var(--vl-text-primary)] mt-0.5">{formatStat(top3[2].videos_30d > 0 ? top3[2].views_30d / top3[2].videos_30d : 0)}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-[var(--vl-text-tertiary)] uppercase">Crecimiento</p>
                <p className="text-sm font-bold text-[var(--vl-success)] mt-0.5">{top3[2].growth}</p>
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* ─── Mobile Top 3 View ─── */}
      <div className="md:hidden space-y-3 mb-6">
        {creators.slice(0, 3).map((entry) => {
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
                      {entry.verified && <ShieldCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />}
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
      <div className="md:hidden space-y-3">
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

      {/* ─── Remaining Leaderboard Table (#4+ - Desktop) ─── */}
      <div className="hidden md:block border border-[var(--vl-border)] rounded-3xl overflow-hidden bg-[var(--vl-bg-surface)]/30 backdrop-blur-md shadow-xl">
        <div className="vl-rankings-scroll-container">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-[var(--vl-border)] bg-[var(--vl-bg-surface)]/50">
                <th className="p-5 pl-8 text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider w-20">Posición</th>
                <th className="p-5 text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider">Creador</th>
                <th className="p-5 text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider text-right">Plataforma</th>
                <th className="p-5 text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider text-right">Seguidores</th>
                <th className="p-5 text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider text-right">Vistas (30d)</th>
                <th className="p-5 text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider text-right w-36 pr-8">Crecimiento / Tendencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--vl-border)]">
              {remaining.map((entry) => (
                <tr 
                  key={entry.rank}
                  className="vl-broadcast-row hover:bg-white/[0.015] dark:hover:bg-white/[0.015] transition-colors duration-200 cursor-pointer group"
                  onClick={() => window.location.href = `/channel/${entry.platform}/${entry.slug}`}
                >
                  <td className="p-5 pl-8">
                    <span className="vl-broadcast-number text-[var(--vl-text-secondary)] group-hover:text-[var(--vl-red)] transition-colors">
                      #{entry.rank}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm bg-[var(--vl-bg-surface)] border border-[var(--vl-border)] text-[var(--vl-text-primary)] shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
                        {entry.avatarInitials}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm md:text-base text-[var(--vl-text-primary)] group-hover:text-[var(--vl-red)] transition-colors flex items-center gap-1">
                          {entry.creatorName}
                          {entry.verified && <ShieldCheck className="w-4 h-4 text-blue-500 fill-blue-500/10" />}
                        </h4>
                        <p className="text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider mt-0.5">
                          {entry.platform}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <span className={`text-xs font-black uppercase tracking-wider ${
                      entry.platform === 'youtube' ? 'text-red-500' :
                      entry.platform === 'twitch' ? 'text-purple-500' : 'text-green-500'
                    }`}>
                      {entry.platform}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <span className="text-sm font-black text-[var(--vl-text-primary)] tracking-tight">
                      {formatStat(entry.subscribers)}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <span className="text-sm font-black text-[var(--vl-text-primary)] tracking-tight">
                      {formatStat(entry.videos_30d > 0 ? entry.views_30d / entry.videos_30d : 0)}
                    </span>
                  </td>
                  <td className="p-5 text-right pr-8">
                    <div className="inline-flex items-center gap-2.5 justify-end">
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
  );
}
