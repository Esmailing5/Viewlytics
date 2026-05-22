import Link from 'next/link';
import { Search, Activity, Trophy } from 'lucide-react';
import { homepageConfig } from '@/config/homepage';

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
        <div className="max-w-3xl mx-auto relative group mb-12">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-blue)] opacity-25 blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>
          <div className="relative flex items-center bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-xl overflow-hidden">
            <Search className="w-6 h-6 text-[var(--text-secondary)] ml-6" />
            <input 
              type="text" 
              placeholder="Busca un creador, podcast o canal..." 
              className="flex-1 h-16 px-6 bg-transparent text-lg text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none"
            />
            <button className="h-16 px-8 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-blue)] text-white font-semibold text-lg hover:opacity-90 transition-opacity flex items-center gap-2">
              Analizar
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href={homepageConfig.hero.ctaHref} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-surface)] hover:border-[var(--accent-cyan)] transition-all">
            <Search className="w-4 h-4 text-[var(--accent-cyan)]" />
            {homepageConfig.hero.ctaText}
          </Link>
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
