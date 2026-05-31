# Auditoría de Base de Datos: ChannelSnapshots

Esta auditoría técnica presenta los resultados del análisis detallado de la tabla `CreatorSnapshot` (`ChannelSnapshots`) en la base de datos PostgreSQL de Viewlytics.

---

## 1. Métricas Globales de Captura

*   **Cantidad Total de Snapshots Almacenados:** 15
*   **Fecha Más Antigua:** 23 de mayo de 2026, 12:16:46 PM (GMT-4)
*   **Fecha Más Reciente:** 23 de mayo de 2026, 12:16:52 PM (GMT-4)

---

## 2. Historial de Captura por Canal (Snapshots Count)

| Canal (Slug) | Cantidad de Snapshots |
| :--- | :---: |
| **Alofoke Radio Show** (`alofokeradioshow`) | 1 |
| **Esto No Es Radio** (`estonoesradio`) | 1 |
| **Capricornio TV** (`capricorniotv`) | 1 |
| **El Dotol Nastra** (`eldotolnastra`) | 1 |
| **Luinny Corporation** (`luinnycorporation`) | 1 |
| **Santiago Matías** (`santiagomatias`) | 1 |
| **Jessica Pereira** (`jessicapereira`) | 1 |
| **Carlos Durán** (`carlosduran`) | 1 |
| **Gallimbo Studios** (`gallimbostudios`) | 1 |
| **Sin Filtro Radio Show** (`sinfiltroradioshow`) | 1 |
| **DuckTapeTV** (`ducktapetv`) | 1 |
| **Brea Frank** (`breafrank`) | 1 |
| **El Mañanero TV** (`elmananerotv`) | 1 |
| **José Peguero** (`josepeguero`) | 1 |
| **Somos Pueblo Media** (`somospueblomedia`) | 1 |
| **Gallimbo** (`gallimbo`) | 0 |
| **El Show de Carlos Durán** (`elshowdecarlosduran`) | 0 |
| **El Mañanero con Boli** (`elmananeroconboli`) | 0 |
| **Duck Tape** (`ducktape`) | 0 |

---

## 3. Clasificación de Canales por Densidad de Snapshots

### Canales con Menos de 2 Snapshots (< 2)
*   **Estado:** **Todos los canales (19 de 19).**
*   **Detalle:** 4 canales registran 0 snapshots y 15 canales cuentan únicamente con 1 snapshot de fecha 2026-05-23.
*   **Impacto en UI:** Activa la lógica de fallback en el gráfico de crecimiento de suscriptores y vistas del dashboard, estimando el comportamiento histórico dinámicamente en base a las estadísticas en vivo del canal y coeficientes deterministas en lugar de representar tendencias históricas reales.

### Canales con 30+ Snapshots
*   **Estado:** **Ninguno (0 de 19).**
*   **Impacto en UI:** Ningún canal cuenta actualmente con una serie histórica extendida completa de 30 días en base de datos.

---

## 4. Diagnóstico y Recomendaciones

1.  **Arranque en Frío de Tareas Programadas:**
    *   *Hallazgo:* Todos los snapshots fueron creados simultáneamente el 23 de mayo de 2026 en un lapso de 6 segundos. Esto denota una sola corrida de inicialización del motor de snapshots.
    *   *Acción:* Asegurar que el script cron/worker de actualización diaria de snapshots (`runDailySnapshots`) esté configurado y corriendo periódicamente en el servidor de producción para acumular capturas diarias.
2.  **Llenado de Serie Histórica:**
    *   *Acción:* Para canales recién registrados sin historial, se recomienda realizar una estimación inicial o poblar con snapshots ficticios con fechas decrecientes de los últimos 30 días si se requiere forzar una visualización real inmediata sin esperar 30 días de capturas acumulativas.
