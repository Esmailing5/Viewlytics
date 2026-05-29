import Link from 'next/link';
import { Search, Activity, Trophy } from 'lucide-react';
import { homepageConfig } from '@/config/homepage';
import { SearchInput } from '@/components/shared/SearchInput';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 pb-32">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 bg-[var(--vl-bg-primary)]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--vl-red)] opacity-[0.07] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--vl-cyan)] opacity-[0.07] blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--vl-bg-surface)] border border-[var(--vl-border)] mb-8 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-[var(--vl-red)] vl-animate-pulse"></span>
          <span className="vl-label">
            Plataforma en vivo — Fase 1.5
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-[var(--vl-text-primary)] tracking-tighter max-w-5xl mx-auto leading-tight mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
          Analítica <span className="vl-text-gradient-brand">Inteligente</span> para Creadores
        </h1>

        <p className="text-lg md:text-xl text-[var(--vl-text-secondary)] max-w-2xl mx-auto mb-12 leading-relaxed">
          {homepageConfig.hero.subtitle}
        </p>

        {/* Big Search Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl opacity-20 blur-xl group-hover:opacity-35 vl-transition-slow" style={{ background: 'var(--vl-gradient-brand)' }}></div>
            <SearchInput />
          </div>
          <div className="mt-4 flex items-center justify-center text-sm font-medium text-[var(--vl-text-secondary)]">
            <span className="opacity-80">¿Buscas usar filtros avanzados?</span>
            <Link href={homepageConfig.hero.ctaHref} className="ml-2 flex items-center gap-1 text-[var(--vl-text-primary)] hover:text-[var(--vl-red)] vl-transition-fast">
              <Search className="w-3.5 h-3.5" />
              Explorar directorio
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href={homepageConfig.hero.secondaryCtaHref} className="vl-btn vl-btn-secondary vl-btn-lg">
            <Trophy className="w-4 h-4 text-[var(--vl-red)]" />
            {homepageConfig.hero.secondaryCtaText}
          </Link>
          <Link href="/trending" className="vl-btn vl-btn-secondary vl-btn-lg">
            <Activity className="w-4 h-4 text-[var(--vl-success)]" />
            En Tendencia
          </Link>
        </div>
      </div>
    </section>
  );
}
