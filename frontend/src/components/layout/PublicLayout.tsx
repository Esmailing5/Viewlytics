/**
 * Viewlytics — PublicLayout v3
 *
 * Layout wrapper for public-facing pages (homepage, about, contact, etc.).
 * Uses the redesigned Navbar and Footer.
 */

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--vl-bg-primary)]">
      {/* Global Navbar */}
      <Navbar />

      {/* Spacer to account for fixed navbar height (60px) */}
      <div className="h-[60px] flex-shrink-0" aria-hidden="true" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {children}
      </main>

      <Footer />
    </div>
  );
}
