/**
 * Viewlytics — Branding Configuration (Phase 1.5)
 *
 * Single source of truth for all brand assets, colors, and tokens.
 * Updated to new Phase 1.5 SaaS palette while maintaining interface compat.
 *
 * @see types/branding.types.ts — Type definitions
 */

import type { BrandConfig } from '@/types';

/** Complete brand config — import as `brandConfig` across the app */
export const brandConfig: BrandConfig = {
  name: 'Viewlytics',
  regionalName: 'Viewlytics RD',
  tagline: 'Analytics for Streams & Video',

  colors: {
    deepNavy: '#0b0e14',
    premiumBlue: '#161b22',
    accentOrange: '#0072ff',
    softWhite: '#ffffff',
  },

  colorVariants: {
    accentOrangeHover: '#00c6ff',
    accentOrangeActive: '#6e45e2',
    softWhiteMuted: '#8b949e',
    surfaceElevated: '#161b22',
  },

  gradients: [
    {
      name: 'brand',
      value: 'linear-gradient(135deg, #0b0e14 0%, #161b22 50%, #0b0e14 100%)',
      usage: 'Dashboard backgrounds, main sections',
    },
    {
      name: 'accent',
      value: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
      usage: 'Primary buttons, accent indicators',
    },
    {
      name: 'purple',
      value: 'linear-gradient(135deg, #0072ff 0%, #6e45e2 100%)',
      usage: 'Chart gradients, secondary accents',
    },
  ],

  typography: {
    fontFamily: 'Inter, sans-serif',
    headingFamily: 'Inter, sans-serif',
    monoFamily: 'Geist Mono, monospace',
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  watermark: {
    text: 'Powered by Viewlytics',
    position: 'bottom-center',
    opacity: 0.6,
  },

  logo: {
    primary: '/branding/logo-horizontalF.png',
    favicon: '/branding/logo-icon.png',
    alt: 'Viewlytics — Analytics for Streams & Video',
  },
};

/**
 * Logo asset paths — theme-aware variants.
 * The Logo component uses these to swap based on active theme.
 */
export const logoAssets = {
  horizontal: '/branding/logo-horizontalF.png',
  icon: '/branding/logo-icon.png',
  white: '/branding/logo-white.png',
} as const;

/** Legacy alias */
export const branding = brandConfig;
