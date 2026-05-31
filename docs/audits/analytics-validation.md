# Validación y Auditoría del Sistema de Analíticas (Analytics Validation)

Esta auditoría técnica ha sido realizada para certificar el estado de integración de las fuentes de datos y la erradicación de información simulada dentro del ecosistema de Viewlytics.

---

## 1. Hallazgos (Findings)

Tras las fases sucesivas de refactorización y migración, se ha consolidado el siguiente estado en el Dashboard de Canal:

### A. Componentes Migrados a Datos Reales (Channels + ChannelSnapshots)
1.  **Gráfico de Crecimiento de Suscriptores:**
    *   *Estado:* **100% Dinámico.** Consume directamente la serie temporal provista por `HistoricalAnalyticsService` basada en snapshots históricos de la tabla `CreatorSnapshot` (`ChannelSnapshots`).
    *   *Métricas:* El encabezado absoluto (`+150K` original) y el delta de crecimiento del badge verde (`12.4%` original) ahora se calculan de manera dinámica comparando la diferencia matemática entre el primer y último snapshot registrado.
2.  **Gráfico de Vistas Totales:**
    *   *Estado:* **100% Dinámico.** Utiliza la serie de tiempo real del historial de vistas recolectadas en base de datos.
    *   *Métricas:* Elimina por completo las constantes fijas y calcula los deltas del encabezado a partir de los datos acumulados verídicos en base de datos.
3.  **Cards Superiores de KPI:**
    *   *Estado:* **100% Dinámico.** Los porcentajes de cambio frente a los últimos 30 días para seguidores, vistas y videos subidos se extraen desde el backend a través de los métodos de crecimiento provistos por el servicio centralizado.
4.  **Panel de Impacto Reciente:**
    *   *Estado:* **100% Dinámico.** Muestra estadísticas reales de interacción de videos y calcula la tasa de cambio porcentual dinámicamente según la diferencia de snapshots en base de datos.

### B. Módulos que Aún Conservan Simulación o Hardcoding
1.  **Ingresos Estimados (Estimated Revenue):**
    *   *Estado:* Híbrido/Simulado. Utiliza como base real la cantidad total de visualizaciones de los últimos 30 días (`views30d`), pero el desglose diario de 14 días y las RPM/CPM se calculan bajo una estimación algorítmica local del cliente, aplicando variaciones pseudo-aleatorias matemáticas y factores estáticos estilo SocialBlade.
2.  **Clasificaciones Globales (Rankings):**
    *   *Estado:* Mockeado. La página `/rankings` sigue operando bajo una constante estática de mapeo `CATEGORY_DATA` en el frontend, sin vinculación a las tablas `Creator` y `DailyRanking` de la base de datos PostgreSQL.
3.  **Soporte de Plataformas de Streaming (Twitch & Kick):**
    *   *Estado:* Incompleto. El backend restringe las peticiones de analíticas detalladas exclusivamente a canales de la plataforma `youtube`, arrojando errores controlados si se consultan slugs de Twitch o Kick.

---

## 2. Riesgos Identificados (Risks)

1.  **Vacío de Datos en Canales Nuevos (Cold Start Problem):**
    *   *Riesgo:* Al ingresar por primera vez a un canal recién trackeado, la base de datos carece de snapshots (`CreatorSnapshot < 2`), lo que impide graficar tendencias reales o calcular porcentajes de variación reales.
    *   *Mitigación:* Se ha implementado un fallback en el frontend que interpola una línea base lógica usando el valor real de suscriptores y visualizaciones actuales del canal, garantizando que el gráfico no se renderice en blanco.
2.  **Escalabilidad de Consultas Históricas:**
    *   *Riesgo:* Con miles de creadores y snapshots diarios acumulándose, consultas frecuentes a `findMany` en la tabla `CreatorSnapshot` sin índices ni paginación óptima pueden ralentizar los tiempos de respuesta del API backend.
    *   *Mitigación:* La tabla cuenta con índices compuestos en `[creatorId, snapshotDate]` definidos en `schema.prisma`.

---

## 3. Recomendaciones (Recommendations)

1.  **Migrar Rankings a PostgreSQL (Daily Rankings Service):**
    *   Habilitar un endpoint en el backend `/api/rankings` que corra consultas agregadas de Prisma ordenando creadores por suscriptores o vistas de 30 días acumuladas en los snapshots.
2.  **Capa de Persistencia para Ingresos Estimados:**
    *   Sustituir el algoritmo matemático en frontend de `EstimatedIncomeChart` por almacenamiento y cálculo de snapshots de CPM/RPM dinámicos parametrizados por país y temática en el backend.
3.  **Integración de Adapters de Twitch y Kick:**
    *   Desarrollar adapters similares a `YouTubeChannelAdapter` para Twich y Kick para poblar snapshots y unificar las tres plataformas bajo el servicio de analítica histórica.
