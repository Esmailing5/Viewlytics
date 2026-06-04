'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useRankings, RankingTab } from '@/hooks/useRankings';
import { RankingTable } from '@/components/rankings/RankingTable';
import { Trophy, Flame, Video, Activity, AlertCircle, ChevronLeft, ChevronRight, Calendar, Search } from 'lucide-react';

function RankingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Obtener parámetros de la URL con valores por defecto
  const activeTab = (searchParams.get('tab') || 'impact-total') as RankingTab;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  const { data, isLoading, isError, errorMsg } = useRankings(activeTab, page, limit);

  // Estado local para búsqueda client-side
  const [searchQuery, setSearchQuery] = useState('');

  // Limpiar búsqueda al cambiar de pestaña
  useEffect(() => {
    setSearchQuery('');
  }, [activeTab]);

  const handleTabChange = (newTab: RankingTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', newTab);
    params.set('page', '1'); // Reiniciar a página 1 al cambiar de tab
    router.push(`/rankings?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/rankings?${params.toString()}`);
  };

  const handleLimitChange = (newLimit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', newLimit.toString());
    params.set('page', '1'); // Reiniciar a página 1 al cambiar el límite
    router.push(`/rankings?${params.toString()}`);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Hoy';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  };

  // Filtrado client-side de creadores por nombre visible
  const filteredResults = data
    ? data.results.filter((creator) =>
        creator.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  return (
    <div className="px-4 py-6 md:p-6 max-w-7xl mx-auto space-y-6 md:space-y-8">
      {/* ─── Hero Section ─── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-[var(--vl-border)]/40">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 mb-3">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
              Auditoría de Creadores
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-[var(--vl-text-primary)] tracking-tight">
            Clasificaciones Globales
          </h1>
          <p className="text-[var(--vl-text-secondary)] mt-2 max-w-xl text-sm md:text-base font-medium">
            El ranking oficial de Viewlytics. Explora el rendimiento e impacto de los creadores en los últimos 30 días.
          </p>
        </div>

        {data?.snapshotDate && (
          <div className="flex items-center gap-2.5 bg-cyan-500/5 border border-cyan-500/15 px-4 py-2.5 rounded-2xl">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <p className="text-xs font-bold text-[var(--vl-text-secondary)] uppercase tracking-wider">
              Datos al: <span className="text-cyan-400 font-extrabold">{formatDate(data.snapshotDate)}</span>
            </p>
          </div>
        )}
      </div>

      {/* ─── Tab Selection ─── */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[var(--vl-border)]/20 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {[
          { id: 'impact-total', label: 'Impacto Total', icon: <Trophy className="w-4 h-4" /> },
          { id: 'videos-largos', label: 'Videos Largos', icon: <Video className="w-4 h-4" /> },
          { id: 'shorts', label: 'Shorts', icon: <Flame className="w-4 h-4" /> },
        ].map((tabInfo) => {
          const isActive = tabInfo.id === activeTab;
          return (
            <button
              key={tabInfo.id}
              onClick={() => handleTabChange(tabInfo.id as RankingTab)}
              className={`flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 rounded-xl text-[11px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 shrink-0 whitespace-nowrap border ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/35 shadow-md shadow-cyan-500/5 scale-[1.02]'
                  : 'bg-[var(--vl-bg-surface)]/50 text-[var(--vl-text-secondary)] border-[var(--vl-border)] hover:text-[var(--vl-text-primary)] hover:border-[var(--vl-border-hover)]'
              }`}
            >
              {tabInfo.icon}
              <span>{tabInfo.label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── Search & Limit Selector Toolbar ─── */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-[var(--vl-bg-surface)]/30 border border-[var(--vl-border)]/40 rounded-2xl backdrop-blur-md">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--vl-text-tertiary)]" />
          <input
            type="text"
            placeholder="Buscar canal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.02] border border-[var(--vl-border)]/60 rounded-xl text-sm font-medium text-[var(--vl-text-primary)] focus:outline-none focus:border-cyan-500/40 transition-colors placeholder-[var(--vl-text-disabled)]"
          />
        </div>

        {/* Limit Selector */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider">Mostrar:</span>
          <select
            value={limit}
            onChange={(e) => handleLimitChange(parseInt(e.target.value, 10))}
            className="bg-white/[0.02] border border-[var(--vl-border)]/60 text-xs font-semibold text-[var(--vl-text-secondary)] rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-cyan-500/40 cursor-pointer"
          >
            <option value={10}>10 por página</option>
            <option value={20}>20 por página</option>
            <option value={50}>50 por página</option>
          </select>
        </div>
      </div>

      {/* ─── Error Message ─── */}
      {isError && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-5 py-4 rounded-2xl max-w-2xl mx-auto">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-bold">Error al cargar las clasificaciones</p>
            <p className="text-xs text-red-400/80 mt-0.5">{errorMsg || 'Error desconocido del servidor'}</p>
          </div>
        </div>
      )}

      {/* ─── Rankings Table Card ─── */}
      {!isError && (
        <div className="vl-card-dashboard overflow-hidden border border-[var(--vl-border)]/45 bg-[var(--vl-bg-surface)]/30 rounded-2xl backdrop-blur-md">
          <RankingTable 
            results={filteredResults} 
            tab={activeTab} 
            isLoading={isLoading} 
          />
        </div>
      )}

      {/* ─── Pagination ─── */}
      {!isError && data && data.total > limit && (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t border-[var(--vl-border)]/20">
          <p className="text-xs font-semibold text-[var(--vl-text-secondary)] text-center sm:text-left">
            Mostrando <span className="text-[var(--vl-text-primary)]">{(page - 1) * limit + 1}</span> a{' '}
            <span className="text-[var(--vl-text-primary)]">
              {Math.min(page * limit, data.total)}
            </span>{' '}
            de <span className="text-[var(--vl-text-primary)]">{data.total}</span> creadores
          </p>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1 || isLoading}
              className="p-2.5 rounded-lg border border-[var(--vl-border)] bg-white/[0.02] hover:bg-white/[0.04] text-[var(--vl-text-secondary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="flex items-center px-3.5 text-xs font-bold text-[var(--vl-text-primary)] bg-white/[0.04] border border-[var(--vl-border)] rounded-lg whitespace-nowrap shrink-0">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages || isLoading}
              className="p-2.5 rounded-lg border border-[var(--vl-border)] bg-white/[0.02] hover:bg-white/[0.04] text-[var(--vl-text-secondary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RankingsPage() {
  return (
    <Suspense fallback={
      <div className="p-6 max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="h-20 bg-white/[0.05] rounded-2xl" />
        <div className="h-12 bg-white/[0.05] rounded-xl" />
        <div className="h-96 bg-white/[0.05] rounded-2xl" />
      </div>
    }>
      <RankingsContent />
    </Suspense>
  );
}
