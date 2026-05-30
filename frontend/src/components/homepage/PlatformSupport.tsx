'use client';

import { PlaySquare, MonitorPlay, Tv, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function PlatformSupport() {
  const platforms = [
    {
      name: 'YouTube',
      desc: 'Analíticas de streams, vídeos y shorts en vivo.',
      color: '#FF0000',
      bgColor: 'hover:bg-red-500/5',
      borderColor: 'hover:border-red-500/30',
      shadowColor: 'hover:shadow-red-500/5',
      icon: <PlaySquare className="w-8 h-8 text-[#FF0000]" />
    },
    {
      name: 'Twitch',
      desc: 'Monitoreo de streams activos y chat stats.',
      color: '#9146FF',
      bgColor: 'hover:bg-purple-500/5',
      borderColor: 'hover:border-purple-500/30',
      shadowColor: 'hover:shadow-purple-500/5',
      icon: <Tv className="w-8 h-8 text-[#9146FF]" />
    },
    {
      name: 'Kick',
      desc: 'Estadísticas del nuevo hub de transmisiones.',
      color: '#53FC18',
      bgColor: 'hover:bg-green-500/5',
      borderColor: 'hover:border-green-500/30',
      shadowColor: 'hover:shadow-green-500/5',
      icon: <MonitorPlay className="w-8 h-8 text-[#53FC18]" />
    }
  ];

  return (
    <section className="py-24 bg-[var(--vl-bg-primary)] relative border-t border-[var(--vl-border)]">
      <div className="container mx-auto px-6 text-center relative z-10">
        
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--vl-text-tertiary)] mb-4">
          Integración de Plataformas
        </h2>
        
        <h3 className="text-2xl md:text-4xl font-extrabold text-[var(--vl-text-primary)] mb-14 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          Soporte Multiplataforma Integrado
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {platforms.map((platform, idx) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`group flex flex-col items-center text-center p-8 rounded-2xl bg-[var(--vl-bg-surface)]/45 border border-[var(--vl-border)] transition-all duration-300 ${platform.bgColor} ${platform.borderColor} ${platform.shadowColor} hover:-translate-y-1`}
            >
              <div className="w-16 h-16 rounded-xl bg-[var(--vl-bg-primary)] border border-[var(--vl-border)] flex items-center justify-center mb-6 group-hover:scale-105 transition-all duration-300 shadow-lg">
                {platform.icon}
              </div>
              <span className="font-extrabold text-lg text-[var(--vl-text-primary)] mb-2">{platform.name}</span>
              <span className="text-xs text-[var(--vl-text-secondary)] leading-relaxed font-medium max-w-[200px]">
                {platform.desc}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
