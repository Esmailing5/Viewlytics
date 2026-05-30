'use client';

import { homepageConfig } from '@/config/homepage';
import { SearchInput } from '@/components/shared/SearchInput';
import { motion } from 'framer-motion';

export function CtaSection() {
  return (
    <section className="py-32 relative bg-[var(--vl-bg-primary)] border-t border-[var(--vl-border)] vl-noise-container z-10">
      {/* Cinematic backing mesh wrapper to prevent horizontal overflow without clipping the dropdown */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--vl-bg-primary)] via-[var(--vl-bg-surface)]/20 to-[var(--vl-bg-primary)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-[var(--vl-red)]/10 to-[var(--vl-cyan)]/10 rounded-full blur-[130px] opacity-40" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-[var(--vl-text-primary)] tracking-tight mb-6 max-w-3xl mx-auto leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            {homepageConfig.cta.title}
          </h2>
          
          <p className="text-base md:text-lg text-[var(--vl-text-secondary)] mb-12 max-w-2xl mx-auto font-medium">
            {homepageConfig.cta.subtitle}
          </p>

          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute -inset-1 rounded-3xl opacity-10 blur-xl group-hover:opacity-20 transition duration-500 bg-gradient-to-r from-[var(--vl-red)] to-[var(--vl-cyan)]" />
            <SearchInput />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
