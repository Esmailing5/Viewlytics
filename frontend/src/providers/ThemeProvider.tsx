'use client';

import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Theme, ThemeContextValue } from '@/types/theme.types';

const STORAGE_KEY = 'viewlytics-theme';
const DEFAULT_THEME: Theme = 'dark';

/** Theme context — consumed by useTheme hook */
export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  /** Override default theme (useful for testing) */
  defaultTheme?: Theme;
}

/**
 * ThemeProvider — Manages dark/light mode state.
 *
 * - Reads initial theme from localStorage (falls back to 'dark')
 * - Applies .dark / .light class on <html>
 * - Syncs colorScheme for native scroll/input styling
 * - Persists selection to localStorage
 */
export function ThemeProvider({ children, defaultTheme }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme ?? DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);

  // Read persisted theme on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored === 'dark' || stored === 'light') {
        setThemeState(stored);
      }
    } catch {
      // localStorage unavailable (SSR / privacy mode)
    }
    setMounted(true);
  }, []);

  // Apply theme class + colorScheme to <html>
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;

    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    root.style.colorScheme = theme;

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage unavailable
    }
  }, [theme, mounted]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      isDark: theme === 'dark',
    }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
