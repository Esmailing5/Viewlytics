import { useState, useEffect } from 'react';
import { rankingsService, RankingResponse } from '@/services/rankingsService';

export type RankingTab = 'impact-total' | 'videos-largos' | 'shorts';

export function useRankings(tab: RankingTab, page: number, limit: number) {
  const [data, setData] = useState<RankingResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchRankings = async () => {
      setIsLoading(true);
      setIsError(false);
      setErrorMsg(null);
      try {
        let response: RankingResponse;
        switch (tab) {
          case 'impact-total':
            response = await rankingsService.getRankingImpactTotal(page, limit);
            break;
          case 'videos-largos':
            response = await rankingsService.getRankingVideosLargos(page, limit);
            break;
          case 'shorts':
            response = await rankingsService.getRankingShorts(page, limit);
            break;
          default:
            throw new Error('Categoría de ranking inválida');
        }
        if (active) {
          setData(response);
        }
      } catch (err) {
        if (active) {
          setIsError(true);
          setErrorMsg(err instanceof Error ? err.message : 'Error desconocido');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      };
    };

    fetchRankings();

    return () => {
      active = false;
    };
  }, [tab, page, limit]);

  return { data, isLoading, isError, errorMsg };
}
