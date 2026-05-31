# Capa de Validación de Snapshots (Snapshot Validation Layer)

Esta documentación describe la arquitectura y las reglas de negocio implementadas en la **Capa de Validación de Snapshots** de Viewlytics.

---

## 1. Propósito y Ubicación
El validador de snapshots está diseñado para filtrar y auditar las métricas recolectadas diariamente por el motor de captura antes de guardarlas en la base de datos PostgreSQL, evitando corrupción de datos, duplicidades y ruidos atípicos generados por fallas en la API de YouTube.

*   **Clase Creada:** `SnapshotValidator`
*   **Ruta del Archivo:** [snapshot.validator.ts](file:///d:/Programacion/Viewlytics/backend/src/server/snapshots/validation/snapshot.validator.ts)

---

## 2. Métricas y Reglas de Validación

### A. Integridad de Tipos (subscriberCount, viewCount, videoCount)
*   **Regla:** Detecta si los valores ingresados son `null`, `undefined` o `NaN`.
*   **Efecto:** Falla la validación (`isValid = false`, añadiendo errores).

### B. Valores Negativos
*   **Regla:** El recuento de seguidores (`subscribers`), vistas (`totalViews`) y videos (`totalVideos`) nunca debe ser menor que cero.
*   **Efecto:** Falla la validación (`isValid = false`).

### C. Detección de Duplicados
*   **Regla:** Verifica en la tabla `creator_snapshots` si ya existe un snapshot registrado para el mismo creador (`creatorId`) con fecha superior o igual al inicio del día actual (00:00:00 AM).
*   **Efecto:** Falla la validación (`isValid = false`).

### D. Detección de Anomalías Históricas (Comparativa vs. Snapshot Anterior)
Si existe un snapshot previo en la base de datos, se aplican límites de variabilidad lógica:
1.  **Caída Anómala de Reproducciones (Views Drop):**
    *   *Umbral:* Reducción mayor al 5%.
    *   *Explicación:* El recuento acumulado de reproducciones de un canal nunca debería bajar a menos que se hayan borrado o privatizado videos de forma masiva.
2.  **Caída Severa de Seguidores (Subscriber Drop):**
    *   *Umbral:* Reducción mayor al 20% en 24 horas.
    *   *Explicación:* Indica posible purga masiva de bots de YouTube o un bug en el reporte de la API.
3.  **Crecimiento Desmedido de Seguidores (Subscriber Spike):**
    *   *Umbral:* Incremento mayor al 100% en 24 horas (solo para canales con base > 1,000).
    *   *Explicación:* Alertas de bots o inyección anómala de tráfico.
4.  **Crecimiento Desmedido de Vistas (View Spike):**
    *   *Umbral:* Incremento mayor al 200% en 24 horas (solo para canales con vistas > 10,000).
    *   *Explicación:* Posible error en los logs de la API o campañas atípicas de tráfico automatizado.

---

## 3. Ejemplo de Uso en el Workflow de Inserción

```typescript
import { SnapshotValidator } from '../server/snapshots/validation/snapshot.validator';

const validation = await SnapshotValidator.validate(creator.id, {
  subscribers: statistics.subscriberCount,
  totalViews: statistics.viewCount,
  totalVideos: statistics.videoCount
});

if (!validation.isValid) {
  console.error("Snapshot inválido:", validation.errors);
  // Abortar inserción
} else {
  if (validation.anomalies.length > 0) {
    console.warn("Anomalías detectadas pero aceptadas:", validation.anomalies);
    // Registrar advertencias en sistema de logs/Slack
  }
  // Proceder con la inserción en base de datos
}
```
