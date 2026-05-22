/**
 * Viewlytics — Theme Types
 *
 * Type definitions for the theme system.
 * Supports dark/light mode switching with persistent localStorage.
 *
 * @see providers/ThemeProvider.tsx — Runtime provider
 * @see hooks/useTheme.ts — Consumer hook
 */

/** Supported theme modes */
export type Theme = 'dark' | 'light';

/** Theme context value exposed by ThemeProvider */
export interface ThemeContextValue {
  /** Current active theme */
  readonly theme: Theme;
  /** Set a specific theme */
  readonly setTheme: (theme: Theme) => void;
  /** Toggle between dark and light */
  readonly toggleTheme: () => void;
  /** Convenience boolean — true when theme === 'dark' */
  readonly isDark: boolean;
}
