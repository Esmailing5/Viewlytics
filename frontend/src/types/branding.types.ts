/**
 * Viewlytics — Tipos de Marca
 *
 * Definiciones de tipo para el sistema de configuración de marca.
 * Estos tipos aseguran la consistencia en todos los valores de configuración de marca,
 * garantizando la seguridad de tipos para colores, gradientes, tipografía y marcas de agua.
 *
 * @see config/branding.ts — Valores de marca en tiempo de ejecución
 * @see execution-pack/04-design-system.md — Especificación de diseño
 * @see execution-pack/12-branding-system.md — Reglas de identidad de marca
 */

/** Cadena de color hexadecimal (ej. '#FF7A00') */
export type HexColor = `#${string}`;

/**
 * Paleta de colores principal de la marca.
 * Estos cuatro colores definen toda la identidad visual de Viewlytics.
 */
export interface BrandColors {
  /** Deep Navy — fondos, barra de navegación, superficies de paneles */
  readonly deepNavy: HexColor;
  /** Premium Blue — superficies secundarias, estados hover, gradientes */
  readonly premiumBlue: HexColor;
  /** Accent Orange — botones CTA, destacados, indicadores de crecimiento */
  readonly accentOrange: HexColor;
  /** Soft White — tipografía, iconos, superficies limpias */
  readonly softWhite: HexColor;
}

/**
 * Variantes de color extendidas para estados interactivos.
 * Proporciona variaciones hover, active y muted de los colores de la marca.
 */
export interface BrandColorVariants {
  readonly accentOrangeHover: HexColor;
  readonly accentOrangeActive: HexColor;
  readonly softWhiteMuted: HexColor;
  readonly surfaceElevated: HexColor;
}

/**
 * Definición del gradiente de la marca.
 * Cada gradiente tiene un nombre, valor CSS y contexto de uso previsto.
 */
export interface BrandGradient {
  readonly name: string;
  readonly value: string;
  readonly usage: string;
}

/**
 * Configuración de tipografía.
 * Controla las familias de fuentes y los pesos en toda la plataforma.
 */
export interface BrandTypography {
  readonly fontFamily: string;
  readonly headingFamily: string;
  readonly monoFamily: string;
  readonly weights: {
    readonly regular: number;
    readonly medium: number;
    readonly semibold: number;
    readonly bold: number;
  };
}

/**
 * Configuración de la marca de agua para el sistema de exportación.
 * Todo el contenido exportado debe incluir la marca de agua de Viewlytics.
 */
export interface BrandWatermark {
  readonly text: string;
  readonly position: 'bottom-left' | 'bottom-right' | 'bottom-center';
  readonly opacity: number;
}

/**
 * Configuración de logotipos para diferentes contextos.
 * Admite múltiples tamaños y fondos para uso adaptativo (responsive).
 */
export interface BrandLogo {
  readonly primary: string;
  readonly favicon: string;
  readonly alt: string;
}

/**
 * Configuración completa de marca.
 * Fuente única de verdad para todos los valores relacionados con la marca.
 */
export interface BrandConfig {
  readonly name: string;
  readonly regionalName: string;
  readonly tagline: string;
  readonly colors: BrandColors;
  readonly colorVariants: BrandColorVariants;
  readonly gradients: readonly BrandGradient[];
  readonly typography: BrandTypography;
  readonly watermark: BrandWatermark;
  readonly logo: BrandLogo;
}
