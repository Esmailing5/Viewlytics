import type { Metadata } from 'next';
import { brandConfig } from '@/config/branding';
import { PublicLayout } from '@/components/layout/PublicLayout';

export const metadata: Metadata = {
  title: `Acerca de | ${brandConfig.name}`,
  description: 'Conoce más sobre Viewlytics y nuestra misión de democratizar las analíticas de creadores.',
};

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-20 max-w-4xl min-h-[70vh]">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--vl-text-primary)] mb-8">Acerca de {brandConfig.name}</h1>
        <div className="space-y-6 text-lg text-[var(--vl-text-secondary)] leading-relaxed">
          <p>
            {brandConfig.name} nació con una misión simple: democratizar el acceso a las analíticas de creadores de contenido.
            Inspirados por plataformas líderes en la industria, hemos construido una herramienta poderosa pero fácil de usar 
            para rastrear el crecimiento, descubrir tendencias y analizar el rendimiento en YouTube, Twitch y más plataformas.
          </p>
          <p>
            Entendemos que en la era digital actual, los datos son fundamentales. Ya seas un creador buscando entender a tu audiencia, 
            una marca buscando su próxima colaboración, o simplemente un fan curioso sobre las estadísticas de tus ídolos, 
            {brandConfig.name} te proporciona los datos que necesitas de forma clara y accesible.
          </p>
          <h2 className="text-2xl font-bold text-[var(--vl-text-primary)] mt-12 mb-4">Nuestra Visión</h2>
          <p>
            Queremos ser el destino principal para el análisis de creadores en la región, ofreciendo estimaciones precisas de ingresos,
            métricas de crecimiento en tiempo real y clasificaciones detalladas que empoderen a la comunidad digital a tomar mejores decisiones.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
