/**
 * Viewlytics — Configuración de Marca (Branding Config)
 *
 * Fuente única de verdad para todos los assets, colores y tokens de marca.
 * Importa desde aquí para garantizar coherencia de marca en toda la plataforma.
 *
 * Matches the BrandConfig interface from @/types/branding.types.ts
 *
 * @see execution-pack/12-branding-system.md — Reglas del sistema de marca
 * @see execution-pack/04-design-system.md — Sistema de diseño
 */

import type { BrandConfig } from '@/types';

/** Config de marca completa — importa como `brandConfig` en toda la app */
export const brandConfig: BrandConfig = {
  name: 'Viewlytics',
  regionalName: 'Viewlytics RD',
  tagline: 'Inteligencia Analítica de Creadores',

  colors: {
    deepNavy: '#071426',
    premiumBlue: '#0F2747',
    accentOrange: '#FF7A00',
    softWhite: '#F5F7FA',
  },

  colorVariants: {
    accentOrangeHover: '#FF9A33',
    accentOrangeActive: '#E56D00',
    softWhiteMuted: '#B8C4D4',
    surfaceElevated: '#0A1B35',
  },

  gradients: [
    {
      name: 'brand',
      value: 'linear-gradient(135deg, #071426 0%, #0F2747 50%, #071426 100%)',
      usage: 'Hero backgrounds, main sections',
    },
    {
      name: 'accent',
      value: 'linear-gradient(135deg, #FF7A00 0%, #FF9A33 100%)',
      usage: 'CTA buttons, growth indicators',
    },
    {
      name: 'text',
      value: 'linear-gradient(135deg, #F5F7FA 0%, #FF7A00 50%, #F5F7FA 100%)',
      usage: 'Gradient text headings',
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
    text: 'Desarrollado por Viewlytics',
    position: 'bottom-center',
    opacity: 0.6,
  },

  logo: {
    primary: '/branding/logo-horizontalF.png',
    favicon: '/branding/logo-icon.png',
    alt: 'Viewlytics — Inteligencia Analítica de Creadores',
  },
};

/**
 * Shortcuts para rutas de logo — para compatibilidad con componentes que
 * referencian brandConfig.logos directamente.
 */
export const logoAssets = {
  horizontal: '/branding/logo-horizontalF.png',
  icon: '/branding/logo-icon.png',
  white: '/branding/logo-white.png',
} as const;

/** Alias legacy */
export const branding = brandConfig;