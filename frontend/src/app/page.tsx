/**
 * Viewlytics — Public Homepage (Phase 1.5)
 *
 * Modern SaaS marketing landing page.
 * Acts as the entry point to the Creator Analytics platform.
 */

import type { Metadata } from 'next';
import { brandConfig } from '@/config/branding';
import { PublicLayout } from '@/components/layout/PublicLayout';

import { HeroSection } from '@/components/homepage/HeroSection';
import { TrendingPreview } from '@/components/homepage/TrendingPreview';
import { RankingsPreview } from '@/components/homepage/RankingsPreview';
import { PlatformSupport } from '@/components/homepage/PlatformSupport';
import { FeatureGrid } from '@/components/homepage/FeatureGrid';
import { CtaSection } from '@/components/homepage/CtaSection';

export const metadata: Metadata = {
  title: `${brandConfig.name} — ${brandConfig.tagline}`,
  description: 'Descubre analíticas, crecimiento y tendencias de creadores en YouTube, Twitch y Kick.',
};

export default function HomePage() {
  return (
    <PublicLayout>
      <HeroSection />
      <TrendingPreview />
      <RankingsPreview />
      <PlatformSupport />
      <FeatureGrid />
      <CtaSection />
    </PublicLayout>
  );
}
