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
      className="
        relative sticky top-0 z-30
        flex items-center justify-between
        h-[72px] px-6
        bg-[var(--bg-main)]/80 backdrop-blur-xl
        border-b border-[var(--border-color)]
      "
      role="banner"
    >
      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="absolute inset-0 z-40 flex items-center px-4 bg-[var(--bg-main)] border-b border-[var(--border-color)] animate-in fade-in zoom-in-95 duration-200">
          <div className="relative flex-1 flex items-center">
            <Search className="absolute left-3 w-5 h-5 text-[var(--text-secondary)]" />
            <input
              type="text"
              autoFocus
              placeholder="Busqueda de canal favorito"
              aria-label="Search"
              className="
                w-full h-10 pl-10 pr-4 rounded-xl
                bg-[var(--bg-surface)] border border-[var(--border-color)]
                text-base text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]
                focus:outline-none focus:ring-1 focus:ring-[var(--accent-cyan)] focus:border-[var(--accent-cyan)]
              "
            />
          </div>
          <button
            onClick={() => setIsMobileSearchOpen(false)}
            aria-label="Close search"
            className="ml-3 p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
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
          className="
            lg:hidden flex items-center justify-center
            w-9 h-9 rounded-xl
            text-[var(--text-secondary)] hover:text-[var(--text-primary)]
            hover:bg-[var(--bg-surface)]
            transition-all duration-200
          "
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page title */}
        <div>
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">
            Dashboard
          </h1>
          <p className="text-xs text-[var(--text-secondary)] hidden sm:block">
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
          className="
            hidden sm:flex items-center gap-2
            px-3 py-2 rounded-xl
            text-sm text-[var(--text-secondary)]
            hover:text-[var(--text-primary)]
            hover:bg-[var(--bg-surface)]
            border border-[var(--border-color)]
            transition-all duration-200
          "
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
          className="
            md:hidden flex items-center justify-center
            w-9 h-9 rounded-xl
            text-[var(--text-secondary)] hover:text-[var(--text-primary)]
            hover:bg-[var(--bg-surface)]
            transition-all duration-200
          "
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <button
          id="topbar-notifications"
          aria-label="Notifications"
          className="
            relative flex items-center justify-center
            w-9 h-9 rounded-xl
            text-[var(--text-secondary)] hover:text-[var(--text-primary)]
            hover:bg-[var(--bg-surface)]
            transition-all duration-200
          "
        >
          <Bell className="w-5 h-5" />
          {/* Notification dot */}
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--accent-cyan)]"
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
            bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-blue)]
            text-white text-sm font-semibold
            hover:opacity-90
            transition-all duration-200
          "
        >
          V
        </button>
      </div>
    </header>
  );
}
