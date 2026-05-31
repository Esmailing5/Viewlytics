# Auditoría de la Arquitectura de la API (API Architecture Audit)

Esta auditoría describe la estructura de red, el motor del servidor backend, las rutas públicas expuestas y el flujo de comunicación de datos de la plataforma Viewlytics.

---

## 1. Servidor Backend y Framework
*   **Motor del Servidor:** Node.js.
*   **Framework API:** **Fastify** (v5.8.5).
*   **Justificación de Arquitectura:** Fastify ha sido seleccionado por su alta eficiencia en el procesamiento de peticiones I/O y su bajo overhead en comparación con Express. El servidor está configurado en el archivo [app.ts](file:///d:/Programacion/Viewlytics/backend/src/server/app.ts) y utiliza plugins CORS para habilitar la interoperabilidad con el frontend de Next.js.

---

## 2. URL Base Correcta de la API
*   **Entorno de Desarrollo Local:** `http://localhost:4000`
*   **Consumo en Frontend:** Definido por la variable de entorno `NEXT_PUBLIC_API_URL` en [.env.local](file:///d:/Programacion/Viewlytics/frontend/.env.local), con fallback automático a `http://localhost:4000` en el código de llamadas fetch del cliente.

---

## 3. Listado de Rutas Públicas (Endpoints)

| Método HTTP | Endpoint | Controlador / Archivo | Propósito / Parámetros |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | [app.ts](file:///d:/Programacion/Viewlytics/backend/src/server/app.ts) | Health Check del servicio. |
| **GET** | `/api/search` | [search.route.ts](file:///d:/Programacion/Viewlytics/backend/src/server/routes/search.route.ts) | Búsqueda de canales públicos en YouTube. Parámetro query: `?q=query` |
| **GET** | `/api/channel/:platform/:slug` | [channel.route.ts](file:///d:/Programacion/Viewlytics/backend/src/server/routes/channel.route.ts) | Obtiene el perfil detallado, estadísticas de 30 días, videos recientes e histórico de snapshots. |
| **POST** | `/api/admin/seed-rd-creators` | [admin.route.ts](file:///d:/Programacion/Viewlytics/backend/src/server/routes/admin.route.ts) | Inicializa/verifica la lista de creadores en base de datos. |
| **POST** | `/api/admin/run-daily-snapshots` | [admin.route.ts](file:///d:/Programacion/Viewlytics/backend/src/server/routes/admin.route.ts) | Ejecuta el motor diario de captura de estadísticas (snapshots). |

---

## 4. Análisis del Endpoint de Supabase

*   **URL Evaluada:** `https://ydxsvxbrbvyrecvixmus.supabase.co`
*   **Naturaleza:** Es la URL canónica del proyecto de **Supabase (PostgreSQL + PostgREST)**.
*   **Comportamiento en Navegador:**
    *   Si se ingresa directamente en un navegador web, **no responderá con páginas visuales de Viewlytics** ni con endpoints de la aplicación. En su lugar, PostgREST devolverá un error JSON indicando que el token JWT es inválido o no fue enviado (`"JSON Web Token is invalid or missing"`).
    *   **Propósito Exclusivo:** Sirve como la URL del proyecto para inicializar el cliente SDK de Supabase (`@supabase/supabase-js`) o realizar consultas REST directas a las tablas enviando las cabeceras requeridas de autenticación (`apikey` y `Authorization: Bearer <token>`).
