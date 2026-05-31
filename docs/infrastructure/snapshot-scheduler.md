# Documentación del Scheduler Automático (Snapshot Scheduler)

Esta sección describe la integración y el funcionamiento del programador de tareas automáticas (`Snapshot Scheduler`) que realiza capturas de estadísticas diarias de los canales trackeados.

---

## 1. Arquitectura del Planificador

El programador se inicializa durante el arranque del servidor Fastify. Utiliza la librería `node-cron` para registrar rutinas y automatizar peticiones internas de forma nativa en el proceso de Node.js, descartando la dependencia exclusiva de cron jobs externos del sistema operativo.

*   **Ruta del Programador:** [snapshot-scheduler.ts](file:///d:/Programacion/Viewlytics/backend/src/server/jobs/snapshot-scheduler.ts)
*   **Inicialización:** Llamado dentro de la rutina `buildApp()` en [app.ts](file:///d:/Programacion/Viewlytics/backend/src/server/app.ts).

---

## 2. Configuración y Horarios

*   **Frecuencia:** Una vez al día (`0 3 * * *` - todos los días a las 03:00 AM).
*   **Zona Horaria Parametrizable:** Lee el huso horario deseado desde la variable de entorno `CRON_TIMEZONE`. Si no está configurada, utiliza la zona horaria por defecto `'America/Santo_Domingo'` (Estándar de la República Dominicana).

---

## 3. Formato y Trazabilidad de Logs

El scheduler escribe logs detallados en la consola del servidor Fastify usando los siguientes prefijos unificados:

1.  **Inicialización:**
    `[Scheduler] Initializing Daily Snapshot Job. Scheduled at 0 3 * * * (Timezone: America/Santo_Domingo)`
2.  **Ejecución del Job:**
    `[SnapshotJob] Running automatic daily snapshot engine...`
3.  **Resultado Exitoso:**
    `[Success] Daily Snapshot Job completed successfully in X.XXs. Details: Processed: X, Created: Y, Skipped: Z, Failed: W`
4.  **En caso de error:**
    `[Error] Daily Snapshot Job encountered an error: <Detalle del Error>`
