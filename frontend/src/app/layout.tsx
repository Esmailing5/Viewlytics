import type { Metadata } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import type { Viewport } from 'next';
import { brandConfig } from '@/config/branding';
import Providers from '@/lib/providers';
import './globals.css';

/**
 * Font Loading — Viewlytics Design System v2
 *
 * Three font families:
 * - Inter: Body text, UI elements (Google Fonts)
 * - Satoshi: Headings, display text (Fontshare CDN)
 * - Geist Mono: Code, data, metrics (Google Fonts)
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

/**
 * Root SEO Metadata Configuration
 *
 * Uses dynamic brand config values instead of hardcoding titles.
 * Optimized for search engine indexing (SEO standard).
 *
 * @see execution-pack/03-configuration-system.md
 * @see execution-pack/17-deployment-system.md — SEO requirements
 */
export const metadata: Metadata = {
  title: {
    default: `${brandConfig.name} — ${brandConfig.tagline}`,
    template: `%s | ${brandConfig.name}`,
  },
  description: 'Premium creator analytics intelligence platform. Track growth, detect trends, and analyze metrics for Dominican podcasters, streamers, and digital media.',
  keywords: [
    'Viewlytics', 'Viewlytics RD', 'Creator Analytics', 'Dominican Creators',
    'Podcast Analytics', 'Streamer Stats', 'YouTube DR', 'Twitch Dominica',
    'Creator Intelligence',
  ],
  authors: [{ name: 'Viewlytics Team' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'es_DO',
    url: 'https://viewlytics.rd',
    siteName: brandConfig.name,
    title: `${brandConfig.name} — ${brandConfig.tagline}`,
    description: 'Track creator growth, analyze content trends, and generate shareable rankings for Dominican media.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Satoshi font from Fontshare (self-hosted CDN — free for commercial use) */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700,800&display=swap"
          rel="stylesheet"
        />
        {/* Map Satoshi to CSS variable for design system tokens */}
        <style dangerouslySetInnerHTML={{ __html: `:root { --font-satoshi: 'Satoshi', sans-serif; }` }} />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
