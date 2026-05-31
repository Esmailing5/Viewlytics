# Documentación del Endpoint de Monitoreo (Scheduler Status)

Esta sección detalla el endpoint de monitoreo expuesto para auditar y consultar en tiempo real el estado de ejecución de las capturas automáticas de snapshots de Viewlytics.

---

## 1. Detalles del Endpoint

*   **Ruta:** `GET /api/admin/scheduler-status`
*   **Seguridad / Nivel:** Administrativo (`/api/admin/*`)
*   **Descripción:** Entrega un objeto JSON que representa el estado en vivo del programador de cron.

---

## 2. Parámetros del Payload de Respuesta

El JSON devuelto contiene los siguientes campos:

*   `enabled` (boolean): Indica si el programador de tareas automáticas está activo.
*   `cronExpression` (string): La expresión cron utilizada para la planificación (por defecto `'0 3 * * *'` para ejecutarse diariamente a las 03:00 AM).
*   `timezone` (string): La zona horaria configurada en la que se ejecuta el cron (definida por la variable de entorno `CRON_TIMEZONE`).
*   `nextRun` (string | null): Timestamp en formato ISO de la fecha y hora programada para la próxima ejecución del motor.
*   `lastRun` (string | null): Timestamp en formato ISO del inicio de la última corrida de captura. `null` si aún no ha corrido desde el arranque del servidor.
*   `lastSuccess` (boolean | null): Estado de éxito del último job programado. `null` si no ha corrido, `true` si terminó correctamente y `false` si falló.
*   `snapshotsCreated` (number): Número acumulado de registros de snapshots agregados exitosamente a la base de datos por ejecuciones automatizadas del cron desde el inicio del servidor.

---

## 3. Ejemplo de Respuesta

```json
{
  "enabled": true,
  "cronExpression": "0 3 * * *",
  "timezone": "America/Santo_Domingo",
  "nextRun": "2026-06-01T07:00:00.000Z",
  "lastRun": "2026-05-31T07:00:00.252Z",
  "lastSuccess": true,
  "snapshotsCreated": 15
}
```
