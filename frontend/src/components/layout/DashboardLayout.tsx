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
 * DashboardLayout — Main layout wrapper with sidebar + topbar + content + footer.
 *
 * Manages sidebar collapse state and mobile drawer visibility.
 * Content area adjusts margin-left based on sidebar width.
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sync collapse state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(COLLAPSED_KEY);
      if (stored === 'true') setSidebarCollapsed(true);
    } catch {
      // localStorage unavailable
    }

    // Listen for storage changes (sidebar toggle updates this)
    const handleStorage = () => {
      try {
        const stored = localStorage.getItem(COLLAPSED_KEY);
        setSidebarCollapsed(stored === 'true');
      } catch {
        // localStorage unavailable
      }
    };

    window.addEventListener('storage', handleStorage);

    // Also listen for custom sidebar collapse events
    const observer = new MutationObserver(() => {
      try {
        const stored = localStorage.getItem(COLLAPSED_KEY);
        setSidebarCollapsed(stored === 'true');
      } catch {
        // ignore
      }
    });

    // Poll localStorage on a short interval to catch same-tab changes
    const interval = setInterval(handleStorage, 300);

    return () => {
      window.removeEventListener('storage', handleStorage);
      observer.disconnect();
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
    <div className="min-h-screen flex flex-col">
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onMobileClose={handleMobileClose} />

      {/* Main content area — shifts right based on sidebar width */}
      <div
        className={`
          flex flex-col flex-1
          transition-[margin-left] duration-300
          lg:ml-[260px]
          ${sidebarCollapsed ? 'lg:!ml-[88px]' : ''}
        `}
      >
        {/* Topbar */}
        <Topbar onMobileMenuToggle={handleMobileToggle} />

        {/* Page content */}
        <main id="main-content" className="flex-1 p-6">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
