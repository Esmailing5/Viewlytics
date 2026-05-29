import { PlaySquare, MonitorPlay, Tv } from 'lucide-react';

export function PlatformSupport() {
  return (
    <section className="py-24 bg-[var(--vl-bg-primary)]">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold text-[var(--vl-text-secondary)] mb-12">
          Soporte Multiplataforma Integrado
        </h2>

        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          <div className="flex flex-col items-center gap-4 group">
            <div className="w-20 h-20 rounded-2xl bg-[var(--vl-bg-surface)] border border-[var(--vl-border)] flex items-center justify-center group-hover:border-[#FF0000] vl-transition shadow-lg">
              <PlaySquare className="w-10 h-10 text-[#FF0000]" />
            </div>
            <span className="font-semibold text-[var(--vl-text-primary)]">YouTube</span>
          </div>

          <div className="flex flex-col items-center gap-4 group">
            <div className="w-20 h-20 rounded-2xl bg-[var(--vl-bg-surface)] border border-[var(--vl-border)] flex items-center justify-center group-hover:border-[#9146FF] vl-transition shadow-lg">
              <Tv className="w-10 h-10 text-[#9146FF]" />
            </div>
            <span className="font-semibold text-[var(--vl-text-primary)]">Twitch</span>
          </div>

          <div className="flex flex-col items-center gap-4 group">
            <div className="w-20 h-20 rounded-2xl bg-[var(--vl-bg-surface)] border border-[var(--vl-border)] flex items-center justify-center group-hover:border-[#53FC18] vl-transition shadow-lg">
              <MonitorPlay className="w-10 h-10 text-[#53FC18]" />
            </div>
            <span className="font-semibold text-[var(--vl-text-primary)]">Kick</span>
          </div>
        </div>
      </div>
    </section>
  );
}
