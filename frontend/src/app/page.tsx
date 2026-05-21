/**
 * Viewlytics — Homepage (Stage 01)
 *
 * Página principal de la plataforma. Ensambla todas las secciones en orden:
 *
 * 1. Navbar
 * 2. HeroSection              — Cinematic hero con búsqueda y mini-dashboard
 * 3. LiveAnalyticsPreview     — Dashboard analítico interactivo de demostración
 * 4. RankingsPreview          — Top creators con tabs de categorías
 * 5. ExportCardsSection       — Tarjetas de exportación social
 * 6. FeaturesSection          — Grid de características de la plataforma
 * 7. TrustedCreatorsSection   — Vitrina de creadores dominicanos
 * 8. CtaBanner                — Banner de conversión final
 * 9. Footer
 *
 * @see execution-pack/08-stage-prompts.md — Stage 01 requirements
 * @see src/config/homepage.ts — Homepage configuration
 */

import type { Metadata } from 'next';
import { brandConfig } from '@/config/branding';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/homepage/HeroSection';
import { LiveAnalyticsPreview } from '@/components/homepage/LiveAnalyticsPreview';
import { RankingsPreview } from '@/components/homepage/RankingsPreview';
import { ExportCardsSection } from '@/components/homepage/ExportCardsSection';
import { FeaturesSection } from '@/components/homepage/FeaturesSection';
import { TrustedCreatorsSection } from '@/components/homepage/TrustedCreatorsSection';
import { CtaBanner } from '@/components/homepage/CtaBanner';

/** SEO metadata específico para la homepage */
export const metadata: Metadata = {
  title: `${brandConfig.name} — ${brandConfig.tagline}`,
  description:
    'Track creator growth, explore Dominican creator rankings, and generate shareable analytics cards. Viewlytics is the premium creator analytics intelligence platform.',
  openGraph: {
    title: `${brandConfig.name} — ${brandConfig.tagline}`,
    description:
      'Premium analytics intelligence for Dominican podcasters, streamers, and digital media creators.',
    url: 'https://viewlytics.rd',
    type: 'website',
  },
};

/**
 * HomePage — Punto de entrada de la plataforma Viewlytics.
 * Componente servidor de Next.js (App Router).
 */
export default function HomePage() {
  return (
    <>
      {/* Global navigation */}
      <Navbar />

      {/* Page content */}
      <main id="main-content" className="flex flex-col">
        {/* 1. Cinematic hero with creator search */}
        <HeroSection />

        {/* 2. Live analytics dashboard preview */}
        <LiveAnalyticsPreview />

        {/* 3. Rankings preview with category tabs */}
        <RankingsPreview />

        {/* 4. Social export cards showcase */}
        <ExportCardsSection />

        {/* 5. Platform features grid */}
        <FeaturesSection />

        {/* 6. Trusted Dominican creators marquee */}
        <TrustedCreatorsSection />

        {/* 7. Final conversion CTA banner */}
        <CtaBanner />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
