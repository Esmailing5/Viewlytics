'use client';

import { useTheme } from '@/hooks/useTheme';

interface LogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  /** Logo variant: 'full' (horizontal text), 'compact' (abbreviated), 'icon' (symbol only) */
  variant?: 'full' | 'compact' | 'icon';
}

/**
 * Logo — Theme-aware SVG logo component.
 *
 * Renders inline SVG with colors that adapt to the active theme.
 * Supports full, compact, and icon-only variants.
 */
export function Logo({ className = '', width, height, variant = 'full' }: LogoProps) {
  const { isDark } = useTheme();

  const textColor = isDark ? '#FFFFFF' : '#1a1c21';
  const accentColor = isDark ? '#00c6ff' : '#3366ff';

  if (variant === 'icon') {
    return (
      <svg
        width={width ?? 40}
        height={height ?? 40}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <g transform="translate(8, 12)">
          {/* V stroke */}
          <path
            d="M0 0 L15 28 C18 34 25 36 30 31 L48 13"
            stroke={textColor}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Arrow */}
          <path
            d="M28 31 L48 5 L36 5 M48 5 L48 17"
            stroke={accentColor}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Dot */}
          <circle cx="18" cy="22" r="4" fill={accentColor} />
        </g>
      </svg>
    );
  }

  if (variant === 'compact') {
    return (
      <svg
        width={width ?? 100}
        height={height ?? 32}
        viewBox="0 0 140 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <g transform="translate(4, 6)">
          <path
            d="M0 0 L10 20 C12 24 17 25 20 22 L32 10"
            stroke={textColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M20 22 L36 2 L28 2 M36 2 L36 12"
            stroke={accentColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="13" cy="16" r="3" fill={accentColor} />
        </g>
        <text
          x="46"
          y="27"
          fontFamily="Inter, sans-serif"
          fontWeight="700"
          fontSize="20"
          fill={textColor}
          letterSpacing="-0.5"
        >
          VL
        </text>
      </svg>
    );
  }

  // Full variant
  return (
    <svg
      width={width ?? 180}
      height={height ?? 48}
      viewBox="0 0 280 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Icon (V + Arrow + Play) */}
      <g transform="translate(10, 8)">
        {/* V Left Stroke */}
        <path
          d="M0 0 L15 32 C18 38 25 40 30 35 L50 15"
          stroke={textColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Upward Arrow */}
        <path
          d="M30 35 L60 5 L45 5 M60 5 L60 20"
          stroke={accentColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Play Icon / Dot */}
        <circle cx="20" cy="25" r="5" fill={accentColor} />
      </g>

      {/* Text: View */}
      <text
        x="80"
        y="42"
        fontFamily="Inter, sans-serif"
        fontWeight="800"
        fontSize="36"
        fill={textColor}
        letterSpacing="-1"
      >
        View
      </text>

      {/* Text: lytics */}
      <text
        x="165"
        y="42"
        fontFamily="Inter, sans-serif"
        fontWeight="800"
        fontSize="36"
        fill={accentColor}
        letterSpacing="-1"
      >
        lytics
      </text>
    </svg>
  );
}
