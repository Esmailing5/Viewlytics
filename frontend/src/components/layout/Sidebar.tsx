'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigationConfig } from '@/config/navigation';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Logo } from '@/components/shared/Logo';
import type { SidebarItem } from '@/types';
import { useAuth } from '@/providers/AuthProvider';
import { LogOut, GitCompareArrows } from 'lucide-react';

/**
 * Premium SVG icon set for sidebar — hand-crafted, 1.5 stroke-width.
 * Replaces generic Lucide-only approach for a more editorial look.
 */
const IconHome = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
    <path d="M7.5 18V12h5v6" />
  </svg>
);

const IconDashboard = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="6" height="6" rx="1.5" />
    <rect x="11" y="3" width="6" height="6" rx="1.5" />
    <rect x="3" y="11" width="6" height="6" rx="1.5" />
    <rect x="11" y="11" width="6" height="6" rx="1.5" />
  </svg>
);

const IconAnalytics = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 16l4-5 3 3 4-6 3 3" />
    <path d="M17 16H3" />
  </svg>
);

const IconAudience = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="7" r="3" />
    <path d="M2 17c0-3 2.7-5 6-5" />
    <circle cx="14" cy="8" r="2.5" />
    <path d="M11.5 17c0-2 1.1-3.5 2.5-3.5s2.5 1.5 2.5 3.5" />
  </svg>
);

const IconReports = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 3h10a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z" />
    <path d="M7 8h6M7 11h6M7 14h4" />
  </svg>
);

const IconSettings = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="10" r="2.5" />
    <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" />
  </svg>
);

const IconAdmin = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2L3 5v6c0 5.5 7 9 7 9s7-3.5 7-9V5l-7-3z" />
  </svg>
);

const IconRankings = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15h12M10 12v3M7 3h6v4a3 3 0 01-3 3h0a3 3 0 01-3-3V3zM4 5a2 2 0 114 0v1H4V5zM16 5a2 2 0 10-4 0v1h4V5z" />
  </svg>
);

const IconChevronLeft = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 4L6 8l4 4" />
  </svg>
);

const IconChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 4l4 4-4 4" />
  </svg>
);

const IconClose = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l8 8M12 4l-8 8" />
  </svg>
);

/** Map icon names to custom SVG components */
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Home: IconHome,
  LayoutDashboard: IconDashboard,
  BarChart3: IconAnalytics,
  Users: IconAudience,
  FileText: IconReports,
  Settings: IconSettings,
  Admin: IconAdmin,
  Rankings: IconRankings,
  GitCompareArrows: GitCompareArrows,
};

const COLLAPSED_KEY = 'viewlytics-sidebar-collapsed';

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

/**
 * Sidebar v3 — Editorial left navigation.
 *
 * Desktop: 240px expanded / 72px collapsed, smooth toggle.
 * Mobile: Slide-in drawer with backdrop overlay.
 * Active states: subtle, not garish. Non-template aesthetic.
 */
export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [lastVisitedDashboard, setLastVisitedDashboard] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COLLAPSED_KEY);
      if (stored === 'true') setCollapsed(true);
    } catch {
      // localStorage unavailable
    }
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('viewlytics-last-visited-dashboard');
      if (saved) {
        setLastVisitedDashboard(saved);
      }
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

  const { user, logout } = useAuth();

  const enabledItems = navigationConfig.sidebar.filter((item) => {
    if (!item.enabled) return false;
    if (item.id === 'admin' && user?.role !== 'ADMIN') return false;
    if (item.id === 'compare' && !user) return false;
    return true;
  });
  const mainItems = enabledItems.filter((item) => item.section === 'main');
  const bottomItems = enabledItems.filter((item) => item.section === 'bottom');

  const channelMatch = pathname.match(/^(\/channel\/[^/]+\/[^/]+)/);
  const channelBasePath = channelMatch ? channelMatch[1] : null;

  useEffect(() => {
    if (channelBasePath) {
      try {
        localStorage.setItem('viewlytics-last-visited-dashboard', channelBasePath);
        setLastVisitedDashboard(channelBasePath);
      } catch {
        // localStorage unavailable
      }
    }
  }, [channelBasePath]);

  const getDynamicHref = (item: SidebarItem) => {
    if (item.id === 'dashboard') {
      return channelBasePath || lastVisitedDashboard || item.href;
    }
    if (channelBasePath) {
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
    const isDashboardDisabled = item.id === 'dashboard' && !channelBasePath && !lastVisitedDashboard;

    if (isDashboardDisabled) {
      return (
        <li key={item.id}>
          <div
            className={`
              vl-nav-item
              opacity-40
              cursor-not-allowed
              ${collapsed ? 'justify-center px-0' : ''}
            `}
            title="Visita un canal desde el buscador o rankings para habilitar el dashboard"
          >
            {Icon && (
              <Icon
                className={`
                  vl-nav-icon flex-shrink-0
                  ${collapsed ? 'w-[18px] h-[18px]' : 'w-4 h-4'}
                `}
              />
            )}
            {!collapsed && (
              <span className="truncate">{item.label}</span>
            )}
          </div>
        </li>
      );
    }

    return (
      <li key={item.id}>
        <Link
          href={dynamicHref}
          id={`sidebar-${item.id}`}
          onClick={onMobileClose}
          className={`
            vl-nav-item
            ${active ? 'vl-nav-item-active' : ''}
            ${collapsed ? 'justify-center px-0' : ''}
          `}
          title={collapsed ? item.label : undefined}
          aria-current={active ? 'page' : undefined}
        >
          {Icon && (
            <Icon
              className={`
                vl-nav-icon flex-shrink-0
                ${collapsed ? 'w-[18px] h-[18px]' : 'w-4 h-4'}
              `}
            />
          )}
          {!collapsed && (
            <span className="truncate">{item.label}</span>
          )}
          {!collapsed && item.badge && (
            <span className="vl-nav-badge ml-auto">{item.badge}</span>
          )}
        </Link>
      </li>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">

      {/* Logo area */}
      <div
        className={`
          flex items-center h-[56px] flex-shrink-0
          border-b border-[var(--vl-border)]
          ${collapsed ? 'justify-center px-0' : 'px-4'}
        `}
      >
        <Link
          href="/"
          className="flex items-center gap-2 flex-shrink-0"
          aria-label="Viewlytics Home"
        >
          <Logo
            variant={collapsed ? 'icon' : 'full'}
            className={collapsed ? 'h-7 w-auto' : 'h-8 w-auto'}
          />
        </Link>
      </div>

      {/* Main navigation */}
      <nav
        className={`flex-1 overflow-y-auto overflow-x-hidden py-3 ${collapsed ? 'px-2' : 'px-2'}`}
        aria-label="Sidebar navigation"
      >
        <ul className="space-y-0.5" role="list">
          {mainItems.map(renderNavItem)}
        </ul>
      </nav>

      {/* Bottom section — pushed to bottom */}
      <div
        className={`
          flex-shrink-0 mt-auto pb-3 pt-2
          border-t border-[var(--vl-border)]
          ${collapsed ? 'px-2' : 'px-2'}
        `}
      >
        <ul className="space-y-0.5 mb-2" role="list">
          {bottomItems.map(renderNavItem)}
        </ul>
        {user && (
          <div className="mb-2">
            {!collapsed && (
              <div className="px-3 py-1 text-[11px] text-[var(--vl-text-tertiary)] truncate font-mono select-none" title={user.email}>
                {user.email}
              </div>
            )}
            <button
              onClick={logout}
              title={collapsed ? `Cerrar sesión (${user.email})` : undefined}
              className={`
                flex items-center gap-2 w-full px-3 py-1.5 rounded-md
                text-xs font-medium text-[var(--vl-text-secondary)]
                hover:text-[var(--vl-red)] hover:bg-[rgba(255,59,48,0.06)]
                transition-colors duration-150
                ${collapsed ? 'justify-center px-0' : ''}
              `}
            >
              <LogOut className={`flex-shrink-0 ${collapsed ? 'w-[18px] h-[18px]' : 'w-4 h-4'}`} />
              {!collapsed && <span>Cerrar sesión</span>}
            </button>
          </div>
        )}
        <div className={`${collapsed ? 'flex justify-center' : ''}`}>
          <ThemeToggle showLabel={!collapsed} />
        </div>
      </div>

      {/* Collapse toggle (desktop only) */}
      <button
        id="sidebar-collapse-toggle"
        onClick={toggleCollapsed}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className={`
          hidden lg:flex items-center justify-center gap-2
          mx-2 mb-2 h-8
          rounded-md
          text-xs font-medium
          text-[var(--vl-text-disabled)]
          hover:text-[var(--vl-text-secondary)]
          hover:bg-[rgba(255,255,255,0.03)]
          transition-colors duration-150
          flex-shrink-0
        `}
      >
        {collapsed
          ? <IconChevronRight className="w-4 h-4" />
          : (
            <>
              <IconChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )
        }
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
        aria-label="Sidebar"
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[var(--vl-bg-overlay)] backdrop-blur-sm"
            onClick={onMobileClose}
            aria-hidden="true"
          />
          {/* Drawer */}
          <aside
            id="sidebar-mobile"
            className="
              relative w-[260px] h-full
              bg-[var(--vl-bg-primary)] border-r border-[var(--vl-border)]
              shadow-2xl
              flex flex-col
            "
            style={{ animation: 'vl-slide-right 0.25s var(--ease-out) both' }}
            aria-label="Mobile navigation"
          >
            {/* Close button */}
            <button
              onClick={onMobileClose}
              aria-label="Close sidebar"
              className="
                absolute top-3 right-3
                w-7 h-7 flex items-center justify-center
                rounded-md
                text-[var(--vl-text-tertiary)]
                hover:text-[var(--vl-text-primary)]
                hover:bg-[rgba(255,255,255,0.06)]
                transition-colors duration-150
                z-10
              "
            >
              <IconClose className="w-3.5 h-3.5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
