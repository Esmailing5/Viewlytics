/**
 * Viewlytics — Homepage (Phase 1.5)
 *
 * Dashboard-first homepage. The landing page has been replaced with
 * a live analytics dashboard preview that immediately communicates:
 * analytics, creator intelligence, real-time metrics, platform monitoring.
 *
 * Layout: DashboardLayout (Sidebar + Topbar + Footer) → DashboardGrid
 *
 * @see components/layout/DashboardLayout.tsx — Layout wrapper
 * @see components/dashboard/DashboardGrid.tsx — Dashboard content
 */

import type { Metadata } from 'next';
import { brandConfig } from '@/config/branding';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';

/** SEO metadata for the homepage */
export const metadata: Metadata = {
  title: `${brandConfig.name} — ${brandConfig.tagline}`,
  description:
    'Premium creator analytics intelligence platform. Track growth, explore real-time metrics, and monitor streaming platforms. Viewlytics is the analytics dashboard for Dominican creators.',
  openGraph: {
    title: `${brandConfig.name} — ${brandConfig.tagline}`,
    description:
      'Premium analytics intelligence for Dominican podcasters, streamers, and digital media creators.',
    url: 'https://viewlytics.rd',
    type: 'website',
  },
};

/**
 * HomePage — Dashboard-first entry point for the Viewlytics platform.
 * Next.js App Router server component.
 */
export default function HomePage() {
  return (
    <DashboardLayout>
      <DashboardGrid />
    </DashboardLayout>
  );
}
