# Auditoría del Motor de Snapshots Diarios (Daily Snapshot Engine Audit)

Esta auditoría técnica evalúa el estado del programador de tareas y la ejecución del motor de capturas diarias (`Daily Snapshot Engine`) en Viewlytics.

---

## 1. Conclusiones del Programador (Scheduler & Cron)

*   **¿Existe scheduler automático interno en el código?**
    *   **No.** No hay temporizadores (`setInterval`), hilos de fondo (`Worker Threads`) ni librerías de planificación integradas en el proceso de Node.js del backend para programar ejecuciones automáticas.
*   **¿Existe cron job configurado en las dependencias?**
    *   **No.** El archivo [package.json](file:///d:/Programacion/Viewlytics/backend/package.json) del backend no registra librerías comunes de planificación como `node-cron`, `node-schedule` o `agenda`.
*   **¿Se ejecuta `run-daily-snapshots` automáticamente?**
    *   **No.** La función [runDailySnapshots](file:///d:/Programacion/Viewlytics/backend/src/modules/snapshots/run-daily-snapshots.ts) no es invocada de forma autónoma por ninguna rutina en el arranque del servidor.
*   **Frecuencia configurada:**
    *   **Ninguna.** No existe frecuencia de ejecución definida en el código del backend.
*   **Última ejecución registrada:**
    *   **23 de mayo de 2026, entre las 12:16:46 PM y las 12:16:52 PM (GMT-4)**. Esto se corrobora mediante los registros de fecha de creación (`snapshotDate`) en la tabla `CreatorSnapshot` del motor de base de datos.

---

## 2. Flujo Completo de la Operación

El motor opera bajo demanda mediante el siguiente flujo:

```
[Cliente / Administrador] Petición HTTP POST /api/admin/run-daily-snapshots
  ↓
[Ruta Fastify] admin.route.ts (POST /run-daily-snapshots)
  ↓
[Módulo] run-daily-snapshots.ts -> runDailySnapshots()
  ↓
[Base de Datos] Consulta creadores con estado "tracked" (Prisma)
  ↓
[YouTube API v3] Solicitud GET /channels?id=channelId (viewCount, subscriberCount)
  ↓
[Base de Datos] Prisma transaction:
    ├─ Inserta CreatorSnapshot (Métricas nuevas)
    └─ Actualiza Creator (Avatar, banner, verificado, descripción)
```

---

## 3. Causa del Bajo Volumen de Datos (15 Snapshots)

La existencia de únicamente **15 snapshots** en la base de datos se debe a:
1.  **Ejecución Manual Exclusiva:** El motor no es automatizado por el servidor. Requiere una petición HTTP POST manual y explícita al endpoint `/api/admin/run-daily-snapshots`.
2.  **Corrida Única:** El endpoint solo fue invocado **una vez** el día 23 de mayo de 2026 a las 12:16 PM. En esa única ejecución, el backend iteró sobre los 15 canales que tenían estado de seguimiento `tracked` en ese instante, guardando 1 snapshot por canal (totalizando 15 registros).
3.  **Falta de Tarea Programada Externa (OS Cron):** No se ha configurado ningún daemon externo en el sistema operativo del servidor (como `crontab` de Linux o `Task Scheduler` de Windows) que lance periódicamente un comando curl al endpoint para automatizar el registro diario.

---

## 4. Recomendaciones de Implementación

1.  **Configurar Tarea Programada de SO (External Cron):**
    *   Configurar un cron job a nivel de servidor que realice una llamada programada cada 24 horas:
        ```bash
        0 4 * * * curl -X POST http://localhost:4000/api/admin/run-daily-snapshots
        ```
2.  **Integrar Automatización Interna (Librería node-cron):**
    *   Instalar `node-cron` en el backend:
        ```bash
        npm install node-cron
        ```
    *   Inicializar una tarea programada en el arranque de Fastify ([app.ts](file:///d:/Programacion/Viewlytics/backend/src/server/app.ts)):
        ```typescript
        import cron from 'node-cron';
        import { runDailySnapshots } from '../modules/snapshots/run-daily-snapshots';

        // Ejecutar diariamente a las 04:00 AM
        cron.schedule('0 4 * * *', async () => {
          console.log('[Cron Job] Ejecutando captura diaria de snapshots...');
          try {
            await runDailySnapshots();
          } catch (err) {
            console.error('[Cron Job] Error:', err);
          }
        });
        ```
