/**
 * Viewlytics — Navigation Configuration (Phase 1.5)
 *
 * Controls all navigation surfaces: sidebar, topbar, footer, and social links.
 * Navigation is fully config-driven for future CMS integration.
 *
 * @see types/navigation.types.ts — Type definitions
 */

import type { NavigationConfig } from '@/types';

export const navigationConfig: NavigationConfig = {
  /**
   * Sidebar navigation items — displayed in the fixed left sidebar.
   * Section 'main' items appear at the top, 'bottom' items at the bottom.
   */
  sidebar: [
    {
      id: 'home',
      label: 'Home',
      href: '/',
      icon: 'Home',
      enabled: true,
      section: 'main',
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/dashboard', // Dynamically overridden in Sidebar when on a channel page
      icon: 'LayoutDashboard',
      enabled: true,
      section: 'main',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      href: '/analytics',
      icon: 'BarChart3',
      enabled: true,
      section: 'main',
    },
    {
      id: 'audience',
      label: 'Audience',
      href: '/audience',
      icon: 'Users',
      enabled: true,
      section: 'main',
    },
    {
      id: 'reports',
      label: 'Reports',
      href: '/reports',
      icon: 'FileText',
      enabled: true,
      section: 'main',
    },
    {
      id: 'admin',
      label: 'Admin',
      href: '/admin',
      icon: 'Admin',
      enabled: true,
      section: 'bottom',
    },
    {
      id: 'settings',
      label: 'Settings',
      href: '/settings',
      icon: 'Settings',
      enabled: true,
      section: 'bottom',
    },
  ],

  /**
   * Main navbar items — kept for backward compatibility.
   */
  navbar: [
    {
      id: 'home',
      label: 'Home',
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
      label: 'Trending',
      href: '/trending',
      enabled: true,
      badge: 'New',
    },
    {
      id: 'about',
      label: 'About',
      href: '/about',
      enabled: true,
    },
  ],

  /**
   * Footer link groups organized by column.
   */
  footer: [
    {
      title: 'Platform',
      items: [
        { id: 'footer-rankings', label: 'Rankings', href: '/rankings', enabled: true },
        { id: 'footer-trending', label: 'Trending', href: '/trending', enabled: true },
        { id: 'footer-search', label: 'Search', href: '/search', enabled: true },
      ],
    },
    {
      title: 'Company',
      items: [
        { id: 'footer-about', label: 'About', href: '/about', enabled: true },
        { id: 'footer-contact', label: 'Contact', href: '/contact', enabled: true },
        { id: 'footer-blog', label: 'Blog', href: '/blog', enabled: false },
      ],
    },
    {
      title: 'Legal',
      items: [
        { id: 'footer-privacy', label: 'Privacy', href: '/privacy', enabled: true },
        { id: 'footer-terms', label: 'Terms', href: '/terms', enabled: true },
      ],
    },
  ],

  /**
   * Social media links — displayed in footer.
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
