/**
 * Viewlytics — Configuración de Navegación
 *
 * Controla todas las superficies de navegación: barra de navegación, pie de página y enlaces sociales.
 * La navegación se basa completamente en la configuración para soportar futuras integraciones con CMS
 * y modificaciones del panel de administración sin cambios de código.
 *
 * @see types/navigation.types.ts — Definiciones de tipo
 * @see execution-pack/03-configuration-system.md — Arquitectura de configuración
 */

import type { NavigationConfig } from '@/types';

export const navigationConfig: NavigationConfig = {
  /**
   * Elementos de la barra de navegación principal: se muestran en la barra de navegación superior.
   * El orden determina el orden de visualización. Los elementos desactivados se ocultan.
   */
  navbar: [
    {
      id: 'home',
      label: 'Inicio',
      href: '/',
      enabled: true,
    },
    {
      id: 'rankings',
      label: 'Rankings',
      href: '/rankings',
      enabled: true,
    },
    {
      id: 'trending',
      label: 'Tendencias',
      href: '/trending',
      enabled: true,
      badge: 'Nuevo',
    },
    {
      id: 'about',
      label: 'Acerca de',
      href: '/about',
      enabled: true,
    },
  ],

  /**
   * Grupos de enlaces del pie de página: organizados por columna.
   * Cada grupo tiene un título y una lista de elementos.
   */
  footer: [
    {
      title: 'Plataforma',
      items: [
        { id: 'footer-rankings', label: 'Rankings', href: '/rankings', enabled: true },
        { id: 'footer-trending', label: 'Tendencias', href: '/trending', enabled: true },
        { id: 'footer-search', label: 'Buscar', href: '/search', enabled: true },
      ],
    },
    {
      title: 'Compañía',
      items: [
        { id: 'footer-about', label: 'Acerca de', href: '/about', enabled: true },
        { id: 'footer-contact', label: 'Contacto', href: '/contact', enabled: true },
        { id: 'footer-blog', label: 'Blog', href: '/blog', enabled: false },
      ],
    },
    {
      title: 'Legal',
      items: [
        { id: 'footer-privacy', label: 'Privacidad', href: '/privacy', enabled: true },
        { id: 'footer-terms', label: 'Términos', href: '/terms', enabled: true },
      ],
    },
  ],

  /**
   * Enlaces de redes sociales: se muestran en el pie de página y posiblemente en la barra de navegación.
   * Los enlaces externos se abren en pestañas nuevas.
   */
  social: [
    {
      id: 'social-twitter',
      label: 'Twitter',
      href: 'https://twitter.com/viewlytics',
      icon: 'Twitter',
      external: true,
      enabled: true,
    },
    {
      id: 'social-instagram',
      label: 'Instagram',
      href: 'https://instagram.com/viewlytics',
      icon: 'Instagram',
      external: true,
      enabled: true,
    },
    {
      id: 'social-github',
      label: 'GitHub',
      href: 'https://github.com/viewlytics',
      icon: 'Github',
      external: true,
      enabled: true,
    },
  ],
} as const;
