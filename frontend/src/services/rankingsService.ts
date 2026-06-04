export interface RankingResult {
  position: number;
  creatorId: string;
  displayName: string;
  avatarUrl: string | null;
  impactTotal30d?: number;
  viewsVideos30d?: number;
  viewsShorts30d?: number;
  videos30d?: number;
  shorts30d?: number;
}

export interface RankingResponse {
  snapshotDate: string | null;
  total: number;
  page: number;
  limit: number;
  results: RankingResult[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const rankingsService = {
  async getRankingImpactTotal(page: number, limit: number): Promise<RankingResponse> {
    const res = await fetch(`${API_URL}/api/rankings/impact-total?page=${page}&limit=${limit}`);
    if (!res.ok) {
      throw new Error('Error al obtener el ranking de Impacto Total');
    }
    return res.json();
  },

  async getRankingVideosLargos(page: number, limit: number): Promise<RankingResponse> {
    const res = await fetch(`${API_URL}/api/rankings/videos-largos?page=${page}&limit=${limit}`);
    if (!res.ok) {
      throw new Error('Error al obtener el ranking de Videos Largos');
    }
    return res.json();
  },

  async getRankingShorts(page: number, limit: number): Promise<RankingResponse> {
    const res = await fetch(`${API_URL}/api/rankings/shorts?page=${page}&limit=${limit}`);
    if (!res.ok) {
      throw new Error('Error al obtener el ranking de Shorts');
    }
    return res.json();
  },
};
