/**
 * Viewlytics — Footer v3
 *
 * Editorial, minimal, non-corporate. Gradient top-line accent.
 * Config-driven, theme-aware.
 *
 * @see src/config/navigation.ts
 * @see src/config/branding.ts
 */

'use client';

import Link from 'next/link';
import { navigationConfig } from '@/config/navigation';
import { brandConfig } from '@/config/branding';
import { TwitterIcon, InstagramIcon, GithubIcon } from '@/components/shared/SocialIcons';
import { Logo } from '@/components/shared/Logo';

const SOCIAL_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Twitter: TwitterIcon,
  Instagram: InstagramIcon,
  Github: GithubIcon,
};

export function Footer() {
  const currentYear = new Date().getFullYear();
  const enabledFooterGroups = navigationConfig.footer;
  const enabledSocial = navigationConfig.social.filter((s) => s.enabled);

  return (
    <footer className="vl-footer" role="contentinfo">
      <div className="vl-footer-inner">

        {/* Top: Brand + Links grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" id="footer-logo" aria-label={`${brandConfig.name} — Home`}>
              <Logo className="h-7 w-auto mb-4" variant="full" />
            </Link>
            <p className="text-sm text-[var(--vl-text-tertiary)] leading-relaxed max-w-[220px]">
              Creator intelligence platform for Dominican digital media.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-1 mt-5">
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
                      w-8 h-8 flex items-center justify-center
                      rounded-lg
                      text-[var(--vl-text-disabled)]
                      hover:text-[var(--vl-text-secondary)]
                      hover:bg-[rgba(255,255,255,0.05)]
                      transition-colors duration-150
                    "
                  >
                    {Icon && <Icon className="w-[15px] h-[15px]" />}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link groups */}
          {enabledFooterGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[var(--vl-text-disabled)] mb-4">
                {group.title}
              </h3>
              <ul className="space-y-2.5" role="list">
                {group.items
                  .filter((item) => item.enabled)
                  .map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        id={item.id}
                        className="
                          text-sm text-[var(--vl-text-tertiary)]
                          hover:text-[var(--vl-text-primary)]
                          transition-colors duration-150
                          inline-flex
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

        {/* Bottom bar */}
        <div className="vl-footer-bottom">
          <p className="text-xs text-[var(--vl-text-disabled)]">
            © {currentYear} {brandConfig.name}. All rights reserved.
          </p>
          <p className="text-xs text-[var(--vl-text-disabled)] opacity-60">
            Built for creators.
          </p>
        </div>
      </div>
    </footer>
  );
}
