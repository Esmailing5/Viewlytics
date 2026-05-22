'use client';

import { useContext } from 'react';
import { ThemeContext } from '@/providers/ThemeProvider';
import type { ThemeContextValue } from '@/types/theme.types';

/**
 * useTheme — Access the current theme and toggle functions.
 *
 * Must be used inside a ThemeProvider.
 *
 * @returns { theme, setTheme, toggleTheme, isDark }
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
