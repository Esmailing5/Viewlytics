'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Home,
} from 'lucide-react';
import { navigationConfig } from '@/config/navigation';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Logo } from '@/components/shared/Logo';
import type { SidebarItem } from '@/types';

/** Map sidebar icon names to Lucide components */
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  LayoutDashboard,
  BarChart3,
  Users,
  FileText,
  Settings,
};

const COLLAPSED_KEY = 'viewlytics-sidebar-collapsed';

interface SidebarProps {
  /** Whether the mobile drawer is open */
  mobileOpen: boolean;
  /** Callback to close the mobile drawer */
  onMobileClose: () => void;
}

/**
 * Sidebar — Fixed left navigation panel.
 *
 * Desktop: 260px expanded / 88px collapsed, with toggle button.
 * Mobile: Slide-in drawer with backdrop overlay.
 */
export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Read persisted collapsed state
  useEffect(() => {
    try {
      const stored = localStorage.getItem(COLLAPSED_KEY);
      if (stored === 'true') setCollapsed(true);
    } catch {
      // localStorage unavailable
    }
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSED_KEY, String(next));
      } catch {
        // localStorage unavailable
      }
      return next;
    });
  }, []);

  const enabledItems = navigationConfig.sidebar.filter((item) => item.enabled);
  const mainItems = enabledItems.filter((item) => item.section === 'main');
  const bottomItems = enabledItems.filter((item) => item.section === 'bottom');

  const channelMatch = pathname.match(/^(\/channel\/[^/]+\/[^/]+)/);
  const channelBasePath = channelMatch ? channelMatch[1] : null;

  const getDynamicHref = (item: SidebarItem) => {
    if (channelBasePath) {
      if (item.id === 'dashboard') return channelBasePath;
      if (['analytics', 'audience', 'reports'].includes(item.id)) {
        return `${channelBasePath}/${item.id}`;
      }
    }
    return item.href;
  };

  const isActive = (item: SidebarItem, dynamicHref: string) => {
    if (dynamicHref === '/') return pathname === '/';
    if (item.id === 'dashboard' && channelBasePath) {
      return pathname === channelBasePath;
    }
    return pathname.startsWith(dynamicHref);
  };

  const renderNavItem = (item: SidebarItem) => {
    const Icon = ICON_MAP[item.icon];
    const dynamicHref = getDynamicHref(item);
    const active = isActive(item, dynamicHref);

    return (
      <li key={item.id}>
        <Link
          href={dynamicHref}
          id={`sidebar-${item.id}`}
          onClick={onMobileClose}
          className={`
            relative flex items-center gap-3
            px-3 py-2.5 rounded-xl
            text-sm font-medium
            transition-all duration-200
            group
            ${active
              ? 'text-[var(--text-primary)] bg-[var(--accent-blue)]/10'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
            }
            ${collapsed ? 'justify-center' : ''}
          `}
          title={collapsed ? item.label : undefined}
        >
          {/* Active indicator bar */}
          {active && (
            <span
              className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[var(--accent-blue)]"
              aria-hidden="true"
            />
          )}
          {Icon && <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-[var(--accent-blue)]' : ''}`} />}
          {!collapsed && <span>{item.label}</span>}
          {!collapsed && item.badge && (
            <span className="ml-auto inline-flex items-center px-1.5 py-0.5 rounded-md bg-[var(--accent-blue)]/20 text-[var(--accent-blue)] text-[10px] font-bold">
              {item.badge}
            </span>
          )}
        </Link>
      </li>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center h-[72px] px-4 border-b border-[var(--border-color)] ${collapsed ? 'justify-center' : ''}`}>
        <Link href="/" className="flex items-center gap-2 flex-shrink-0" aria-label="Viewlytics Home">
          <Logo variant={collapsed ? 'icon' : 'full'} className={collapsed ? 'h-8 w-auto' : 'h-9 w-auto'} />
        </Link>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto" aria-label="Sidebar navigation">
        <ul className="space-y-1" role="list">
          {mainItems.map(renderNavItem)}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-4 border-t border-[var(--border-color)] space-y-1">
        <ul className="space-y-1" role="list">
          {bottomItems.map(renderNavItem)}
        </ul>
        <div className={`mt-2 ${collapsed ? 'flex justify-center' : ''}`}>
          <ThemeToggle showLabel={!collapsed} />
        </div>
      </div>

      {/* Collapse toggle (desktop only) */}
      <button
        id="sidebar-collapse-toggle"
        onClick={toggleCollapsed}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="
          hidden lg:flex items-center justify-center
          h-10 mx-3 mb-3 rounded-xl
          text-[var(--text-secondary)] hover:text-[var(--text-primary)]
          hover:bg-[var(--bg-surface)]
          transition-all duration-200
        "
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        id="sidebar-desktop"
        className={`
          hidden lg:flex flex-col
          fixed top-0 left-0 h-full z-40
          bg-[var(--bg-main)] border-r border-[var(--border-color)]
          transition-[width] duration-300
          ${collapsed ? 'w-[88px]' : 'w-[260px]'}
        `}
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          aria-hidden="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          {/* Drawer */}
          <aside
            id="sidebar-mobile"
            className="
              relative w-[280px] h-full
              bg-[var(--bg-main)] border-r border-[var(--border-color)]
              shadow-2xl
              animate-in slide-in-from-left duration-300
            "
          >
            {/* Close button */}
            <button
              onClick={onMobileClose}
              aria-label="Close sidebar"
              className="
                absolute top-4 right-4
                w-8 h-8 rounded-lg
                flex items-center justify-center
                text-[var(--text-secondary)] hover:text-[var(--text-primary)]
                hover:bg-[var(--bg-surface)]
                transition-all duration-200
              "
            >
              <X className="w-4 h-4" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
