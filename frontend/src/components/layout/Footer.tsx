/**
 * Viewlytics — Footer (Design System v2)
 *
 * Minimal footer with logo, copyright, links, and social icons.
 * Config-driven, theme-aware.
 *
 * @see src/config/navigation.ts — Footer groups + social links
 * @see src/config/branding.ts — Logo + brand name
 */

'use client';

import Link from 'next/link';
import { navigationConfig } from '@/config/navigation';
import { brandConfig } from '@/config/branding';
import { TwitterIcon, InstagramIcon, GithubIcon } from '@/components/shared/SocialIcons';
import { Logo } from '@/components/shared/Logo';

/** Social icon component map */
const SOCIAL_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Twitter: TwitterIcon,
  Instagram: InstagramIcon,
  Github: GithubIcon,
};

/**
 * Footer — Minimal premium footer.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();
  const enabledFooterGroups = navigationConfig.footer;
  const enabledSocial = navigationConfig.social.filter((s) => s.enabled);

  return (
    <footer
      className="border-t border-[var(--vl-border)] bg-[var(--vl-bg-primary)]"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top row: Logo + Link Groups */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-8 mb-8">
          {/* Brand */}
          <div className="flex-shrink-0">
            <Link href="/" id="footer-logo" aria-label={`${brandConfig.name} — Home`}>
              <Logo className="h-8 w-auto mb-3" variant="full" />
            </Link>
            <p className="text-sm text-[var(--vl-text-secondary)] max-w-xs leading-relaxed">
              Premium creator analytics intelligence platform.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2 mt-4">
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
                    className="vl-btn vl-btn-ghost vl-btn-icon vl-btn-sm"
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link groups */}
          <div className="flex flex-wrap gap-12">
            {enabledFooterGroups.map((group) => (
              <div key={group.title}>
                <h3 className="vl-label mb-3">
                  {group.title}
                </h3>
                <ul className="space-y-2" role="list">
                  {group.items
                    .filter((item) => item.enabled)
                    .map((item) => (
                      <li key={item.id}>
                        <Link
                          href={item.href}
                          id={item.id}
                          className="
                            text-sm text-[var(--vl-text-secondary)]
                            hover:text-[var(--vl-text-primary)]
                            vl-transition-fast
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
        </div>

        {/* Bottom row: Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-[var(--vl-border)]">
          <p className="text-xs text-[var(--vl-text-tertiary)]">
            © {currentYear} {brandConfig.name}. All rights reserved.
          </p>
          <p className="text-xs text-[var(--vl-text-disabled)]">
            Powered by {brandConfig.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
