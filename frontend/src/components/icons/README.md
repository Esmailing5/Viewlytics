# Viewlytics Custom SVG Iconography

Un sistema de iconografía SVG diseñado a medida para Viewlytics, inspirado en la estética minimalista, geométrica y de trazo uniforme de plataformas como Linear, Raycast y Stripe.

## Parámetros de Diseño Coherentes

Todos los iconos se diseñan con base en las siguientes reglas geométricas estrictas:
* **Grosor de trazo uniforme**: `1.5` (ajustable de manera dinámica a través de la prop `strokeWidth`).
* **Terminaciones y uniones consistentes**: `strokeLinecap="round"` y `strokeLinejoin="round"`.
* **Caja de visualización**: `0 0 24 24`.
* **Identidad de marca**: Acentos sutiles basados en el color de acento de Viewlytics (`var(--vl-red)`).

## Catálogo de Iconos

| Componente | Uso Principal |
| :--- | :--- |
| `AnalyticsIcon` | Paneles analíticos, estadísticas y gráficos. |
| `CreatorsIcon` | Comunidad de creadores, colaboradores e influencers. |
| `RankingsIcon` | Tablas de clasificación, podios y récords de canales. |
| `GrowthIcon` | Crecimiento de suscriptores, métricas al alza y hitos. |
| `SubscribersIcon` | Base de seguidores del creador y difusión. |
| `ViewsIcon` | Audiencia de videos, impresiones y conteo de vistas. |
| `EarningsIcon` | Proyecciones monetarias, CPM y ganancias estimadas. |
| `AlertsIcon` | Mensajes de advertencia, estado del canal y notificaciones. |
| `TrendsIcon` | Tendencias calientes, creadores virales y crecimiento acelerado. |
| `PlatformsIcon` | Adaptabilidad del sistema en YouTube, Twitch y Kick. |

## Instrucciones de Uso

Importa el componente directamente e intégralo dentro de tu componente React. Puedes configurar el tamaño, grosor del trazo y clases de Tailwind:

```tsx
import { AnalyticsIcon } from '@/components/icons/CustomIcons';

export function DashboardHeader() {
  return (
    <div className="flex items-center gap-2">
      <AnalyticsIcon size={24} strokeWidth={2} className="text-[var(--vl-red)]" />
      <h1>Mi Panel de Analíticas</h1>
    </div>
  );
}
```
