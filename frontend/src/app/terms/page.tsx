import type { Metadata } from 'next';
import { brandConfig } from '@/config/branding';
import { PublicLayout } from '@/components/layout/PublicLayout';

export const metadata: Metadata = {
  title: `Términos de Servicio | ${brandConfig.name}`,
  description: 'Términos y condiciones de uso de Viewlytics.',
};

export default function TermsPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-20 max-w-4xl min-h-[70vh]">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--vl-text-primary)] mb-8">Términos de Servicio</h1>
        <div className="space-y-6 text-[var(--vl-text-secondary)] leading-relaxed">
          <p className="text-sm">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>

          <h2 className="text-2xl font-bold text-[var(--vl-text-primary)] mt-8 mb-4">1. Aceptación de los Términos</h2>
          <p>
            Al acceder y utilizar {brandConfig.name}, usted acepta estar sujeto a estos Términos de Servicio. Si no está de 
            acuerdo con alguna parte de los términos, no podrá acceder al servicio y deberá dejar de utilizarlo inmediatamente.
          </p>

          <h2 className="text-2xl font-bold text-[var(--vl-text-primary)] mt-8 mb-4">2. Naturaleza y Precisión de los Datos</h2>
          <p>
            {brandConfig.name} es una plataforma de análisis estadístico que utiliza datos públicos proporcionados por APIs 
            de terceros (por ejemplo, YouTube Data API, Twitch API). Las estimaciones de ingresos, proyecciones de crecimiento 
            y otras métricas son aproximaciones basadas en algoritmos propios y no deben considerarse como datos financieros 
            absolutos, auditorías oficiales o consejos de inversión. No garantizamos la precisión al 100% de la información mostrada.
          </p>

          <h2 className="text-2xl font-bold text-[var(--vl-text-primary)] mt-8 mb-4">3. Uso Aceptable</h2>
          <p>
            Usted se compromete a utilizar la plataforma únicamente para propósitos legales. Queda estrictamente prohibido:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>El scraping masivo o extracción automatizada de datos sin autorización previa.</li>
            <li>Intentar eludir las limitaciones de velocidad (rate limits) de la plataforma o de las APIs de terceros.</li>
            <li>Cualquier acción que imponga una carga irrazonable a nuestra infraestructura.</li>
          </ul>

          <h2 className="text-2xl font-bold text-[var(--vl-text-primary)] mt-8 mb-4">4. Propiedad Intelectual e Imagen</h2>
          <p>
            El código fuente, diseño, logotipos y funcionalidades algorítmicas de {brandConfig.name} son propiedad 
            exclusiva de nuestro equipo. Los datos estadísticos, nombres de canales, logotipos de creadores y miniaturas 
            pertenecen a sus respectivos dueños y a las plataformas de origen, siendo utilizados en {brandConfig.name} 
            bajo el principio de uso legítimo (fair use) para fines analíticos e informativos.
          </p>

          <h2 className="text-2xl font-bold text-[var(--vl-text-primary)] mt-8 mb-4">5. Modificaciones del Servicio</h2>
          <p>
            Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto de la plataforma en 
            cualquier momento sin previo aviso. Asimismo, estos Términos pueden ser actualizados periódicamente.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
