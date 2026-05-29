import type { Metadata } from 'next';
import { brandConfig } from '@/config/branding';
import { PublicLayout } from '@/components/layout/PublicLayout';

export const metadata: Metadata = {
  title: `Política de Privacidad | ${brandConfig.name}`,
  description: 'Política de privacidad y manejo de datos de Viewlytics.',
};

export default function PrivacyPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-20 max-w-4xl min-h-[70vh]">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--vl-text-primary)] mb-8">Política de Privacidad</h1>
        <div className="space-y-6 text-[var(--vl-text-secondary)] leading-relaxed">
          <p className="text-sm">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
          
          <h2 className="text-2xl font-bold text-[var(--vl-text-primary)] mt-8 mb-4">1. Recopilación de Información</h2>
          <p>
            En {brandConfig.name}, recopilamos información pública de APIs oficiales de plataformas como YouTube, Twitch, y Kick. 
            Esta información incluye estadísticas de canales, recuentos de vistas, suscriptores, y datos públicos de videos. 
            No recopilamos información privada de los creadores sin su consentimiento explícito a través de procesos de autenticación (como OAuth).
          </p>

          <h2 className="text-2xl font-bold text-[var(--vl-text-primary)] mt-8 mb-4">2. Uso de la Información</h2>
          <p>
            Utilizamos los datos recopilados para generar analíticas, proyecciones de ingresos y gráficos de crecimiento 
            que se muestran públicamente en nuestra plataforma. El objetivo es proporcionar herramientas estadísticas y 
            educativas para la comunidad de creadores, anunciantes y usuarios en general.
          </p>

          <h2 className="text-2xl font-bold text-[var(--vl-text-primary)] mt-8 mb-4">3. Cookies y Tecnologías de Seguimiento</h2>
          <p>
            Utilizamos cookies para mejorar la experiencia del usuario, mantener sesiones activas y analizar el tráfico 
            de nuestro sitio web mediante servicios de terceros. Al usar {brandConfig.name}, aceptas el uso de cookies de acuerdo con esta política.
          </p>

          <h2 className="text-2xl font-bold text-[var(--vl-text-primary)] mt-8 mb-4">4. Compartir Datos con Terceros</h2>
          <p>
            No vendemos ni alquilamos información personal a terceros. Los datos agregados y estadísticos mostrados en 
            los perfiles de creadores son de dominio público y se utilizan exclusivamente para propósitos analíticos y de ranking dentro de la plataforma.
          </p>

          <h2 className="text-2xl font-bold text-[var(--vl-text-primary)] mt-8 mb-4">5. Seguridad de los Datos</h2>
          <p>
            Implementamos medidas de seguridad estándar de la industria para proteger contra el acceso no autorizado, 
            alteración, divulgación o destrucción de datos. Sin embargo, ningún método de transmisión por Internet 
            es 100% seguro.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
