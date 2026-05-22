import Link from 'next/link';
import { Trophy, ChevronRight } from 'lucide-react';
import { FEATURED_RANKINGS } from '@/constants/dashboard-mock-data';

export function RankingsPreview() {
  return (
    <section className="py-24 bg-[var(--bg-surface)] border-y border-[var(--border-color)]">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
            Rankings Oficiales
          </h2>
          <p className="text-lg text-[var(--text-secondary)]">
            Descubre quién domina en cada categoría. Nuestra plataforma analiza el rendimiento de miles de canales para ofrecer los rankings más precisos de la República Dominicana.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-[var(--bg-main)] rounded-3xl border border-[var(--border-color)] shadow-xl overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)] bg-[var(--bg-surface)]">
            <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" /> Top 5 Global
            </h3>
            <span className="text-xs font-medium text-[var(--text-secondary)] bg-[var(--bg-main)] px-3 py-1 rounded-full border border-[var(--border-color)]">
              Actualizado hoy
            </span>
          </div>

          <div className="divide-y divide-[var(--border-color)]">
            {FEATURED_RANKINGS.map((entry) => (
              <Link
                key={entry.rank}
                href={`/channel/${entry.platform}/${entry.slug}`}
                className="group flex items-center gap-4 p-4 hover:bg-[var(--bg-surface)] transition-colors"
              >
                <div className="w-8 text-center font-bold text-[var(--text-secondary)] group-hover:text-[var(--accent-cyan)] transition-colors">
                  #{entry.rank}
                </div>
                
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-blue)] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {entry.avatarInitials}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--accent-cyan)] transition-colors">
                    {entry.creatorName}
                  </h4>
                  <div className="text-xs text-[var(--text-secondary)] flex items-center gap-2">
                    <span className="capitalize">{entry.platform}</span>
                    <span>•</span>
                    <span>{entry.category}</span>
                  </div>
                </div>

                <div className="hidden sm:block text-right">
                  <div className="text-sm font-semibold text-[var(--text-primary)]">{entry.followers}</div>
                  <div className="text-xs text-[var(--text-secondary)]">Seguidores</div>
                </div>

                <div className="hidden md:block text-right pl-6">
                  <div className="text-sm font-semibold text-[var(--text-primary)]">{entry.views}</div>
                  <div className="text-xs text-[var(--text-secondary)]">Vistas Totales</div>
                </div>

                <div className="pl-4 sm:pl-6 text-green-500 font-medium text-sm">
                  {entry.growth}
                </div>

                <div className="pl-4 text-[var(--text-secondary)] group-hover:text-[var(--accent-cyan)] transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </Link>
            ))}
          </div>

          <div className="p-4 bg-[var(--bg-surface)] border-t border-[var(--border-color)] text-center">
            <Link href="/rankings" className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[var(--accent-cyan)] hover:text-[var(--accent-blue)] transition-colors">
              Ver el Ranking Completo <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
