import Link from 'next/link';
import { TrendingUp, Users } from 'lucide-react';
import { TRENDING_CREATORS } from '@/constants/dashboard-mock-data';

export function TrendingPreview() {
  return (
    <section className="py-24 bg-[var(--vl-bg-primary)]">
      <div className="container mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-[var(--vl-text-primary)] flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-[var(--vl-cyan)]" />
              Creadores en Tendencia
            </h2>
            <p className="text-[var(--vl-text-secondary)] mt-2">Los canales con mayor crecimiento en las últimas 24 horas.</p>
          </div>
          <Link href="/trending" className="hidden sm:inline-flex items-center text-sm font-medium text-[var(--vl-cyan)] hover:text-[var(--vl-cyan-hover)] vl-transition-fast">
            Ver tendencias completas &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRENDING_CREATORS.slice(0, 6).map((creator) => (
            <Link 
              key={creator.id} 
              href={`/channel/${creator.platform}/${creator.slug}`}
              className="group flex items-center justify-between p-4 rounded-2xl bg-[var(--vl-bg-surface)] border border-[var(--vl-border)] hover:border-[var(--vl-cyan)] vl-transition hover:shadow-lg hover:shadow-[var(--vl-cyan-glow)]"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--vl-cyan)] to-[var(--vl-purple)] flex items-center justify-center text-white font-bold text-lg group-hover:scale-105 vl-transition">
                  {creator.avatarInitials}
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--vl-text-primary)] group-hover:text-[var(--vl-cyan)] vl-transition-fast">
                    {creator.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-medium text-[var(--vl-text-secondary)] capitalize">{creator.platform}</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--vl-border)]" />
                    <span className="text-xs font-medium text-[var(--vl-success)] flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> {creator.growth}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-bold text-[var(--vl-text-primary)]">{creator.viewers}</div>
                <div className="text-xs text-[var(--vl-text-secondary)] flex items-center gap-1 justify-end">
                  <Users className="w-3 h-3" /> views
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
