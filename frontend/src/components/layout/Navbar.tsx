/**
 * Viewlytics — Navbar
 *
 * Barra de navegación principal de la plataforma. Soporta:
 * - Logo oficial horizontal (SVG component)
 * - Links de navegación del config
 * - Menú móvil con animación
 * - CTA button rojo
 * - Efecto glassmorphism al hacer scroll
 *
 * @see src/config/navigation.ts — Nav items
 * @see src/config/branding.ts — Logo paths
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, ChevronRight } from 'lucide-react';
import { navigationConfig } from '@/config/navigation';
import { brandConfig } from '@/config/branding';
import { Logo } from '@/components/shared/Logo';

/**
 * Navbar — Barra de navegación sticky con glassmorphism y menú móvil animado.
 */
export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detectar scroll para aplicar fondo glassmorphism
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const enabledNavItems = navigationConfig.navbar.filter((item) => item.enabled);

  return (
    <>
      <header
        className={`vl-navbar ${scrolled ? 'vl-navbar-scrolled' : 'bg-transparent'}`}
        role="banner"
      >
        <nav
          className="vl-navbar-inner"
          aria-label="Main navigation"
        >
          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-3 flex-shrink-0"
            aria-label={`${brandConfig.name} — Home`}
            id="navbar-logo"
          >
            <Logo className="h-14 w-auto" />
          </Link>

          {/* ── Desktop Nav Links ── */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {enabledNavItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  id={`nav-${item.id}`}
                  className="vl-nav-link group"
                >
                  {item.label}
                  {item.badge && (
                    <span className="vl-nav-badge">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* ── Desktop Actions ── */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search shortcut */}
            <button
              id="navbar-search"
              aria-label="Buscar creador"
              className="vl-nav-link"
            >
              <Search className="w-4 h-4" />
              <span className="hidden lg:inline">Buscar creador</span>
              <kbd className="vl-kbd hidden lg:inline-flex">
                ⌘K
              </kbd>
            </button>

            {/* CTA */}
            <Link
              href="/rankings"
              id="navbar-cta"
              className="vl-btn vl-btn-primary vl-btn-md"
            >
              Explorar Rankings
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* ── Mobile Menu Button ── */}
          <button
            id="navbar-mobile-toggle"
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="vl-btn vl-btn-ghost vl-btn-icon md:hidden"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </header>

      {/* ── Mobile Menu Overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="navbar-mobile-menu"
            role="dialog"
            aria-label="Menú de navegación móvil"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="
              fixed top-16 left-0 right-0 z-40
              vl-glass-elevated
              px-4 pt-4 pb-6
              flex flex-col gap-2
              md:hidden
            "
          >
            {enabledNavItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.2 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="
                    flex items-center justify-between
                    vl-nav-link
                    py-3
                  "
                >
                  <span className="flex items-center gap-2">
                    {item.label}
                    {item.badge && (
                      <span className="vl-nav-badge">
                        {item.badge}
                      </span>
                    )}
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </Link>
              </motion.div>
            ))}

            <div className="mt-2 pt-4 border-t border-[var(--vl-border)]">
              <Link
                href="/rankings"
                onClick={() => setMobileOpen(false)}
                id="navbar-mobile-cta"
                className="vl-btn vl-btn-primary w-full justify-center vl-btn-lg"
              >
                Explorar Rankings
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
