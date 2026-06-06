'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, Bell, Search, X, LogIn } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { SearchInput } from '@/components/shared/SearchInput';
import { useAuth } from '@/providers/AuthProvider';
import { UserAvatar } from '@/components/shared/UserAvatar';

interface TopbarProps {
  onMobileMenuToggle: () => void;
}

/**
 * Topbar v3 — Sticky top bar for the dashboard layout.
 *
 * Height: 56px (matches new sidebar logo area).
 * Premium blur, minimal visual noise, functional controls.
 */
export function Topbar({ onMobileMenuToggle }: TopbarProps) {
  const { user } = useAuth();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <header
      id="topbar"
      className="vl-topbar relative"
      role="banner"
    >
      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="absolute inset-0 z-40 flex items-center gap-3 px-4 bg-[var(--vl-bg-primary)] border-b border-[var(--vl-border)] vl-animate-fade-in">
          <div className="flex-1">
            <SearchInput variant="minimal" onSelect={() => setIsMobileSearchOpen(false)} />
          </div>
          <button
            onClick={() => setIsMobileSearchOpen(false)}
            aria-label="Close search"
            className="
              w-8 h-8 flex items-center justify-center
              rounded-lg
              text-[var(--vl-text-secondary)]
              hover:text-[var(--vl-text-primary)]
              hover:bg-[rgba(255,255,255,0.06)]
              transition-colors duration-150
              flex-shrink-0
            "
          >
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>
      )}

      {/* Left section */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          id="topbar-mobile-menu"
          onClick={onMobileMenuToggle}
          aria-label="Toggle navigation menu"
          className="
            lg:hidden w-8 h-8 flex items-center justify-center
            rounded-lg
            text-[var(--vl-text-secondary)]
            hover:text-[var(--vl-text-primary)]
            hover:bg-[rgba(255,255,255,0.06)]
            transition-colors duration-150
          "
        >
          <Menu className="w-[18px] h-[18px]" strokeWidth={1.75} />
        </button>

        {/* Desktop search */}
        <div className="relative hidden md:flex items-center w-56 xl:w-72">
          <SearchInput variant="minimal" />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1">

        {/* Mobile search trigger */}
        <button
          id="topbar-search-mobile"
          aria-label="Open search"
          onClick={() => setIsMobileSearchOpen(true)}
          className="
            md:hidden w-8 h-8 flex items-center justify-center
            rounded-lg
            text-[var(--vl-text-secondary)]
            hover:text-[var(--vl-text-primary)]
            hover:bg-[rgba(255,255,255,0.06)]
            transition-colors duration-150
          "
        >
          <Search className="w-4 h-4" strokeWidth={1.75} />
        </button>

        {/* Notifications */}
        <button
          id="topbar-notifications"
          aria-label="Notifications"
          className="
            relative w-8 h-8 flex items-center justify-center
            rounded-lg
            text-[var(--vl-text-secondary)]
            hover:text-[var(--vl-text-primary)]
            hover:bg-[rgba(255,255,255,0.06)]
            transition-colors duration-150
          "
        >
          <Bell className="w-4 h-4" strokeWidth={1.75} />
          {/* Notification dot */}
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--vl-red)]"
            aria-hidden="true"
          />
        </button>

        {/* Theme toggle */}
        <ThemeToggle className="hidden sm:inline-flex" />

        {/* Divider */}
        <div
          className="hidden sm:block w-px h-5 bg-[var(--vl-border)] mx-1"
          aria-hidden="true"
        />

        {/* Profile avatar / login button */}
        {user ? (
          <UserAvatar user={user} size="sm" />
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-xs font-semibold text-[var(--vl-text-secondary)] hover:text-[var(--vl-text-primary)] transition-colors py-1.5 px-3 rounded-lg border border-[var(--vl-border)] hover:bg-[rgba(255,255,255,0.04)]"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Entrar</span>
          </Link>
        )}
      </div>
    </header>
  );
}
