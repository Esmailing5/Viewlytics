/**
 * Viewlytics — Navbar
 *
 * Barra de navegación principal de la plataforma. Soporta:
 * - Logo oficial horizontal (desde /branding/)
 * - Links de navegación del config
 * - Menú móvil con animación
 * - CTA button naranja
 * - Efecto glassmorphism al hacer scroll
 *
 * @see src/config/navigation.ts — Nav items
 * @see src/config/branding.ts — Logo paths
 * @see execution-pack/12-branding-system.md — Logo rules
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, ChevronRight } from 'lucide-react';
import { navigationConfig } from '@/config/navigation';
import { brandConfig, logoAssets } from '@/config/branding';
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
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-500
          ${scrolled
            ? 'bg-[#071426]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-xl shadow-black/20'
            : 'bg-transparent'
          }
        `}
        role="banner"
      >
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
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
                  className="
                    relative flex items-center gap-1.5
                    px-4 py-2 rounded-xl
                    text-sm font-medium text-[#B8C4D4]
                    hover:text-[#F5F7FA] hover:bg-white/[0.05]
                    transition-all duration-200
                    group
                  "
                >
                  {item.label}
                  {item.badge && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-[#FF7A00]/20 text-[#FF7A00] text-[10px] font-bold tracking-wide">
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
              className="
                flex items-center gap-2 px-3 py-2 rounded-xl
                text-sm text-[#B8C4D4] hover:text-[#F5F7FA]
                hover:bg-white/[0.05]
                transition-all duration-200
              "
            >
              <Search className="w-4 h-4" />
              <span className="hidden lg:inline">Buscar creador</span>
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-[#B8C4D4]">
                ⌘K
              </kbd>
            </button>

            {/* CTA */}
            <Link
              href="/rankings"
              id="navbar-cta"
              className="
                flex items-center gap-1.5
                px-4 py-2 rounded-xl
                bg-[#FF7A00] hover:bg-[#FF9A33]
                text-sm font-semibold text-white
                transition-all duration-200
                shadow-lg shadow-[#FF7A00]/20
                hover:shadow-[#FF7A00]/30
              "
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
            className="
              md:hidden flex items-center justify-center
              w-9 h-9 rounded-xl
              text-[#B8C4D4] hover:text-[#F5F7FA]
              hover:bg-white/[0.05]
              transition-all duration-200
            "
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
              bg-[#071426]/95 backdrop-blur-xl
              border-b border-white/[0.06]
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
                    px-4 py-3 rounded-xl
                    text-[#B8C4D4] hover:text-[#F5F7FA] hover:bg-white/[0.05]
                    font-medium text-sm
                    transition-all duration-200
                  "
                >
                  <span className="flex items-center gap-2">
                    {item.label}
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded-md bg-[#FF7A00]/20 text-[#FF7A00] text-[10px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </Link>
              </motion.div>
            ))}

            <div className="mt-2 pt-4 border-t border-white/[0.06]">
              <Link
                href="/rankings"
                onClick={() => setMobileOpen(false)}
                id="navbar-mobile-cta"
                className="
                  flex items-center justify-center gap-2
                  w-full px-4 py-3 rounded-xl
                  bg-[#FF7A00] hover:bg-[#FF9A33]
                  text-sm font-semibold text-white
                  transition-all duration-200
                "
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
