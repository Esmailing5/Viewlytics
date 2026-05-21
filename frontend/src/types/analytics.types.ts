/**
 * Viewlytics — Tipos de Analíticas
 *
 * Definiciones de tipo de analíticas independientes de la plataforma.
 * Estos tipos se comparten entre todas las integraciones de plataforma (YouTube, Twitch, Kick, etc.)
 * para garantizar que el frontend nunca dependa de estructuras de datos específicas de la plataforma.
 *
 * El frontend consume ÚNICAMENTE datos normalizados a través de estos tipos unificados.
 *
 * @see execution-pack/16-platform-expansion.md — Arquitectura multiplataforma
 * @see execution-pack/10-core-protection.md — Reglas de aislamiento de datos
 */

/**
 * Plataformas de analíticas soportadas.
 * Las nuevas plataformas se agregan aquí y requieren un adaptador de servicio correspondiente.
 */
export type PlatformType = 'youtube' | 'twitch' | 'kick' | 'tiktok';

/**
 * Métricas unificadas de creadores — independientes de la plataforma.
 * Cada servicio de plataforma debe normalizar sus datos en esta estructura.
 */
export interface CreatorMetrics {
  /** Seguidores/suscriptores totales */
  readonly followers: number;
  /** Visualizaciones de contenido totales */
  readonly views: number;
  /** Cargas/transmisiones/videos totales */
  readonly uploads: number;
  /** Puntuación de engagement o interacción (0-100, calculada en el servidor) */
  readonly engagementScore: number;
  /** Porcentaje de tasa de crecimiento durante el período seleccionado */
  readonly growthRate: number;
}

/**
 * Punto de datos de crecimiento para analíticas de series temporales.
 * Utilizado por los gráficos para representar tendencias históricas.
 */
export interface GrowthDataPoint {
  /** Cadena de fecha ISO para este punto de datos */
  readonly date: string;
  /** Valor de la métrica en este punto en el tiempo */
  readonly value: number;
  /** Etiqueta opcional para visualización */
  readonly label?: string;
}

/**
 * Conjunto completo de datos de crecimiento para una métrica específica.
 * Contiene la serie temporal y estadísticas de resumen calculadas.
 */
export interface GrowthData {
  /** La métrica que representan estos datos */
  readonly metric: 'followers' | 'views' | 'uploads' | 'engagement';
  /** Puntos de datos históricos */
  readonly dataPoints: readonly GrowthDataPoint[];
  /** Cambio calculado sobre el período */
  readonly periodChange: number;
  /** Porcentaje de cambio calculado */
  readonly periodChangePercent: number;
}

/**
 * Perfil de creador normalizado — independiente de la plataforma.
 * El frontend renderiza esta estructura independientemente de la plataforma de origen.
 */
export interface CreatorProfile {
  /** Identificador único del backend */
  readonly id: string;
  /** Nombre de visualización */
  readonly name: string;
  /** Nombre de usuario/handle en la plataforma (ej. @nombre_usuario) */
  readonly handle: string;
  /** URL del avatar */
  readonly avatarUrl: string;
  /** URL de la imagen de portada/banner opcional */
  readonly bannerUrl?: string;
  /** Plataforma de origen */
  readonly platform: PlatformType;
  /** Descripción/biografía del creador */
  readonly description?: string;
  /** Instantánea (snapshot) de métricas actuales */
  readonly metrics: CreatorMetrics;
  /** Estado verificado en la plataforma */
  readonly isVerified: boolean;
  /** Código de país/región */
  readonly country?: string;
  /** Categorías de contenido */
  readonly categories: readonly string[];
}

/**
 * Entrada de clasificación (ranking) — recibida del motor de clasificación del backend.
 * El frontend solo las muestra; la lógica de clasificación se queda en el servidor.
 */
export interface RankingEntry {
  /** Posición en la clasificación */
  readonly rank: number;
  /** Resumen del perfil del creador */
  readonly creator: CreatorProfile;
  /** Puntuación calculada por el motor de clasificación (opaca para el frontend) */
  readonly score: number;
  /** Cambio de posición en el ranking desde el último período (+/- posiciones) */
  readonly rankChange: number;
  /** Etiqueta de la categoría de clasificación */
  readonly category: string;
}

/**
 * Envolvedor de respuesta API para datos paginados.
 * Estandariza todos los puntos finales de tipo lista.
 */
export interface PaginatedResponse<T> {
  readonly data: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly hasMore: boolean;
}

/**
 * Filtro de rango de tiempo para consultas analíticas.
 */
export type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all';

/**
 * Dirección de ordenación para listas clasificadas.
 */
export type SortDirection = 'asc' | 'desc';
