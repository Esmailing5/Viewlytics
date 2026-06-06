/**
 * Viewlytics — Navbar v3
 *
 * Minimalista, editorial, premium. Blur-first, clean hover states.
 * Mobile drawer fluido, sin overflow horizontal.
 *
 * @see src/config/navigation.ts
 * @see src/config/branding.ts
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, LogIn } from 'lucide-react';
import { navigationConfig } from '@/config/navigation';
import { brandConfig } from '@/config/branding';
import { Logo } from '@/components/shared/Logo';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useAuth } from '@/providers/AuthProvider';
import { UserAvatar } from '@/components/shared/UserAvatar';

/**
 * Navbar — Sticky premium navigation bar.
 * Desktop: logo + links + CTA. Mobile: hamburger → full-panel drawer.
 */
export function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const enabledNavItems = navigationConfig.navbar.filter((item) => item.enabled);

  const isActivePath = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`vl-navbar ${scrolled ? 'vl-navbar-scrolled' : 'vl-navbar-base'}`}
        role="banner"
      >
        <nav className="vl-navbar-inner" aria-label="Main navigation">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0 group"
            aria-label={`${brandConfig.name} — Home`}
            id="navbar-logo"
          >
            <Logo className="h-[38px] w-auto" />
          </Link>

          {/* ── Desktop Nav Links ── */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {enabledNavItems.map((item) => {
              const active = isActivePath(item.href);
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    id={`nav-${item.id}`}
                    className={`vl-nav-link ${active ? 'text-[var(--vl-text-primary)]' : ''}`}
                  >
                    {item.label}
                    {item.badge && (
                      <span className="vl-nav-badge">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ── Desktop Actions ── */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />

            <Link
              href="/rankings"
              id="navbar-cta"
              className="vl-btn vl-btn-primary vl-btn-sm group"
            >
              Rankings
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>

            {user ? (
              <div className="flex items-center gap-2 ml-1">
                <UserAvatar user={user} size="md" />
                <button
                  onClick={logout}
                  className="text-xs font-semibold text-[var(--vl-text-secondary)] hover:text-[var(--vl-red)] transition-colors py-1.5 px-3 rounded-lg border border-[var(--vl-border)] hover:bg-[rgba(255,59,48,0.06)]"
                >
                  Cerrar sesión
                </button>
              </div>
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

          {/* ── Mobile: Theme + Menu ── */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              id="navbar-mobile-toggle"
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileOpen}
              aria-controls="navbar-mobile-menu"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="vl-btn vl-btn-ghost vl-btn-icon"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile Menu Panel ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-30 md:hidden"
              style={{ background: 'rgba(0, 0, 0, 0.5)', top: '60px' }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              id="navbar-mobile-menu"
              role="dialog"
              aria-label="Navigation menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="vl-mobile-nav md:hidden"
            >
              {/* Nav links */}
              <ul className="space-y-0.5" role="list">
                {enabledNavItems.map((item, i) => {
                  const active = isActivePath(item.href);
                  return (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.15 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`
                          flex items-center justify-between
                          px-3 py-2.5 rounded-lg
                          text-sm font-medium
                          transition-colors duration-150
                          ${active
                            ? 'text-[var(--vl-text-primary)] bg-[rgba(255,255,255,0.06)]'
                            : 'text-[var(--vl-text-secondary)] hover:text-[var(--vl-text-primary)] hover:bg-[rgba(255,255,255,0.04)]'
                          }
                        `}
                      >
                        <span className="flex items-center gap-2">
                          {item.label}
                          {item.badge && (
                            <span className="vl-nav-badge">{item.badge}</span>
                          )}
                        </span>
                        {active && (
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-[var(--vl-red)]"
                            aria-hidden="true"
                          />
                        )}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              {/* CTA block */}
              <div className="mt-4 pt-4 border-t border-[var(--vl-border)] space-y-2">
                <Link
                  href="/rankings"
                  onClick={() => setMobileOpen(false)}
                  id="navbar-mobile-cta"
                  className="vl-btn vl-btn-primary w-full justify-center"
                >
                  Explorar Rankings
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {user ? (
                  <div className="pt-2 border-t border-[rgba(255,255,255,0.04)]">
                    <div className="px-3 py-1.5 text-xs text-[var(--vl-text-tertiary)] truncate font-mono select-none" title={user.email}>
                      Conectado: {user.email}
                    </div>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[rgba(255,59,48,0.1)] border border-[rgba(255,59,48,0.2)] text-[var(--vl-red)] hover:bg-[rgba(255,59,48,0.15)] text-sm font-semibold transition-colors"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-[var(--vl-border)] text-[var(--vl-text-secondary)] hover:text-[var(--vl-text-primary)] hover:bg-[rgba(255,255,255,0.04)] text-sm font-semibold transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Entrar</span>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
