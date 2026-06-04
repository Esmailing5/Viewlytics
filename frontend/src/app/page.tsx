import type { Metadata } from 'next';
import { brandConfig } from '@/config/branding';
import { PublicLayout } from '@/components/layout/PublicLayout';

import { HeroSection } from '@/components/homepage/HeroSection';
import { RankingsPreview } from '@/components/homepage/RankingsPreview';
import { PlatformSupport } from '@/components/homepage/PlatformSupport';
import { FeatureGrid } from '@/components/homepage/FeatureGrid';
import { CtaSection } from '@/components/homepage/CtaSection';

export const metadata: Metadata = {
  title: `${brandConfig.name} — ${brandConfig.tagline}`,
  description: 'Descubre analíticas, crecimiento y tendencias de creadores en YouTube, Twitch y Kick.',
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function getGlobalStats() {
  try {
    const res = await fetch(`${apiUrl}/api/stats/global`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch global stats');
    return await res.json();
  } catch (error) {
    console.error('[Page Loader] Error loading global stats:', error);
    return {
      totalCreators: 0,
      trackedCreators: 0,
      totalSubscribers: 0,
      totalViews30d: 0,
      updatedAt: new Date().toISOString().split('T')[0],
    };
  }
}

async function getRankings() {
  try {
    const res = await fetch(`${apiUrl}/api/rankings/impact-total?limit=7`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch rankings');
    return await res.json();
  } catch (error) {
    console.error('[Page Loader] Error loading rankings:', error);
    return {
      snapshotDate: new Date().toISOString().split('T')[0],
      total: 0,
      page: 1,
      limit: 7,
      results: [],
    };
  }
}

export default async function HomePage() {
  const [globalStats, rankingsData] = await Promise.all([
    getGlobalStats(),
    getRankings(),
  ]);

  return (
    <PublicLayout>
      <HeroSection globalStats={globalStats} />
      <RankingsPreview data={rankingsData} />
      <PlatformSupport />
      <FeatureGrid />
      <CtaSection />
    </PublicLayout>
  );
}
