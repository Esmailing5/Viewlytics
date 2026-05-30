import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  strokeWidth?: number;
}

/**
 * AnalyticsIcon — Geometric line chart and base grids
 */
export function AnalyticsIcon({ size = 20, strokeWidth = 1.5, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="3 3" opacity="0.4" />
      <path d="M3 17h18" />
      <path d="M6 17v-4" />
      <path d="M10 17v-8" />
      <path d="M14 17V5" />
      <path d="M18 17v-6" />
      <path d="M6 13l4-4 4-4 4 6" stroke="var(--vl-red, currentColor)" strokeWidth={strokeWidth + 0.5} />
    </svg>
  );
}

/**
 * CreatorsIcon — Geometric double user community profiles
 */
export function CreatorsIcon({ size = 20, strokeWidth = 1.5, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Background Profile */}
      <circle cx="15" cy="8" r="3" opacity="0.5" />
      <path d="M10 20a6 6 0 0 1 10 0" opacity="0.5" />
      
      {/* Foreground Profile */}
      <circle cx="9" cy="9" r="4" stroke="var(--vl-red, currentColor)" />
      <path d="M3 20a6 6 0 0 1 12 0" stroke="var(--vl-red, currentColor)" />
    </svg>
  );
}

/**
 * RankingsIcon — Geometric modernist trophy/podium shape
 */
export function RankingsIcon({ size = 20, strokeWidth = 1.5, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M6 4h12v10a6 6 0 0 1-12 0V4Z" stroke="var(--vl-red, currentColor)" />
      <path d="M12 14v5" />
      <path d="M9 19h6" />
      <path d="M12 7v4" stroke="var(--vl-red, currentColor)" />
    </svg>
  );
}

/**
 * GrowthIcon — Upward geometric arrow breaking out of base grid
 */
export function GrowthIcon({ size = 20, strokeWidth = 1.5, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M4 20h16" />
      <path d="M7 16l5-5 4 4 6-8" stroke="var(--vl-red, currentColor)" strokeWidth={strokeWidth + 0.5} />
      <path d="M17 7h5v5" stroke="var(--vl-red, currentColor)" strokeWidth={strokeWidth + 0.5} />
      <circle cx="7" cy="16" r="1.5" fill="currentColor" />
      <circle cx="12" cy="11" r="1.5" fill="currentColor" />
      <circle cx="16" cy="15" r="1.5" fill="currentColor" />
    </svg>
  );
}

/**
 * SubscribersIcon — Single profile layout with broadcasting signals
 */
export function SubscribersIcon({ size = 20, strokeWidth = 1.5, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="9" cy="12" r="3.5" stroke="var(--vl-red, currentColor)" />
      <path d="M3 20a6 6 0 0 1 12 0" stroke="var(--vl-red, currentColor)" />
      {/* Concentric broadcast waves */}
      <path d="M17 9a4.5 4.5 0 0 1 0 6" />
      <path d="M20 6.5a8 8 0 0 1 0 11" opacity="0.6" />
    </svg>
  );
}

/**
 * ViewsIcon — Geometric eye using modern diamond outer shape and center lens
 */
export function ViewsIcon({ size = 20, strokeWidth = 1.5, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Eye outer geometric diamond */}
      <path d="M12 4L21 12L12 20L3 12Z" stroke="var(--vl-red, currentColor)" />
      {/* Eye lens circles */}
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
    </svg>
  );
}

/**
 * EarningsIcon — Hexagonal geometric coin/currency layout
 */
export function EarningsIcon({ size = 20, strokeWidth = 1.5, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Hexagonal container */}
      <path d="M12 2L21 7.2v9.6L12 22L3 16.8V7.2Z" stroke="var(--vl-red, currentColor)" />
      {/* Simplified geometric currency symbol */}
      <path d="M12 6v12" />
      <path d="M9.5 8.5h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3h4" />
    </svg>
  );
}

/**
 * AlertsIcon — Geometric rounded triangular warning shape
 */
export function AlertsIcon({ size = 20, strokeWidth = 1.5, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 3l10 17H2L12 3Z" stroke="var(--vl-red, currentColor)" />
      <path d="M12 8v5" />
      <circle cx="12" cy="16.5" r="1" fill="currentColor" />
    </svg>
  );
}

/**
 * TrendsIcon — Futuristic geometric lightning path
 */
export function TrendsIcon({ size = 20, strokeWidth = 1.5, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path
        d="M13 2L3 14h9l-1 8 10-12h-9l1-8Z"
        stroke="var(--vl-red, currentColor)"
        strokeWidth={strokeWidth + 0.2}
      />
    </svg>
  );
}

/**
 * PlatformsIcon — Three layered/overlapping isometric squares
 */
export function PlatformsIcon({ size = 20, strokeWidth = 1.5, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Top platform layer */}
      <path d="M12 2L2 7l10 5 10-5-10-5Z" stroke="var(--vl-red, currentColor)" />
      {/* Middle platform layer */}
      <path d="M2 12l10 5 10-5" opacity="0.7" />
      {/* Bottom platform layer */}
      <path d="M2 17l10 5 10-5" opacity="0.4" />
    </svg>
  );
}
