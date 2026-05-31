# Gestión Manual de Estados de Canales

Este documento detalla el flujo de estados para el monitoreo de canales de Viewlytics, la API correspondiente y el comportamiento de la interfaz de administración.

---

## 1. Máquina de Estados de Monitoreo

Los canales cambian de estado de acuerdo a las interacciones del administrador. Los tres estados posibles provienen del enum `TrackingStatus` en Prisma:

```
  [searched]  -------- Activar monitoreo -------->  [tracked]
      ^                                                |
      |                                                | Archivar / Pausar
      |                                                v
      +-------------- Restaurar / Reset ------------- [archived]
```

### Reglas de Transición
1.  **Desde TRACKED:**
    *   **Acciones disponibles:** "Archivar" o "Pausar monitoreo".
    *   **Efecto:** Mueve el canal al estado `archived`.
    *   **Toast notification:** `"Canal archivado correctamente"`.
2.  **Desde ARCHIVED:**
    *   **Acción disponible:** "Restaurar".
    *   **Efecto:** Mueve el canal al estado `tracked`.
    *   **Toast notification:** `"Canal restaurado correctamente"`.
3.  **Desde SEARCHED:**
    *   **Acción disponible:** "Activar monitoreo".
    *   **Efecto:** Mueve el canal al estado `tracked`.
    *   **Toast notification:** `"Monitoreo activado correctamente"`.

---

## 2. API Endpoints

Las transiciones de estado se ejecutan mediante peticiones HTTP asíncronas desde el navegador:

*   **Endpoint:** `PATCH /api/admin/channels/:id/status`
*   **Payload del Request:**
    ```json
    {
      "status": "archived"
    }
    ```
*   **Respuesta Exitosa (200 OK):**
    ```json
    {
      "success": true,
      "message": "Channel status updated to archived",
      "data": {
        "id": "...",
        "trackingStatus": "archived"
      }
    }
    ```

---

## 3. Implementación en el Frontend

La lógica e interfaz de usuario se controlan en [page.tsx](file:///d:/Programacion/Viewlytics/frontend/src/app/%28dashboard%29/admin/page.tsx).

### 3.1 Actualización Reactiva y sin Recarga
Cuando el usuario presiona un botón de acción:
1.  Se dispara la petición `PATCH` al backend local/producción.
2.  Tras confirmarse el éxito, el estado de React `creators` se actualiza inmediatamente:
    ```typescript
    setCreators(prev => prev.map(c => c.id === id ? { ...c, trackingStatus: newStatus } : c));
    ```
3.  Tanto la **tabla de canales** como las **tarjetas de contadores superiores** (Total, Monitoreados, Archivados, Búsquedas) se recalculan automáticamente por medio de hooks `useMemo` de forma reactiva sin necesidad de refrescar o recargar la página.

### 3.2 Notificaciones Toast
Se renderiza un panel de notificación flotante (`absolute`/`fixed` en la esquina inferior derecha) estilizado en concordancia con el diseño oscuro v2. La notificación se desvanece de manera automática transcurridos 4 segundos.
