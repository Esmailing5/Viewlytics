'use client';

import { Search, Bell, Menu, Calendar } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

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
  return (
    <header
      id="topbar"
      className="
        sticky top-0 z-30
        flex items-center justify-between
        h-[72px] px-6
        bg-[var(--bg-main)]/80 backdrop-blur-xl
        border-b border-[var(--border-color)]
      "
      role="banner"
    >
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

        {/* Search */}
        <button
          id="topbar-search"
          aria-label="Search"
          className="
            flex items-center justify-center
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
