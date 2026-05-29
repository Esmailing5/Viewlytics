import type { Metadata } from 'next';
import { brandConfig } from '@/config/branding';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Mail, AtSign, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: `Contacto | ${brandConfig.name}`,
  description: 'Ponte en contacto con el equipo de Viewlytics.',
};

export default function ContactPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-20 max-w-4xl min-h-[70vh]">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--vl-text-primary)] mb-8">Contacto</h1>
        <p className="text-lg text-[var(--vl-text-secondary)] mb-12 leading-relaxed">
          ¿Tienes alguna pregunta, sugerencia de un nuevo creador, o encontraste algún error en los datos estadísticos? 
          Nos encantaría saber de ti para seguir mejorando {brandConfig.name}. A continuación, te mostramos las formas 
          principales de ponerte en contacto con nuestro equipo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 rounded-3xl bg-[var(--vl-bg-primary)] border border-[var(--vl-border)] flex flex-col items-start transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl mb-6">
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--vl-text-primary)] mb-3">Soporte y Negocios</h3>
            <p className="text-[var(--vl-text-secondary)] mb-8">
              Para consultas de negocios, reportes de errores en los canales, reclamos de perfiles o soporte técnico.
            </p>
            <a href="mailto:soporte@viewlytics.rd" className="mt-auto inline-flex items-center gap-2 text-blue-500 font-semibold hover:underline">
              <Mail className="w-4 h-4" /> soporte@viewlytics.rd
            </a>
          </div>

          <div className="p-8 rounded-3xl bg-[var(--vl-bg-primary)] border border-[var(--vl-border)] flex flex-col items-start transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl mb-6">
              <AtSign className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--vl-text-primary)] mb-3">Redes Sociales</h3>
            <p className="text-[var(--vl-text-secondary)] mb-8">
              Síguenos para recibir las últimas actualizaciones de la plataforma, tendencias virales y nuevos rankings.
            </p>
            <a href="#" className="mt-auto inline-flex items-center gap-2 text-purple-500 font-semibold hover:underline">
              <AtSign className="w-4 h-4" /> @viewlytics_rd
            </a>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-[var(--vl-bg-surface)] border border-[var(--vl-border)] text-center">
          <div className="inline-flex p-3 bg-[var(--vl-bg-primary)] text-[var(--vl-text-secondary)] rounded-full mb-4 shadow-sm border border-[var(--vl-border)]">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[var(--vl-text-primary)] mb-2">Oficinas Virtuales</h3>
          <p className="text-[var(--vl-text-secondary)]">
            Operamos principalmente de forma remota, enfocados en la comunidad de creadores digitales en República Dominicana y Latinoamérica.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
