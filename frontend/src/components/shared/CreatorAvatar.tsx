/**
 * Viewlytics — CreatorAvatar
 *
 * Avatar reutilizable para creadores con badge de plataforma opcional.
 * Genera iniciales a partir del nombre cuando no hay imagen disponible.
 *
 * @example
 * <CreatorAvatar name="El Circo Podcast" platform="youtube" size="lg" />
 */

'use client';

import { YoutubeIcon } from '@/components/shared/SocialIcons';

interface CreatorAvatarProps {
  /** Nombre del creador (para generar iniciales) */
  name: string;
  /** URL de imagen del avatar (opcional) */
  imageUrl?: string;
  /** Plataforma del creador para mostrar badge */
  platform?: 'youtube' | 'twitch' | 'kick';
  /** Tamaño del avatar */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Rango de ranking (opcional, se muestra sobre el avatar) */
  rank?: number;
}

const SIZE_MAP = {
  xs: { container: 'w-8 h-8', text: 'text-xs', badge: 'w-3 h-3', badgeIcon: 'w-2 h-2' },
  sm: { container: 'w-10 h-10', text: 'text-sm', badge: 'w-4 h-4', badgeIcon: 'w-2.5 h-2.5' },
  md: { container: 'w-12 h-12', text: 'text-base', badge: 'w-5 h-5', badgeIcon: 'w-3 h-3' },
  lg: { container: 'w-16 h-16', text: 'text-xl', badge: 'w-6 h-6', badgeIcon: 'w-3.5 h-3.5' },
  xl: { container: 'w-20 h-20', text: 'text-2xl', badge: 'w-7 h-7', badgeIcon: 'w-4 h-4' },
};

/** Genera color de fondo determinístico basado en el nombre */
function getAvatarColor(name: string): string {
  const colors = [
    'from-[var(--vl-red)] to-[var(--vl-red-hover)]',
    'from-[var(--vl-cyan)] to-[var(--vl-cyan-hover)]',
    'from-[var(--vl-purple)] to-[var(--vl-purple-hover)]',
    'from-[var(--vl-success)] to-emerald-400',
    'from-rose-600 to-rose-400',
    'from-[var(--vl-warning)] to-amber-400',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

/** Genera iniciales a partir del nombre del creador */
function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

/**
 * CreatorAvatar — Avatar de creador con gradiente de iniciales y badge de plataforma.
 */
export function CreatorAvatar({
  name,
  imageUrl,
  platform = 'youtube',
  size = 'md',
  rank,
}: CreatorAvatarProps) {
  const sizeStyle = SIZE_MAP[size];
  const avatarColor = getAvatarColor(name);
  const initials = getInitials(name);

  return (
    <div className="relative inline-flex flex-shrink-0">
      {/* Avatar principal */}
      <div
        className={`
          ${sizeStyle.container}
          rounded-full flex items-center justify-center
          bg-gradient-to-br ${avatarColor}
          font-bold text-white ${sizeStyle.text}
          ring-2 ring-[var(--vl-border)]
          overflow-hidden
        `}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {/* Badge de plataforma */}
      {platform === 'youtube' && (
        <div
          className={`
            absolute -bottom-0.5 -right-0.5
            ${sizeStyle.badge}
            rounded-full bg-red-600
            flex items-center justify-center
            ring-2 ring-[var(--vl-bg-primary)]
          `}
        >
          <YoutubeIcon className={`${sizeStyle.badgeIcon} text-white`} />
        </div>
      )}

      {/* Badge de ranking */}
      {rank !== undefined && (
        <div
          className="
            absolute -top-1 -left-1
            min-w-5 h-5 px-1
            rounded-full bg-[var(--vl-red)]
            flex items-center justify-center
            text-[10px] font-bold text-white
            ring-2 ring-[var(--vl-bg-primary)]
          "
        >
          #{rank}
        </div>
      )}
    </div>
  );
}
