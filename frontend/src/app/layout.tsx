import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { Viewport } from 'next';
import { brandConfig } from '@/config/branding';
import Providers from '@/lib/providers';
import './globals.css';

// Cargar la fuente Inter desde Google Fonts, configurando la variable para coincidir con nuestro token de Tailwind CSS
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

/**
 * Configuración de Metadatos SEO Raíz
 * 
 * Impone valores de configuración de marca dinámicos en lugar de codificar títulos a mano.
 * Configurado específicamente para una indexación de búsqueda óptima (estándar SEO).
 * 
 * @see execution-pack/03-configuration-system.md
 * @see execution-pack/17-deployment-system.md — Requisitos de SEO
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
    'Creator Intelligence'
  ],
  authors: [{ name: 'Viewlytics Team' }],
  robots: {
    index: true,
    follow: true,
  },
  // Etiquetas estándar OpenGraph
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
      className={`${inter.variable} h-full antialiased dark`}
      style={{ colorScheme: 'dark' }}
    >
      <body className="min-h-full flex flex-col bg-deep-navy text-soft-white selection:bg-accent-orange/30 selection:text-soft-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
