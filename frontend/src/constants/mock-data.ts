/**
 * Viewlytics — Mock Data Constants
 *
 * Datos de demostración realistas para la homepage (Stage 01).
 * No conectar APIs todavía — estos datos simulan la experiencia final del producto.
 *
 * IMPORTANTE: Los tipos siguen las definiciones en @/types/analytics.types.ts
 *
 * @see execution-pack/08-stage-prompts.md — Stage 01 requirements
 */

import type { CreatorProfile, GrowthDataPoint, RankingEntry } from '@/types';

// ---------------------------------------------------------------------------
// CREATOR PROFILES — Dominican creators mock data
// Matches the CreatorProfile interface in analytics.types.ts
// ---------------------------------------------------------------------------

export const FEATURED_CREATOR: CreatorProfile = {
  id: 'creator-001',
  name: 'El Circo Podcast',
  handle: '@ElCircoPodcast',
  avatarUrl: '',
  platform: 'youtube',
  isVerified: false,
  categories: ['podcast'],
  country: 'DO',
  metrics: {
    followers: 1_420_000,
    views: 87_300_000,
    uploads: 312,
    engagementScore: 6.8,
    growthRate: 12.4,
  },
};

export const MOCK_CREATORS: CreatorProfile[] = [
  {
    id: 'creator-001',
    name: 'El Circo Podcast',
    handle: '@ElCircoPodcast',
    avatarUrl: '',
    platform: 'youtube',
    isVerified: false,
    categories: ['podcast'],
    country: 'DO',
    metrics: {
      followers: 1_420_000,
      views: 87_300_000,
      uploads: 312,
      engagementScore: 6.8,
      growthRate: 12.4,
    },
  },
  {
    id: 'creator-002',
    name: 'Omega El Fuerte',
    handle: '@OmegaElFuerte',
    avatarUrl: '',
    platform: 'youtube',
    isVerified: true,
    categories: ['music', 'entertainment'],
    country: 'DO',
    metrics: {
      followers: 2_100_000,
      views: 340_000_000,
      uploads: 890,
      engagementScore: 5.2,
      growthRate: 8.7,
    },
  },
  {
    id: 'creator-003',
    name: 'Manny Viloria',
    handle: '@MannyViloria',
    avatarUrl: '',
    platform: 'youtube',
    isVerified: false,
    categories: ['podcast', 'lifestyle'],
    country: 'DO',
    metrics: {
      followers: 890_000,
      views: 56_200_000,
      uploads: 178,
      engagementScore: 7.1,
      growthRate: 21.3,
    },
  },
  {
    id: 'creator-004',
    name: 'Rhadamés Cordero',
    handle: '@RhadamesCordero',
    avatarUrl: '',
    platform: 'youtube',
    isVerified: false,
    categories: ['news', 'media'],
    country: 'DO',
    metrics: {
      followers: 670_000,
      views: 42_100_000,
      uploads: 234,
      engagementScore: 4.9,
      growthRate: 15.6,
    },
  },
  {
    id: 'creator-005',
    name: 'Nidea Reynoso',
    handle: '@NideaReynoso',
    avatarUrl: '',
    platform: 'youtube',
    isVerified: false,
    categories: ['podcast', 'lifestyle'],
    country: 'DO',
    metrics: {
      followers: 540_000,
      views: 29_800_000,
      uploads: 142,
      engagementScore: 8.3,
      growthRate: 18.9,
    },
  },
];

// ---------------------------------------------------------------------------
// GROWTH DATA — 12-month subscriber growth for the featured creator
// ---------------------------------------------------------------------------

export const SUBSCRIBERS_GROWTH_DATA: GrowthDataPoint[] = [
  { date: '2025-06', value: 920_000 },
  { date: '2025-07', value: 980_000 },
  { date: '2025-08', value: 1_050_000 },
  { date: '2025-09', value: 1_090_000 },
  { date: '2025-10', value: 1_140_000 },
  { date: '2025-11', value: 1_180_000 },
  { date: '2025-12', value: 1_220_000 },
  { date: '2026-01', value: 1_260_000 },
  { date: '2026-02', value: 1_300_000 },
  { date: '2026-03', value: 1_350_000 },
  { date: '2026-04', value: 1_390_000 },
  { date: '2026-05', value: 1_420_000 },
];

export const VIEWS_GROWTH_DATA: GrowthDataPoint[] = [
  { date: '2025-06', value: 3_200_000 },
  { date: '2025-07', value: 4_800_000 },
  { date: '2025-08', value: 6_100_000 },
  { date: '2025-09', value: 5_400_000 },
  { date: '2025-10', value: 7_200_000 },
  { date: '2025-11', value: 8_900_000 },
  { date: '2025-12', value: 11_400_000 },
  { date: '2026-01', value: 9_200_000 },
  { date: '2026-02', value: 10_800_000 },
  { date: '2026-03', value: 12_300_000 },
  { date: '2026-04', value: 13_700_000 },
  { date: '2026-05', value: 15_100_000 },
];

// ---------------------------------------------------------------------------
// RANKINGS — Top creators mock ranking entries
// Matches the RankingEntry interface in analytics.types.ts
// ---------------------------------------------------------------------------

export const TOP_RANKINGS: RankingEntry[] = [
  {
    rank: 1,
    rankChange: 0,
    creator: MOCK_CREATORS[1], // Omega
    category: 'top-creators',
    score: 98.4,
  },
  {
    rank: 2,
    rankChange: 1,
    creator: MOCK_CREATORS[0], // El Circo
    category: 'top-creators',
    score: 94.7,
  },
  {
    rank: 3,
    rankChange: -1,
    creator: MOCK_CREATORS[2], // Manny Viloria
    category: 'top-creators',
    score: 91.2,
  },
  {
    rank: 4,
    rankChange: 0,
    creator: MOCK_CREATORS[3], // Rhadamés
    category: 'top-creators',
    score: 87.5,
  },
  {
    rank: 5,
    rankChange: 1,
    creator: MOCK_CREATORS[4], // Nidea
    category: 'top-creators',
    score: 83.9,
  },
];

// ---------------------------------------------------------------------------
// FEATURES — Platform feature cards (UI-only type, not in @/types)
// ---------------------------------------------------------------------------

export interface FeatureCard {
  id: string;
  icon: string;
  title: string;
  description: string;
  highlight?: boolean;
}

export const FEATURES: FeatureCard[] = [
  {
    id: 'analytics-intelligence',
    icon: 'BarChart3',
    title: 'Inteligencia Analítica',
    description:
      'Análisis profundo de suscriptores, vistas e interacción con detección de tendencias. Comprende qué impulsa el crecimiento.',
    highlight: true,
  },
  {
    id: 'ranking-system',
    icon: 'Trophy',
    title: 'Sistema de Clasificación',
    description:
      'Clasificaciones de creadores en tiempo real por suscriptores, tasa de crecimiento e interacción. Actualizado diariamente.',
  },
  {
    id: 'historical-snapshots',
    icon: 'History',
    title: 'Historial de Datos',
    description:
      'Sigue el rendimiento del creador a lo largo del tiempo. Las capturas mensuales revelan patrones y trayectorias de crecimiento.',
  },
  {
    id: 'engagement-intelligence',
    icon: 'Zap',
    title: 'Métricas de Interacción',
    description:
      'Analiza tasas de me gusta, comentarios y compartidos por video. Identifica patrones de contenido viral a tiempo.',
  },
  {
    id: 'export-engine',
    icon: 'Share2',
    title: 'Motor de Exportación',
    description:
      'Genera tarjetas sociales premium para Instagram, Facebook y Twitter. Exportación en alta calidad con marca Viewlytics.',
    highlight: true,
  },
  {
    id: 'platform-expansion',
    icon: 'Globe',
    title: 'Multiplataforma',
    description:
      'Iniciando con YouTube. Próximamente analíticas de Twitch, Kick y TikTok — con el mismo panel de control premium.',
  },
];

// ---------------------------------------------------------------------------
// TRUSTED CREATORS — Showcase section (UI-only type)
// ---------------------------------------------------------------------------

export interface TrustedCreator {
  id: string;
  name: string;
  category: 'podcast' | 'streamer' | 'gaming' | 'media';
  subscribers: string;
}

export const TRUSTED_CREATORS: TrustedCreator[] = [
  { id: 'tc-01', name: 'El Circo Podcast', category: 'podcast', subscribers: '1.4M' },
  { id: 'tc-02', name: 'Omega El Fuerte', category: 'media', subscribers: '2.1M' },
  { id: 'tc-03', name: 'Manny Viloria', category: 'podcast', subscribers: '890K' },
  { id: 'tc-04', name: 'Rhadamés Cordero', category: 'media', subscribers: '670K' },
  { id: 'tc-05', name: 'Nidea Reynoso', category: 'podcast', subscribers: '540K' },
  { id: 'tc-06', name: 'El Pachá', category: 'media', subscribers: '1.2M' },
  { id: 'tc-07', name: 'RD Gamers', category: 'gaming', subscribers: '380K' },
  { id: 'tc-08', name: 'StreamersRD', category: 'streamer', subscribers: '290K' },
];
