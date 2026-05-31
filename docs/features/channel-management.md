# Documentación: Sistema de Gestión de Monitoreo de Canales

Este documento describe la arquitectura, endpoints y la interfaz de usuario del sistema de gestión de monitoreo de canales en Viewlytics v2.

---

## 1. Arquitectura de Endpoints (Backend)

Los nuevos endpoints administrativos de gestión de canales están expuestos bajo el prefijo `/api/admin` y registrados en [admin.route.ts](file:///d:/Programacion/Viewlytics/backend/src/server/routes/admin.route.ts).

### 1.1 Obtener todos los Canales
*   **Ruta:** `GET /api/admin/channels`
*   **Descripción:** Retorna todos los registros de la tabla `creators` ordenados alfabéticamente por su nombre de pantalla. Cada registro incluye el conteo del número total de snapshots asociados.
*   **Ejemplo de Respuesta:**
    ```json
    [
      {
        "id": "d38e2c4c-8f26-4e44-b882-896d9a96d34d",
        "platform": "youtube",
        "channelId": "UC...",
        "slug": "alofokeradioshow",
        "displayName": "Alofoke Radio Show",
        "avatarUrl": "https://...",
        "category": "Entertainment",
        "trackingStatus": "tracked",
        "_count": {
          "snapshots": 15
        }
      }
    ]
    ```

### 1.2 Actualizar Estado de Seguimiento
*   **Ruta:** `PATCH /api/admin/channels/:id/status`
*   **Descripción:** Actualiza el campo `trackingStatus` de un creador en base de datos.
*   **Cuerpo de la Petición:**
    ```json
    {
      "status": "tracked"
    }
    ```
    *(Valores válidos: `searched`, `tracked`, `archived`)*
*   **Ejemplo de Respuesta:**
    ```json
    {
      "success": true,
      "message": "Channel status updated to tracked",
      "data": { ... }
    }
    ```

---

## 2. Automatizaciones de Inicialización

### Archivado de Canales Semilla (Seeds)
Para evitar que el motor de capturas diarias intente procesar identificadores inválidos e introduzca logs fallidos, se ejecuta un proceso automático de migración cada vez que el servidor backend inicializa el plugin de rutas administrativas:

```typescript
const seedsToArchive = ['UC_Gallimbo_Seed', 'UC_ShowCarlosDuran_Seed', 'UC_ElMananero_Seed', 'UC_DuckTape_Seed'];
await prisma.creator.updateMany({
  where: {
    channelId: { in: seedsToArchive },
    trackingStatus: { not: 'archived' }
  },
  data: {
    trackingStatus: 'archived'
  }
});
```

Esto desplaza automáticamente los 4 registros de prueba inactivos hacia el estado `archived`.

---

## 3. Panel de Administración (Frontend)

La interfaz gráfica de administración de canales está disponible en la ruta: `/admin`.

### Características de la Interfaz
1.  **Diseño Responsivo e Identidad Visual v2:** Construida en concordancia con el tema oscuro de la plataforma, usando efectos de vidrio (glassmorphism), transiciones micro-animadas y tipografía Satoshi.
2.  **Métricas Rápidas:** Tarjetas superiores con estadísticas acumuladas en tiempo real de canales monitoreados, archivados y búsquedas.
3.  **Filtrado y Búsqueda Avanzada:**
    *   Búsqueda instantánea en tiempo real por nombre, slug o ID de canal.
    *   Filtros dinámicos por plataforma (`YouTube`, `Twitch`, `Kick`) y por estado de seguimiento (`tracked`, `archived`, `searched`).
4.  **Acciones en Tabla:**
    *   **Track (Botón Play):** Activa el monitoreo diario en el Snapshot Engine (estado `tracked`).
    *   **Archive (Botón Archivo):** Suspende temporalmente el monitoreo diario del canal (estado `archived`).
    *   **Restore (Botón Restaurar):** Devuelve el canal al estado `searched`.
    *   **Enlace Externo:** Permite navegar al Dashboard público del canal en tiempo real para visualizar sus estadísticas.
