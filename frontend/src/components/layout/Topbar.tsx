'use client';

import { useState } from 'react';
import { Search, Bell, Menu, Calendar, X } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { SearchInput } from '@/components/shared/SearchInput';

interface TopbarProps {
  /** Callback to toggle mobile sidebar */
  onMobileMenuToggle: () => void;
}

/**
 * Topbar — Sticky top header bar.
 *
 * Contains: page title, search icon, notifications, date range filter,
 * theme switcher, and profile avatar.
 * Height: 72px.
 */
export function Topbar({ onMobileMenuToggle }: TopbarProps) {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <header
      id="topbar"
      className="vl-topbar"
      role="banner"
    >
      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="absolute inset-0 z-40 flex items-center px-4 bg-[var(--vl-bg-primary)] border-b border-[var(--vl-border)] vl-animate-fade-in">
          <div className="relative flex-1 flex items-center">
            <div className="w-full">
              <SearchInput variant="minimal" onSelect={() => setIsMobileSearchOpen(false)} />
            </div>
          </div>
          <button
            onClick={() => setIsMobileSearchOpen(false)}
            aria-label="Close search"
            className="ml-3 vl-btn vl-btn-ghost vl-btn-icon"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* Mobile hamburger */}
        <button
          id="topbar-mobile-menu"
          onClick={onMobileMenuToggle}
          aria-label="Toggle navigation menu"
          className="lg:hidden vl-btn vl-btn-ghost vl-btn-icon"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page title */}
        <div>
          <h1 className="text-lg font-semibold text-[var(--vl-text-primary)]">
            Dashboard
          </h1>
          <p className="text-xs text-[var(--vl-text-secondary)] hidden sm:block">
            Analytics for Streams & Video
          </p>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Date range filter */}
        <button
          id="topbar-date-range"
          aria-label="Select date range"
          className="hidden sm:flex vl-btn vl-btn-secondary vl-btn-sm gap-2"
        >
          <Calendar className="w-4 h-4" />
          <span>Last 30 days</span>
        </button>

        {/* Search (Desktop) */}
        <div className="relative hidden md:flex items-center w-64 xl:w-80">
          <SearchInput variant="minimal" />
        </div>

        {/* Search (Mobile) */}
        <button
          id="topbar-search-mobile"
          aria-label="Open search mobile"
          onClick={() => setIsMobileSearchOpen(true)}
          className="md:hidden vl-btn vl-btn-ghost vl-btn-icon"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <button
          id="topbar-notifications"
          aria-label="Notifications"
          className="relative vl-btn vl-btn-ghost vl-btn-icon"
        >
          <Bell className="w-5 h-5" />
          {/* Notification dot */}
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--vl-red)] vl-animate-pulse"
            aria-hidden="true"
          />
        </button>

        {/* Theme toggle */}
        <ThemeToggle className="hidden sm:inline-flex" />

        {/* Profile avatar */}
        <button
          id="topbar-profile"
          aria-label="Profile menu"
          className="
            flex items-center justify-center
            w-9 h-9 rounded-full
            text-white text-sm font-semibold
            vl-transition-fast
            hover:opacity-90
          "
          style={{ background: 'var(--vl-gradient-brand)' }}
        >
          V
        </button>
      </div>
    </header>
  );
}
