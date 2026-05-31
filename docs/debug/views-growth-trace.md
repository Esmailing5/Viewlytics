# Traza de Depuración: Origen del Valor "+59M" en Vistas Totales

Este informe de depuración localiza el origen exacto del valor **`+59M`** mostrado en la sección **"Vistas Totales"** del Dashboard de Canal.

---

## 1. Ruta del Flujo de Datos (Data Flow Trace)

La ruta completa que sigue el dato es:

```
[UI] CreatorAnalyticsPage (JSX) 
  └─ [Hook] useMemo (growthChartsData)
       └─ [API] GET /api/channel/youtube/:slug
            └─ [Service] YouTubeChannelAdapter.getFullAnalytics()
                 └─ [YouTube API v3] GET /channels (statistics.viewCount)
                      └─ [Database/Fallback] Lógica de Fallback (Menos de 2 snapshots)
```

---

## 2. Análisis por Capa

### A. Capa de UI (Interfaz)
*   **Archivo:** [CreatorAnalyticsPage.tsx](file:///d:/Programacion/Viewlytics/frontend/src/components/analytics/CreatorAnalyticsPage.tsx)
*   **Línea:** 452 (dentro del componente del gráfico "Vistas Totales")
*   **Código:**
    ```tsx
    <p className="text-2xl font-black text-[var(--vl-text-primary)] mt-1">
      {growthChartsData.viewsChangeAbsolute}
    </p>
    ```

### B. Capa de Hook / Lógica Frontend
*   **Archivo:** [CreatorAnalyticsPage.tsx](file:///d:/Programacion/Viewlytics/frontend/src/components/analytics/CreatorAnalyticsPage.tsx)
*   **Línea:** 129 (dentro del hook `useMemo` que procesa `growthChartsData`)
*   **Causa de Cómputo (Falta de Snapshots):**
    Dado que la base de datos de Viewlytics solo contiene **1 snapshot** histórico para el creador (p. ej. *Alofoke Radio Show* con fecha 2026-05-23), la condición `data.snapshots && data.snapshots.length >= 2` resulta falsa.
    El sistema activa automáticamente la **lógica de fallback**, ejecutando la siguiente fórmula:
    ```typescript
    const firstVal = Math.round(viewsBase * 0.05 + viewFactors[0] * 180000000);
    const lastVal = Math.round(viewsBase * 0.05 + viewFactors[viewFactors.length - 1] * 180000000);
    const diff = lastVal - firstVal;
    viewsChangeAbsolute = diff >= 0 ? `+${new Intl.NumberFormat('es-ES', { notation: 'compact' }).format(diff)}` : ...
    ```

*   **Desglose Matemático del Fallback:**
    *   `viewsBase` (vistas totales devueltas por la API) = `2,971,517,069`
    *   `viewFactors[0]` (factor inicial hardcodeado) = `0.25`
    *   `viewFactors[6]` (factor final de 7 elementos) = `0.58`
    *   `firstVal` = $2,971,517,069 \times 0.05 + 0.25 \times 180,000,000 = 148,575,853 + 45,000,000 = 193,575,853$
    *   `lastVal` = $2,971,517,069 \times 0.05 + 0.58 \times 180,000,000 = 148,575,853 + 104,400,000 = 252,975,853$
    *   `diff` (diferencia absoluta) = $252,975,853 - 193,575,853 = 59,400,000$
    *   `Formatted diff` (es-ES compact) = `59 M` (mostrado en pantalla comprimido como **`+59M`**).

### C. Capa de API
*   **Ruta:** `/api/channel/youtube/[slug]`
*   **Controlador:** [channel.route.ts](file:///d:/Programacion/Viewlytics/backend/src/server/routes/channel.route.ts)
*   **Función:** Llama a `youtubeChannelAdapter.getFullAnalytics(slug)` y retorna las estadísticas en el objeto `metrics.total_views`.

### D. Capa de Service / Backend
*   **Servicio:** [youtube.channel.adapter.ts](file:///d:/Programacion/Viewlytics/backend/src/adapters/youtube/youtube.channel.adapter.ts)
*   **Línea:** 76
*   **Acción:** Obtiene las visualizaciones de por vida del canal desde la API oficial de YouTube (campo `statistics.viewCount`) y las parsea a entero.

### E. Base de Datos / Snapshots
*   **Origen:** El valor actual (`total_views`) proviene de la API pública de YouTube. El delta diario de `+59M` se computa en el cliente debido a la **ausencia de múltiples snapshots** en la base de datos (se requiere un mínimo de 2 capturas separadas por días para graficar crecimiento dinámico 100% verídico).

---

## 3. Diagnóstico Final

El valor de **`+59M`** proviene de un **cálculo de fallback híbrido** en el frontend. Utiliza la base de vistas reales del canal obtenida de la API de YouTube, pero simula la progresión temporal de los 30 días usando coeficientes estáticos y matemáticos debido a la falta de snapshots acumulados en la base de datos de PostgreSQL.
