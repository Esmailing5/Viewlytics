import { homepageConfig } from '@/config/homepage';
import * as LucideIcons from 'lucide-react';

export function FeatureGrid() {
  return (
    <section className="py-24 bg-[var(--bg-main)]">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
            Herramientas Premium
          </h2>
          <p className="text-lg text-[var(--text-secondary)]">
            Todo lo que necesitas para entender el ecosistema digital, desde visualizaciones históricas hasta monitoreo en tiempo real.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homepageConfig.features.map((feature) => {
            // Dynamically grab the icon component
            const Icon = (LucideIcons as Record<string, React.ElementType>)[feature.icon] || LucideIcons.BarChart3;

            return (
              <div
                key={feature.id}
                className="group relative p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--accent-cyan)] transition-colors duration-300 overflow-hidden"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-blue)] opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center mb-6 group-hover:border-[var(--accent-cyan)] transition-colors">
                    <Icon className="w-6 h-6 text-[var(--accent-cyan)]" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-[var(--text-secondary)] leading-relaxed">
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
