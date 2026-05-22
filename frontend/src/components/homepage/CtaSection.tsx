import Link from 'next/link';
import { Search } from 'lucide-react';
import { homepageConfig } from '@/config/homepage';

export function CtaSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-main)] via-[var(--bg-surface)] to-[var(--bg-main)]" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-blue)] rounded-full blur-[120px] opacity-10" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6 max-w-3xl mx-auto">
          {homepageConfig.cta.title}
        </h2>
        
        <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto">
          {homepageConfig.cta.subtitle}
        </p>

        <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
            <input 
              type="text" 
              placeholder="Ej. Alofoke Radio Show..." 
              className="w-full h-14 pl-12 pr-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-cyan)] transition-colors shadow-inner"
            />
          </div>
          <Link 
            href="/search"
            className="flex items-center justify-center h-14 px-8 rounded-xl bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-blue)] text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-[var(--accent-blue)]/20 whitespace-nowrap"
          >
            Buscar Ahora
          </Link>
        </div>
      </div>
    </section>
  );
}
