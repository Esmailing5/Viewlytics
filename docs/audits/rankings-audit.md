# Auditoría del Sistema de Rankings (Rankings Audit)

Esta auditoría técnica evalúa la fidelidad del sistema de rankings y clasificaciones del portal Viewlytics.

---

## 1. Conclusiones sobre la Autenticidad de los Datos

*   **¿Usa Mock Data / Rankings Fake?**
    *   **Sí, en su totalidad.** Toda la información que se muestra en la página de rankings está precargada de forma estática en el cliente. Los creadores enlistados, sus posiciones y sus métricas asociadas de seguidores, vistas de 30 días y volumen de videos son inventados o fijos.
*   **¿Usa Arrays Hardcodeados / Datos Simulados?**
    *   **Sí.** El mapa de datos `CATEGORY_DATA` está hardcodeado directamente en el archivo del frontend estructurando los rankings de las 5 categorías: `top-creators`, `top-growth`, `top-podcasts`, `top-gaming` y `top-streamers`.
    *   No hay ninguna interacción ni comunicación con bases de datos ni servicios de backend para computar o consumir estas clasificaciones.

---

## 2. Archivos y Componentes Afectados

1.  **Frontend: [page.tsx](file:///d:/Programacion/Viewlytics/frontend/src/app/%28dashboard%29/rankings/page.tsx)**
    *   **Rol:** Renders del podium (Top 3) y la tabla de posiciones de clasificación.
    *   **Dependencia Estática:** Contiene las definiciones estáticas de `CreatorRanking[]` y el objeto `CATEGORY_DATA` (líneas 23-69) con el listado completo de datos mockeados para los creadores.
2.  **Frontend: [rankingsConfig](file:///d:/Programacion/Viewlytics/frontend/src/config/rankings.ts)**
    *   **Rol:** Define las propiedades de configuración global del ranking (límites de ítems por página, categorías habilitadas, SEO meta).
3.  **Backend: Rutas y Controladores**
    *   **Estado:** **Inexistente.** No existe un módulo de rutas `/api/rankings` en el servidor backend para exponer las consultas de rankings calculados a partir de creadores reales.

---

## 3. Modelo de Datos Existente (Prisma Schema)

El backend cuenta con las tablas necesarias listas para soportar este sistema de forma verídica:
*   `Creator`: Posee los atributos de plataforma (`platform`), región (`region`), categoría temática (`category`) y el flag `isFeatured`.
*   `DailyRanking`: Relaciona a un creador con una posición (`rankingPosition`), categoría (`rankingType`) y fecha (`rankingDate`).

---

## 4. Estrategia Recomendada de Migración a Datos Reales

### Fase A: Creación del Endpoint en el Backend
1.  **Crear `rankings.route.ts`:**
    *   Registrar la ruta `/api/rankings/:category` en el router de Fastify.
2.  **Crear el Rankings Engine / Service:**
    *   Desarrollar la lógica que realice las consultas SQL dinámicas a la base de datos usando Prisma:
        *   **Top Creators (Generales):** Consultar creadores en la tabla `creators` ordenados de forma descendente por el conteo más reciente de suscriptores/seguidores (desde el último `CreatorSnapshot`).
        *   **Top Growth (Crecimiento):** Calcular la diferencia absoluta y porcentual de suscriptores entre el snapshot actual y el de hace 30 días (`snapshotDate`), ordenando de mayor a menor.
        *   **Categorías Temáticas (Gaming, Podcasts, Streamers):** Filtrar creadores por `creator.category` y aplicar ordenamientos por suscriptores o visualizaciones de 30 días (`growth.views_30d`).
3.  **Caché en Redis:**
    *   Debido a que computar rankings en tiempo real con millones de registros de snapshots puede ser costoso, se recomienda guardar los resultados de rankings en Redis (usando `@upstash/redis` ya configurado en el backend) por un lapso de 1 a 6 horas.

### Fase B: Integración en el Frontend
1.  **Refactorizar Rankings Page:**
    *   Convertir el estado local estático `CATEGORY_DATA` en llamadas HTTP usando React Query (`@tanstack/react-query`) apuntando a `/api/rankings/${activeCategory}`.
2.  **Mapear Tipos:**
    *   Consumir los avatares reales (`avatar_url`), nombres verídicos (`display_name`), recuento real de seguidores (`subscribers`) y porcentajes calculados provenientes de la base de datos del backend.
