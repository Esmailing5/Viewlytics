import React from 'react';

interface LogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export function Logo({ className = '', width = 180, height = 48 }: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 280 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* ── Icon (V + Arrow + Play) ── */}
      <g transform="translate(10, 8)">
        {/* V Left Stroke */}
        <path
          d="M0 0 L15 32 C18 38 25 40 30 35 L50 15"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Upward Arrow (Orange) */}
        <path
          d="M30 35 L60 5 L45 5 M60 5 L60 20"
          stroke="#FF7A00"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Play Icon / Dot */}
        <circle cx="20" cy="25" r="5" fill="#FF7A00" />
      </g>

      {/* ── Text: View ── */}
      <text
        x="80"
        y="42"
        fontFamily="Inter, sans-serif"
        fontWeight="800"
        fontSize="36"
        fill="#FFFFFF"
        letterSpacing="-1"
      >
        View
      </text>

      {/* ── Text: lytics ── */}
      <text
        x="165"
        y="42"
        fontFamily="Inter, sans-serif"
        fontWeight="800"
        fontSize="36"
        fill="#FF7A00"
        letterSpacing="-1"
      >
        lytics
      </text>
    </svg>
  );
}
