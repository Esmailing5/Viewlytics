import { homepageConfig } from '@/config/homepage';
import * as LucideIcons from 'lucide-react';

export function FeatureGrid() {
  return (
    <section className="py-24 bg-[var(--vl-bg-primary)]">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--vl-text-primary)] mb-4">
            Herramientas Premium
          </h2>
          <p className="text-lg text-[var(--vl-text-secondary)]">
            Todo lo que necesitas para entender el ecosistema digital, desde visualizaciones históricas hasta monitoreo en tiempo real.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homepageConfig.features.map((feature) => {
            // Dynamically grab the icon component
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const Icon = (LucideIcons as any)[feature.icon] || LucideIcons.BarChart3;

            return (
              <div
                key={feature.id}
                className="group relative p-8 rounded-3xl bg-[var(--vl-bg-surface)] border border-[var(--vl-border)] hover:border-[var(--vl-red)] vl-transition overflow-hidden"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--vl-red)] to-[var(--vl-cyan)] opacity-0 group-hover:opacity-5 vl-transition" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--vl-bg-primary)] border border-[var(--vl-border)] flex items-center justify-center mb-6 group-hover:border-[var(--vl-red)] vl-transition-fast">
                    <Icon className="w-6 h-6 text-[var(--vl-red)]" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-[var(--vl-text-primary)] mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-[var(--vl-text-secondary)] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
