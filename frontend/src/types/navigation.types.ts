/**
 * Viewlytics — Tipos de Navegación
 *
 * Definiciones de tipo para el sistema de configuración de navegación.
 * Controla elementos de la barra de navegación, enlaces del pie de página y grupos de menús.
 * Toda la navegación se basa en la configuración para soportar futuras integraciones con CMS.
 *
 * @see config/navigation.ts — Valores de navegación en tiempo de ejecución
 * @see execution-pack/03-configuration-system.md — Arquitectura de configuración
 */

/**
 * Elemento de navegación individual.
 * Representa un enlace en la barra de navegación, barra lateral o pie de página.
 */
export interface NavigationItem {
  /** Identificador único para el elemento de navegación */
  readonly id: string;
  /** Etiqueta de visualización */
  readonly label: string;
  /** Ruta de la página o URL externa */
  readonly href: string;
  /** Nombre opcional del icono de Lucide */
  readonly icon?: string;
  /** Indica si este enlace se abre en una pestaña nueva */
  readonly external?: boolean;
  /** Indica si este elemento está actualmente habilitado */
  readonly enabled: boolean;
  /** Texto del distintivo/badge (ej. "Nuevo", "Beta") */
  readonly badge?: string;
}

/**
 * Elementos de navegación agrupados.
 * Se utiliza para las columnas del pie de página y secciones de la barra lateral.
 */
export interface NavigationGroup {
  /** Título de visualización del grupo */
  readonly title: string;
  /** Elementos dentro de este grupo */
  readonly items: readonly NavigationItem[];
}

/**
 * Configuración completa de navegación.
 * Define todas las superficies de navegación en toda la plataforma.
 */
export interface NavigationConfig {
  /** Elementos principales de la barra de navegación (barra superior) */
  readonly navbar: readonly NavigationItem[];
  /** Grupos de enlaces del pie de página organizados por columna */
  readonly footer: readonly NavigationGroup[];
  /** Enlaces de redes sociales */
  readonly social: readonly NavigationItem[];
}
