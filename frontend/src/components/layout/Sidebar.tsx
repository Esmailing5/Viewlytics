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
            vl-nav-item
            ${active ? 'vl-nav-item-active' : ''}
            ${collapsed ? 'justify-center' : ''}
          `}
          title={collapsed ? item.label : undefined}
        >
          {Icon && <Icon className={`vl-nav-icon ${active ? 'text-[var(--vl-red)]' : ''}`} />}
          {!collapsed && <span>{item.label}</span>}
          {!collapsed && item.badge && (
            <span className="vl-nav-badge">
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
      <div className={`flex items-center h-[72px] px-4 border-b border-[var(--vl-border)] ${collapsed ? 'justify-center' : ''}`}>
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
      <div className="px-3 py-4 border-t border-[var(--vl-border)] space-y-1">
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
          h-10 mx-3 mb-3
          vl-btn vl-btn-ghost vl-btn-icon
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
          vl-sidebar
          ${collapsed ? 'vl-sidebar-collapsed' : 'vl-sidebar-expanded'}
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
            className="absolute inset-0 bg-[var(--vl-bg-overlay)] backdrop-blur-sm"
            onClick={onMobileClose}
          />
          {/* Drawer */}
          <aside
            id="sidebar-mobile"
            className="
              relative w-[280px] h-full
              bg-[var(--vl-bg-primary)] border-r border-[var(--vl-border)]
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
                vl-btn vl-btn-ghost vl-btn-icon vl-btn-sm
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
