import Link from 'next/link';
import { Search, Activity, Trophy } from 'lucide-react';
import { homepageConfig } from '@/config/homepage';
import { SearchInput } from '@/components/shared/SearchInput';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 pb-32">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 bg-[var(--bg-main)]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--accent-cyan)] opacity-20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--accent-blue)] opacity-20 blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] mb-8 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-[var(--accent-cyan)] animate-pulse"></span>
          <span className="text-xs font-medium text-[var(--text-secondary)] tracking-wide uppercase">
            Plataforma en vivo — Fase 1.5
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-[var(--text-primary)] tracking-tight max-w-5xl mx-auto leading-tight mb-8">
          Analítica <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-blue)]">Inteligente</span> para Creadores
        </h1>

        <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-12 leading-relaxed">
          {homepageConfig.hero.subtitle}
        </p>

        {/* Big Search Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-blue)] opacity-25 blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>
            <SearchInput />
          </div>
          <div className="mt-4 flex items-center justify-center text-sm font-medium text-[var(--text-secondary)]">
            <span className="opacity-80">¿Buscas usar filtros avanzados?</span>
            <Link href={homepageConfig.hero.ctaHref} className="ml-2 flex items-center gap-1 text-[var(--text-primary)] hover:text-[var(--accent-cyan)] transition-colors">
              <Search className="w-3.5 h-3.5" />
              Explorar directorio
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href={homepageConfig.hero.secondaryCtaHref} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-surface)] hover:border-[var(--accent-blue)] transition-all">
            <Trophy className="w-4 h-4 text-[var(--accent-blue)]" />
            {homepageConfig.hero.secondaryCtaText}
          </Link>
          <Link href="/trending" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-surface)] hover:text-white transition-all">
            <Activity className="w-4 h-4 text-green-500" />
            En Tendencia
          </Link>
        </div>
      </div>
    </section>
  );
}
