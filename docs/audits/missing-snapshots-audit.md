# Auditoría de Canales Monitoreados sin Snapshots

Este documento detalla la investigación sobre los 4 canales que están en estado `trackingStatus = 'tracked'` pero que no poseen ningún snapshot registrado en la base de datos de Viewlytics.

---

## 1. Relación de Canales Afectados

A continuación se presenta el detalle de los 4 canales identificados en la auditoría de base de datos:

| Nombre del Creador | creatorId | slug | channelId | platform | trackingStatus |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Gallimbo** | `a4c326be-b7d9-44cc-b558-c9628afc98e1` | `gallimbo` | `UC_Gallimbo_Seed` | youtube | tracked |
| **El Show de Carlos Durán** | `10655e05-8598-4682-a5c5-b2ae758589c1` | `elshowdecarlosduran` | `UC_ShowCarlosDuran_Seed` | youtube | tracked |
| **El Mañanero con Boli** | `60265cd0-2167-45c8-a41a-5f9642147a6c` | `elmananeroconboli` | `UC_ElMananero_Seed` | youtube | tracked |
| **Duck Tape** | `1b11bbc2-3160-4fa4-a638-72be9620e87b` | `ducktape` | `UC_DuckTape_Seed` | youtube | tracked |

---

## 2. Hallazgos clave y Respuestas a Preguntas de la Auditoría

### 1. ¿El channelId es válido?
**No.** Los valores de `channelId` para los 4 canales (`UC_Gallimbo_Seed`, `UC_ShowCarlosDuran_Seed`, `UC_ElMananero_Seed`, `UC_DuckTape_Seed`) no corresponden a identificadores válidos de la API de YouTube. Son valores semilla ("seed") o marcadores de posición colocados durante el proceso de inicialización (seeding) inicial del proyecto.

### 2. ¿La API de YouTube responde correctamente?
**Sí.** Al realizar peticiones de prueba a la API oficial de YouTube (`v3/channels`), la API responde con código HTTP `200 OK` pero devuelve una lista de items vacía (`items: []`), indicando que los identificadores de canal no existen en la plataforma real de YouTube.

### 3. ¿Fueron omitidos por `run-daily-snapshots`?
**Sí.** El Snapshot Engine en [run-daily-snapshots.ts](file:///d:/Programacion/Viewlytics/backend/src/modules/snapshots/run-daily-snapshots.ts) contiene la siguiente validación al obtener los datos de la API de YouTube:

```typescript
if (!data.items || data.items.length === 0) {
  console.error(`[Failed] Channel not found on YouTube: ${creator.channelId}`);
  failed++;
  continue;
}
```

Debido a que la API devuelve una lista vacía para estos IDs de marcador de posición, el motor incrementa el contador de fallos, registra un mensaje de error en la consola y salta al siguiente canal sin guardar registros de snapshot.

### 4. ¿Existe alguna excepción capturada?
No se producen excepciones críticas de código o caídas del servidor. El flujo está correctamente controlado por el bloque condicional mencionado arriba. En el log se registra el error controlado:
`[Failed] Channel not found on YouTube: UC_..._Seed`

### 5. ¿Requieren corrección manual?
**Sí.** Estos registros son duplicados obsoletos de canales reales que sí se están monitoreando correctamente con sus identificadores reales en la misma base de datos. 

Existe una duplicidad directa en la base de datos:
*   `gallimbo` (UC_Gallimbo_Seed) es un duplicado inactivo de **Gallimbo Studios** (`gallimbostudios` con ID real `UC0V5B25wJkPehj87h3WfpxA`).
*   `elshowdecarlosduran` (UC_ShowCarlosDuran_Seed) es un duplicado inactivo de **Carlos Durán** (`carlosduran` con ID real `UCQ3_EaZ8LJDgVnv-g4J8Dpw`).
*   `elmananeroconboli` (UC_ElMananero_Seed) es un duplicado inactivo de **El Mañanero TV** (`elmananerotv` con ID real `UCYw74J3k7Y_aG97nZ5JqD9g`).
*   `ducktape` (UC_DuckTape_Seed) es un duplicado inactivo de **DuckTapeTV** (`ducktapetv` con ID real `UCm618g533g4h3j-0dGg2kLw`).

---

## 3. Recomendaciones de Corrección

Para limpiar la base de datos y evitar reportar fallos innecesarios en el Snapshot Engine, se sugieren las siguientes acciones correctivas:

1.  **Archivar los canales duplicados (Recomendado):**
    Cambiar el valor del campo `trackingStatus` de `tracked` a `archived` para las filas correspondientes en la tabla `creators`. Esto las excluirá automáticamente del Snapshot Engine sin eliminar sus referencias históricas.
    ```sql
    UPDATE creators 
    SET tracking_status = 'archived' 
    WHERE channel_id IN ('UC_Gallimbo_Seed', 'UC_ShowCarlosDuran_Seed', 'UC_ElMananero_Seed', 'UC_DuckTape_Seed');
    ```
2.  **Eliminar los registros obsoletos:**
    Dado que no tienen snapshots asociados y son entradas redundantes creadas durante el desarrollo inicial, pueden ser eliminadas de forma segura.
