# Auditoría de Fuentes de Datos del Dashboard de Canal de Viewlytics

Esta auditoría detalla el origen de los datos (reales vs. simulados/mock) en las diferentes secciones del Dashboard de Canal, identificando los archivos y componentes que requieren refactorización para lograr una integración 100% dinámica con datos reales provistos por el backend y la API de YouTube.

---

## 1. Resumen por Componente del Dashboard

### 1. Cards Superiores (Métricas KPI)
*   **Estado:** Híbrido (Datos Reales + Datos de Crecimiento Mockeados)
*   **Datos Reales:**
    *   `Suscriptores` (`data.profile?.subscribers` - obtenido de la API de YouTube).
    *   `Vistas Totales` (`data.metrics?.total_views` - obtenido de la API de YouTube).
    *   `Videos Totales` (`data.metrics?.total_videos` - obtenido de la API de YouTube).
    *   `Plataforma` (`data.platform` - obtenido del parámetro de ruta/API).
*   **Datos Mock/Simulados:**
    *   Los porcentajes de cambio versus los últimos 30 días (`change: '↑ 1.7%'`, `change: '↑ 8.4%'`, `change: '↑ 2'`) están hardcodeados directamente como cadenas de texto estáticas dentro de la declaración del arreglo `dynamicMetrics` en el componente.
*   **Archivo Relacionado:**
    *   [CreatorAnalyticsPage.tsx](file:///d:/Programacion/Viewlytics/frontend/src/components/analytics/CreatorAnalyticsPage.tsx) (Líneas 190-224)

### 2. Subscriber Growth Chart (Gráfico de Crecimiento de Suscriptores)
*   **Estado:** Simulados/Mock en Frontend
*   **Datos Reales:**
    *   El valor base (`subsBase`) se obtiene de `data.profile?.subscribers`.
*   **Datos Mock/Simulados:**
    *   La serie de tiempo se simula en el cliente aplicando un conjunto de factores estáticos predefinidos: `subFactors = [0.963, 0.971, 0.978, 0.976, 0.988, 0.986, 1.0]`.
    *   Las fechas del eje X (`dates = ['15 abr', '22 abr', '29 abr', '6 may', '13 may', '20 may', '28 may']`) están hardcodeadas en una constante local.
    *   El total del encabezado (`+150K`) y el porcentaje de cambio (`↑ 12.4% vs 30 días`) están escritos como texto plano estático en el JSX.
*   **Archivo Relacionado:**
    *   [CreatorAnalyticsPage.tsx](file:///d:/Programacion/Viewlytics/frontend/src/components/analytics/CreatorAnalyticsPage.tsx) (Líneas 129-145 para el cálculo del gráfico, y Líneas 320-330 para las etiquetas hardcodeadas en JSX)

### 3. Total Views Chart (Gráfico de Vistas Totales)
*   **Estado:** Simulados/Mock en Frontend
*   **Datos Reales:**
    *   El valor base (`viewsBase`) se obtiene de `data.metrics?.total_views`.
*   **Datos Mock/Simulados:**
    *   La serie de tiempo se calcula en el cliente aplicando factores de multiplicación (`viewFactors = [0.25, 0.35, 0.33, 0.42, 0.4, 0.65, 0.58]`) sobre una fórmula matemática fija: `viewsBase * 0.05 + viewFactors[i] * 180000000`.
    *   Las fechas en el eje X son del mismo arreglo de cadenas hardcodeadas (`dates`).
    *   El total del encabezado (`+412M`) y el porcentaje de cambio (`↑ 9.3% vs 30 días`) están escritos como texto plano estático en el JSX.
*   **Archivo Relacionado:**
    *   [CreatorAnalyticsPage.tsx](file:///d:/Programacion/Viewlytics/frontend/src/components/analytics/CreatorAnalyticsPage.tsx) (Líneas 147-152 para el cálculo, y Líneas 385-395 para las etiquetas en el JSX)

### 4. Impacto Reciente (Recent Impact)
*   **Estado:** Híbrido (Métricas de Valor Real + Métricas Simuladas en Backend + Comparativas Estáticas en Frontend)
*   **Datos Reales:**
    *   `Promedio Vistas` (calculado dinámicamente usando `views_30d / videos_30d`).
    *   `Likes Acumulados` (obtenido de `data.growth.likes_30d` calculados en el backend a partir de los videos cargados de la API de YouTube).
    *   `Comentarios Nuevos` (obtenido de `data.growth.comments_30d` calculados en el backend a partir de la API de YouTube).
*   **Datos Mock/Simulados:**
    *   **Backend:** La métrica de `Nuevos Suscriptores` (`growth.subscribers_30d`) es estimada/simulada con la regla de negocio arbitraria `Math.floor(views30d * 0.002)` (aproximadamente 2 suscriptores por cada 1,000 reproducciones).
    *   **Frontend:** Los porcentajes de incremento en verde (`change: '↑ 5.2%'`, `change: '↑ 12.4%'`, `change: '↑ 4.1%'`, `change: '↑ 8.3%'`) están hardcodeados como cadenas literales en el array `metrics` dentro del componente.
*   **Archivos Relacionados:**
    *   [VideoAnalyticsSummary.tsx](file:///d:/Programacion/Viewlytics/frontend/src/components/analytics/VideoAnalyticsSummary.tsx) (Líneas 29-68)
    *   [youtube.channel.adapter.ts](file:///d:/Programacion/Viewlytics/backend/src/adapters/youtube/youtube.channel.adapter.ts) (Línea 197 para la estimación de suscriptores)

### 5. Ingresos Estimados (Estimated Revenue)
*   **Estado:** Calculado/Simulado en Frontend
*   **Datos Reales:**
    *   La base de reproducciones totales de los últimos 30 días (`views30d`) y la lista de videos recientes (`recentVideos`) provienen de la API real.
*   **Datos Mock/Simulados:**
    *   Los ingresos se calculan simulando un rango de RPM fijo (`RPM_LOW = 0.25`, `RPM_HIGH = 4.00`, `RPM_AVG = 1.50`) estilo estimación de SocialBlade.
    *   El gráfico de barras/áreas diario de 14 días se simula distribuyendo linealmente el 50% de las vistas mensuales e inyectando un incremento del 40% de las reproducciones en los días con publicaciones de videos.
    *   Se inyecta ruido pseudo-aleatorio matemático (`pseudoRandom`) basado en fórmulas deterministas en el cliente para simular fluctuaciones reales diarias de reproducciones e ingresos.
*   **Archivo Relacionado:**
    *   [EstimatedIncomeChart.tsx](file:///d:/Programacion/Viewlytics/frontend/src/components/analytics/EstimatedIncomeChart.tsx) (Líneas 21-78)

---

## 2. Archivos que Deben Refactorizarse

Para lograr que el Dashboard funcione con datos 100% dinámicos y verídicos, se requiere refactorizar los siguientes archivos:

### Backend
1.  **[youtube.channel.adapter.ts](file:///d:/Programacion/Viewlytics/backend/src/adapters/youtube/youtube.channel.adapter.ts)**
    *   **Acción:** Reemplazar el estimador simulado de `subscribers_30d` (`views30d * 0.002`) con datos históricos reales.
    *   **Nota:** Dado que la API pública de YouTube v3 no provee históricos diarios detallados de suscriptores a terceros sin credenciales OAuth del propietario del canal, se debe implementar una persistencia en base de datos (con Prisma) que registre snapshots periódicos del canal para calcular el crecimiento real diario de forma acumulativa e histórica en la base de datos propia de Viewlytics.

### Frontend
2.  **[CreatorAnalyticsPage.tsx](file:///d:/Programacion/Viewlytics/frontend/src/components/analytics/CreatorAnalyticsPage.tsx)**
    *   **Acción:**
        *   Eliminar las lógicas de simulación matemática de crecimiento en `growthChartsData` (líneas 129-153).
        *   Modificar la llamada a la API para solicitar los datos de la serie histórica y poblar los gráficos de crecimiento con datos provenientes del backend.
        *   Reemplazar las etiquetas estáticas hardcodeadas (`+150K`, `↑ 12.4% vs 30 días`, `+412M`, `↑ 9.3% vs 30 días`) y los porcentajes fijos de las cards superiores (`change`) con cálculos derivados de la serie temporal o campos provistos directamente en el payload del endpoint del backend.
3.  **[VideoAnalyticsSummary.tsx](file:///d:/Programacion/Viewlytics/frontend/src/components/analytics/VideoAnalyticsSummary.tsx)**
    *   **Acción:** Eliminar los textos estáticos del campo `change` en el array `metrics` (líneas 38, 46, 56, 66) y computarlos comparando los valores acumulados actuales frente a los valores históricos de los 30 días anteriores entregados por la base de datos del backend.
4.  **[EstimatedIncomeChart.tsx](file:///d:/Programacion/Viewlytics/frontend/src/components/analytics/EstimatedIncomeChart.tsx)**
    *   **Acción:**
        *   Eliminar la simulación de generación diaria en el frontend con ruido pseudo-aleatorio (líneas 45-78).
        *   Vincular el componente a un endpoint del backend que entregue la serie de tiempo real de reproducciones por día para estimar el ingreso diario con mayor precisión, o integrar datos de ingresos/CPM reales si se cuenta con integración OAuth.
