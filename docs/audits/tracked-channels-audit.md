# Auditoría de Canales Monitoreados (Tracked Channels)

Este documento detalla la auditoría realizada sobre el sistema de canales monitoreados en Viewlytics, describiendo el modelo de datos de seguimiento, los criterios de inclusión en el Snapshot Engine y las estadísticas actuales en la base de datos.

## 1. Criterio de Monitoreo

El monitoreo de un creador en Viewlytics se define mediante el campo `trackingStatus` en la tabla de creadores (`creators`).

### Estructura de Datos
En el archivo de esquema de base de datos [schema.prisma](file:///d:/Programacion/Viewlytics/backend/prisma/schema.prisma), el estado de monitoreo se representa con un enum:

```prisma
enum TrackingStatus {
  searched
  tracked
  archived
}

model Creator {
  id             String          @id @default(uuid())
  platform       String          // e.g., "youtube"
  trackingStatus TrackingStatus  @default(searched) @map("tracking_status")
  // ... demás campos
  @@map("creators")
}
```

*   **tracked (Monitoreado):** El canal es de interés activo. Es procesado por el Snapshot Engine para recopilar estadísticas diarias.
*   **searched:** El canal fue buscado o pre-registrado pero no está siendo monitoreado activamente.
*   **archived:** El canal estuvo bajo monitoreo anteriormente pero ha sido archivado (suspendido del ciclo diario de capturas).

---

## 2. Relación de Canales y Snapshots en la Base de Datos

De acuerdo con la auditoría directa en la base de datos Postgres de Viewlytics, existen **19 creadores** registrados en total.

### Canales con Snapshots Registrados (15 canales con 1 snapshot c/u)
Los siguientes canales ya disponen de un snapshot en base de datos (con fecha de captura `2026-05-23`):
1.  **Alofoke Radio Show** (ID: `d38e2c4c-8f26-4e44-b882-896d9a96d34d`)
2.  **Esto No Es Radio** (ID: `0d4103cd-e876-4057-abca-ac5681d89195`)
3.  **Capricornio TV** (ID: `c36e7b1b-522c-473a-b58f-18a293f30b05`)
4.  **El Dotol Nastra** (ID: `7d178c40-4931-44ce-bd7b-554a6f4834e4`)
5.  **Luinny Corporation** (ID: `bb2a3e33-af0d-43d2-9cde-f03c35fb4cb4`)
6.  **Santiago Matías** (ID: `111d0dbc-7dc1-4be8-a0e2-916808c12358`)
7.  **Jessica Pereira** (ID: `f2357761-7db6-4488-abf3-3180ebc09d7c`)
8.  **Carlos Durán** (ID: `31f17ef8-9484-4438-9bf4-627593720c0d`)
9.  **Gallimbo Studios** (ID: `aa2dcddd-7684-4fba-9bd3-c069d01c72fd`)
10. **Brea Frank** (ID: `97c98348-e86a-459e-8b89-a195d1e4951d`)
11. **El Mañanero TV** (ID: `564566bc-e1d2-4d89-881b-a402f6eb02c7`)
12. **Sin Filtro Radio Show** (ID: `f4a15e55-651c-425c-944b-e45199dc9079`)
13. **José Peguero** (ID: `6f98d65a-95fe-4fea-885a-a0c73e0dc703`)
14. **DuckTapeTV** (ID: `3887fb5a-987d-4232-973c-e1c9ae935fb6`)
15. **Somos Pueblo Media** (ID: `db8c3805-ce44-44f6-b76c-10fb59ceed2c`)

### Canales sin Snapshots Registrados (4 canales con 0 snapshots)
Estos canales están registrados y monitoreados en la base de datos pero aún no cuentan con capturas históricas en la tabla `creator_snapshots`:
1.  **Gallimbo** (ID: `a4c326be-b7d9-44cc-b558-c9628afc98e1`)
2.  **El Show de Carlos Durán** (ID: `10655e05-8598-4682-a5c5-b2ae758589c1`)
3.  **El Mañanero con Boli** (ID: `60265cd0-2167-45c8-a41a-5f9642147a6c`)
4.  **Duck Tape** (ID: `1b11bbc2-3160-4fa4-a638-72be9620e87b`)

---

## 3. Distribución del Estado de Seguimiento (Estadísticas Totales)

*   **Canales Monitoreados (`trackingStatus: tracked`):** **19**
*   **Canales No Monitoreados (`trackingStatus: searched` / `archived`):** **0**
*   **Total de Registros en la tabla `creators`:** **19**

Actualmente, el 100% de los creadores insertados en la base de datos se encuentran en estado activo de monitoreo (`tracked`).

---

## 4. Validación del Snapshot Engine

Se ha auditado el flujo de ejecución del Snapshot Engine en el archivo [run-daily-snapshots.ts](file:///d:/Programacion/Viewlytics/backend/src/modules/snapshots/run-daily-snapshots.ts). 

Se confirma que el motor de snapshots **filtra estrictamente** para procesar únicamente canales monitoreados mediante la siguiente consulta a Prisma:

```typescript
const creators = await prisma.creator.findMany({
  where: {
    trackingStatus: TrackingStatus.tracked,
    platform: 'youtube',
  }
});
```

### Comportamiento del Motor
1.  Obtiene los registros de la base de datos que cumplen estrictamente con `trackingStatus: 'tracked'` y `platform: 'youtube'`.
2.  Verifica si ya existe una captura del día actual para cada creador filtrado con el fin de evitar duplicaciones.
3.  Consulta la API oficial de YouTube y genera el nuevo `CreatorSnapshot` únicamente para dichos creadores monitoreados.
