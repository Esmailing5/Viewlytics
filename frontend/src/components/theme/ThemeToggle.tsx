'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface ThemeToggleProps {
  /** Additional CSS classes */
  className?: string;
  /** Show label text alongside icon */
  showLabel?: boolean;
}

/**
 * ThemeToggle — Sun/Moon icon button for switching themes.
 *
 * Smooth icon transition with opacity + rotation.
 */
export function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`
        inline-flex items-center gap-2
        rounded-xl px-3 py-2
        text-[var(--vl-text-secondary)]
        hover:text-[var(--vl-text-primary)]
        hover:bg-[var(--vl-bg-surface)]
        vl-transition-fast
        ${className}
      `}
    >
      <span
        className="relative w-5 h-5 transition-transform duration-300"
        style={{ transform: isDark ? 'rotate(0deg)' : 'rotate(180deg)' }}
      >
        {isDark ? (
          <Moon className="w-5 h-5 absolute inset-0" />
        ) : (
          <Sun className="w-5 h-5 absolute inset-0" />
        )}
      </span>
      {showLabel && (
        <span className="text-sm font-medium">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
}
