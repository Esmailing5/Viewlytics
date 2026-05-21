/**
 * Viewlytics — Footer
 *
 * Footer premium de la plataforma. Incluye:
 * - Logo oficial horizontal
 * - Grupos de links del config (Platform, Company, Legal)
 * - Links de redes sociales con íconos de Lucide
 * - Copyright y "Powered by Viewlytics"
 *
 * @see src/config/navigation.ts — Footer groups + social links
 * @see src/config/branding.ts — Logo + brand name
 * @see execution-pack/12-branding-system.md — Branding rules
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { navigationConfig } from '@/config/navigation';
import { brandConfig, logoAssets } from '@/config/branding';
import { TwitterIcon, InstagramIcon, GithubIcon } from '@/components/shared/SocialIcons';
import { Logo } from '@/components/shared/Logo';

/** Mapa de íconos de redes sociales */
const SOCIAL_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Twitter: TwitterIcon,
  Instagram: InstagramIcon,
  Github: GithubIcon,
};

/**
 * Footer — Pie de página premium con branding, navigation y socials.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();
  const enabledFooterGroups = navigationConfig.footer;
  const enabledSocial = navigationConfig.social.filter((s) => s.enabled);

  return (
    <footer
      className="
        relative border-t border-white/[0.06]
        bg-[#071426]
      "
      role="contentinfo"
    >
      {/* Subtle top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,122,0,0.3), transparent)' }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        {/* ── Top Row: Logo + Links ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" id="footer-logo" aria-label={`${brandConfig.name} — Inicio`}>
              <Logo className="h-10 w-auto mb-4" />
            </Link>
            <p className="text-sm text-[#B8C4D4] leading-relaxed max-w-xs">
              Inteligencia analítica premium para creadores dominicanos — podcasts, streamers y medios digitales.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-6">
              {enabledSocial.map((social) => {
                const Icon = social.icon ? SOCIAL_ICON_MAP[social.icon] : undefined;
                return (
                  <a
                    key={social.id}
                    id={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="
                      w-9 h-9 rounded-xl
                      flex items-center justify-center
                      bg-white/[0.04] border border-white/[0.06]
                      text-[#B8C4D4] hover:text-[#F5F7FA] hover:bg-white/[0.08]
                      transition-all duration-200
                    "
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation link groups */}
          {enabledFooterGroups.map((group) => (
            <div key={group.title} className="col-span-1">
              <h3 className="text-[#F5F7FA] text-sm font-semibold mb-4">{group.title}</h3>
              <ul className="space-y-3" role="list">
                {group.items
                  .filter((item) => item.enabled)
                  .map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        id={item.id}
                        className="
                          text-sm text-[#B8C4D4]
                          hover:text-[#F5F7FA]
                          transition-colors duration-200
                        "
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom Row: Legal ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/[0.06]">
          <p className="text-xs text-[#B8C4D4]/60">
            © {currentYear} {brandConfig.name}. Todos los derechos reservados.
          </p>

          <p className="text-xs text-[#B8C4D4]/40 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-[#FF7A00]/60" aria-hidden="true" />
            Desarrollado por {brandConfig.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
