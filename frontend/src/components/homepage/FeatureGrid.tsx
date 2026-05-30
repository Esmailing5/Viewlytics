'use client';

import { homepageConfig } from '@/config/homepage';
import * as LucideIcons from 'lucide-react';
import { motion } from 'framer-motion';

export function FeatureGrid() {
  return (
    <section className="py-28 bg-[var(--vl-bg-secondary)] border-t border-[var(--vl-border)] relative">
      {/* Background ambient light */}
      <div className="absolute bottom-[-10%] right-1/4 w-[350px] h-[350px] bg-[var(--vl-purple-glow)] rounded-full blur-[100px] opacity-25 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--vl-purple-soft)] border border-[var(--vl-purple)/15] mb-4">
            <LucideIcons.Sparkles className="w-3.5 h-3.5 text-[var(--vl-purple)]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--vl-purple)]">Analítica Avanzada</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--vl-text-primary)] mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Herramientas de Precisión
          </h2>
          <p className="text-base md:text-lg text-[var(--vl-text-secondary)] leading-relaxed">
            Todo lo necesario para comprender el ecosistema digital dominicano, desde auditorías de crecimiento histórico hasta monitoreo en tiempo real.
          </p>
        </div>

        {/* Features Grid */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.05 }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {homepageConfig.features.map((feature, idx) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const Icon = (LucideIcons as any)[feature.icon] || LucideIcons.BarChart3;

            // Alternate colors for subtle visual variety
            const accentColors = idx % 2 === 0 
              ? { border: 'hover:border-[var(--vl-red)]/30', text: 'text-[var(--vl-red)]', bg: 'bg-[var(--vl-red-soft)]' }
              : { border: 'hover:border-[var(--vl-cyan)]/30', text: 'text-[var(--vl-cyan)]', bg: 'bg-[var(--vl-cyan-soft)]' };

            return (
              <motion.div
                key={feature.id}
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  show: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative p-8 rounded-2xl bg-[var(--vl-bg-surface)]/60 backdrop-blur-md border border-[var(--vl-border)] transition-all duration-300 ${accentColors.border} hover:-translate-y-1 hover:shadow-2xl overflow-hidden`}
              >
                {/* Visual Accent Glow on Hover */}
                <div className="absolute -right-16 -bottom-16 w-32 h-32 bg-gradient-to-br from-white/[0.01] to-white/[0.04] rounded-full blur-2xl group-hover:scale-150 transition-all duration-500" />
                
                <div className="relative z-10">
                  {/* Icon Wrapper */}
                  <div className={`w-12 h-12 rounded-xl ${accentColors.bg} flex items-center justify-center mb-6 border border-white/[0.02] group-hover:scale-105 transition-transform duration-300`}>
                    <Icon className={`w-5 h-5 ${accentColors.text}`} />
                  </div>
                  
                  <h3 className="text-lg font-bold text-[var(--vl-text-primary)] mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-xs md:text-sm text-[var(--vl-text-secondary)] leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
