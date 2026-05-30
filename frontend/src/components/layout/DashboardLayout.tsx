'use client';

import { useState, useCallback, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { Footer } from '@/components/layout/Footer';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const COLLAPSED_KEY = 'viewlytics-sidebar-collapsed';

/**
 * DashboardLayout v3 — Main wrapper with sidebar + topbar + content + footer.
 *
 * Sidebar: 240px expanded / 72px collapsed.
 * Content area transitions margin-left smoothly.
 * Mobile: sidebar is a drawer, no margin offset needed.
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sync collapse state from localStorage (same-tab polling)
  useEffect(() => {
    const syncCollapsed = () => {
      try {
        const stored = localStorage.getItem(COLLAPSED_KEY);
        setSidebarCollapsed(stored === 'true');
      } catch {
        // localStorage unavailable
      }
    };

    syncCollapsed();
    window.addEventListener('storage', syncCollapsed);

    const interval = setInterval(syncCollapsed, 250);

    return () => {
      window.removeEventListener('storage', syncCollapsed);
      clearInterval(interval);
    };
  }, []);

  const handleMobileToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const handleMobileClose = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--vl-bg-primary)]">
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onMobileClose={handleMobileClose} />

      {/* Main content — shifts right on desktop based on sidebar width */}
      <div
        className={`
          flex flex-col flex-1 min-w-0
          transition-[margin-left] duration-300 ease-[var(--ease-default)]
          lg:ml-[240px]
          ${sidebarCollapsed ? 'lg:!ml-[72px]' : ''}
        `}
      >
        {/* Topbar */}
        <Topbar onMobileMenuToggle={handleMobileToggle} />

        {/* Page content */}
        <main
          id="main-content"
          className="flex-1 p-4 md:p-5 lg:p-6 min-w-0"
        >
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
