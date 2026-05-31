# Auditoría y Remoción de Fallbacks de Crecimiento Simulado

Este documento detalla la auditoría y la posterior eliminación de las curvas de tendencia y métricas de crecimiento simuladas en la plataforma Viewlytics.

## Contexto y Razón del Cambio

Anteriormente, para mejorar la apariencia estética inicial del Dashboard, se utilizaban valores mock y fórmulas heurísticas fijas cuando un canal de creador no contaba con suficientes registros históricos (`snapshots.length < 7`). Esto introducía un crecimiento ficticio (por ejemplo, incrementos fijos del `+1.7%`, `+8.4%` o curvas de crecimiento artificiales en los gráficos de área).

Para garantizar la honestidad y veracidad de los datos analíticos presentados a los usuarios, se ha implementado una regla estricta: **si un canal posee menos de 7 snapshots en la base de datos, no se debe calcular ni renderizar ningún crecimiento simulado.**

## Regla de Negocio Aplicada

```
Si snapshots.length < 7:
  - No calcular deltas ni porcentajes de cambio en el backend (retornar undefined).
  - No graficar series de tiempo ficticias en los charts de Recharts.
  - Mostrar "Recolectando historial" en las áreas de gráficos correspondientes.
  - Mostrar "—" en los deltas de las tarjetas de KPI superiores y en el resumen de Impacto Reciente.
  - Mostrar "Datos insuficientes" en los badges informativos de cambio temporal.
```

## Componentes y Archivos Modificados

### 1. Backend

*   **Archivo:** [youtube.channel.adapter.ts](file:///d:/Programacion/Viewlytics/backend/src/adapters/youtube/youtube.channel.adapter.ts)
    *   **Cambio:** Se actualizó la lógica del método `getFullAnalytics`. Ahora evalúa si `snapshots.length >= 7`. Si es menor, asigna `undefined` a las siguientes propiedades de crecimiento:
        *   `subscribers_change_pct`
        *   `views_change_pct`
        *   `videos_change_pct`
        *   `likes_change_pct`
        *   `comments_change_pct`

### 2. Frontend

*   **Archivo:** [CreatorAnalyticsPage.tsx](file:///d:/Programacion/Viewlytics/frontend/src/components/analytics/CreatorAnalyticsPage.tsx)
    *   **Cambio 1 (`growthChartsData`):** Si los datos históricos tienen menos de 7 snapshots, deshabilita la generación de datos simulados y establece valores de cambio por defecto (`"Datos insuficientes"` y `"—"`).
    *   **Cambio 2 (Gráficos JSX):** El componente de gráficos (`AreaChart`) de Recharts se reemplaza condicionalmente por un contenedor con borde punteado de la misma altura (`220px`) mostrando el mensaje `"Recolectando historial"`. Esto preserva las dimensiones y el diseño de la cuadrícula (grid) sin generar elementos ficticios.
    *   **Cambio 3 (`dynamicMetrics`):** Las tarjetas superiores de KPI (Suscriptores, Vistas Totales, Videos Totales) muestran `"—"` como valor de variación cuando las propiedades de delta vienen marcadas como `undefined` por el backend.

*   **Archivo:** [VideoAnalyticsSummary.tsx](file:///d:/Programacion/Viewlytics/frontend/src/components/analytics/VideoAnalyticsSummary.tsx)
    *   **Cambio:** Se actualizaron los badges de variación del widget **Impacto Reciente**. Si los porcentajes correspondientes en `growth` son `undefined`, se renderiza un indicador neutral `"—"` en lugar del delta simulado de `+5.2%`, `+12.4%`, etc.

## Verificación Visual y de Compilación

1.  **Backend Build:** Compilación exitosa usando `npm run build` en el directorio backend.
2.  **Frontend Build:** Compilación exitosa usando `npm run build` en el directorio frontend.
3.  **Resultado en UI:** Los canales con historial incompleto (menos de 7 snapshots) ya no muestran variaciones positivas artificiales y despliegan correctamente los estados de recolección de historial.
