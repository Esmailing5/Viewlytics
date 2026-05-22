/**
 * Viewlytics — Navigation Types (Phase 1.5)
 *
 * Type definitions for the navigation system including sidebar, topbar, footer.
 * All navigation is config-driven for future CMS integration.
 *
 * @see config/navigation.ts — Runtime values
 */

/**
 * Individual navigation item.
 * Represents a link in the sidebar, topbar, or footer.
 */
export interface NavigationItem {
  /** Unique identifier */
  readonly id: string;
  /** Display label */
  readonly label: string;
  /** Page path or external URL */
  readonly href: string;
  /** Optional Lucide icon name */
  readonly icon?: string;
  /** Whether this link opens in a new tab */
  readonly external?: boolean;
  /** Whether this item is currently enabled */
  readonly enabled: boolean;
  /** Badge text (e.g. "New", "Beta") */
  readonly badge?: string;
}

/**
 * Grouped navigation items.
 * Used for footer columns and sidebar sections.
 */
export interface NavigationGroup {
  /** Group display title */
  readonly title: string;
  /** Items within this group */
  readonly items: readonly NavigationItem[];
}

/**
 * Sidebar navigation item with section placement.
 */
export interface SidebarItem {
  /** Unique identifier */
  readonly id: string;
  /** Display label */
  readonly label: string;
  /** Navigation path */
  readonly href: string;
  /** Lucide icon name */
  readonly icon: string;
  /** Whether this item is enabled */
  readonly enabled: boolean;
  /** Section placement: 'main' for primary nav, 'bottom' for footer area */
  readonly section: 'main' | 'bottom';
  /** Optional badge text */
  readonly badge?: string;
}

/**
 * Complete navigation configuration.
 * Defines all navigation surfaces across the platform.
 */
export interface NavigationConfig {
  /** Sidebar navigation items */
  readonly sidebar: readonly SidebarItem[];
  /** Main navbar items (top bar) — kept for backwards compat */
  readonly navbar: readonly NavigationItem[];
  /** Footer link groups organized by column */
  readonly footer: readonly NavigationGroup[];
  /** Social media links */
  readonly social: readonly NavigationItem[];
}
