import Link from 'next/link';
import { homepageConfig } from '@/config/homepage';
import { SearchInput } from '@/components/shared/SearchInput';

export function CtaSection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-main)] via-[var(--bg-surface)] to-[var(--bg-main)]" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-blue)] rounded-full blur-[120px] opacity-10" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6 max-w-3xl mx-auto">
          {homepageConfig.cta.title}
        </h2>
        
        <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto">
          {homepageConfig.cta.subtitle}
        </p>

        <div className="max-w-2xl mx-auto relative group">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-blue)] opacity-25 blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>
          <SearchInput />
        </div>
      </div>
    </section>
  );
}
