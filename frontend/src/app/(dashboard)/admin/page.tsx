'use client';

import { useEffect, useState, useMemo } from 'react';
import { 
  Shield, 
  Search, 
  Filter, 
  Play, 
  Archive, 
  Pause,
  RotateCcw, 
  CheckCircle, 
  AlertCircle, 
  Database,
  ExternalLink,
  Loader2
} from 'lucide-react';

interface Creator {
  id: string;
  platform: string;
  channelId: string;
  slug: string;
  displayName: string;
  avatarUrl: string | null;
  category: string | null;
  trackingStatus: 'searched' | 'tracked' | 'archived';
  _count: {
    snapshots: number;
  };
}

export default function AdminPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const fetchCreators = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/api/admin/channels`);
      if (!res.ok) throw new Error('Error al obtener la lista de canales');
      const data = await res.json();
      setCreators(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'searched' | 'tracked' | 'archived') => {
    const oldStatus = creators.find(c => c.id === id)?.trackingStatus;
    
    try {
      setUpdatingId(id);
      const res = await fetch(`${apiUrl}/api/admin/channels/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Error al actualizar el estado del canal');
      
      // Update state locally (automatic reactive updates)
      setCreators(prev => prev.map(c => c.id === id ? { ...c, trackingStatus: newStatus } : c));
      
      // Select exact toast message based on state transitions
      let message = 'Estado actualizado correctamente';
      if (newStatus === 'archived') {
        message = 'Canal archivado correctamente';
      } else if (newStatus === 'tracked') {
        if (oldStatus === 'archived') {
          message = 'Canal restaurado correctamente';
        } else {
          message = 'Monitoreo activado correctamente';
        }
      } else if (newStatus === 'searched') {
        message = 'Monitoreo desactivado correctamente';
      }

      setToast({ message, type: 'success' });
      
      // Auto-hide toast after 4 seconds
      setTimeout(() => {
        setToast(prev => prev?.message === message ? null : prev);
      }, 4000);

    } catch (err) {
      setToast({ 
        message: err instanceof Error ? err.message : 'Error al procesar la solicitud', 
        type: 'error' 
      });
      setTimeout(() => setToast(null), 4000);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter & Search creators
  const filteredCreators = useMemo(() => {
    return creators.filter(c => {
      const matchesSearch = c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            c.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.channelId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' ? true : c.trackingStatus === statusFilter;
      const matchesPlatform = platformFilter === 'all' ? true : c.platform.toLowerCase() === platformFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesPlatform;
    });
  }, [creators, searchQuery, statusFilter, platformFilter]);

  // Statistics counters (updates reactively without reloading page)
  const stats = useMemo(() => {
    return {
      total: creators.length,
      tracked: creators.filter(c => c.trackingStatus === 'tracked').length,
      archived: creators.filter(c => c.trackingStatus === 'archived').length,
      searched: creators.filter(c => c.trackingStatus === 'searched').length,
      totalSnapshots: creators.reduce((acc, c) => acc + c._count.snapshots, 0)
    };
  }, [creators]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1 sm:px-4 py-4 relative">
      
      {/* Toast Notification */}
      {toast && (
        <div 
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-2xl transition-all duration-300 transform translate-y-0 opacity-100 ${
            toast.type === 'success' 
              ? 'bg-green-500/10 border-green-500/25 text-green-400' 
              : 'bg-red-500/10 border-red-500/25 text-red-400'
          }`}
          style={{ animation: 'vl-slide-up 0.3s var(--ease-out) both' }}
        >
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span className="text-xs font-bold tracking-tight">{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--vl-border)]/40 bg-[var(--vl-bg-surface)]/20 p-6 sm:p-8 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-purple-500/5 to-cyan-500/5 z-0" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--vl-text-tertiary)]">Administración</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--vl-text-primary)] tracking-tight">
              Gestión de Canales
            </h1>
            <p className="text-sm text-[var(--vl-text-secondary)] font-medium max-w-xl">
              Controla las fuentes de datos del Dashboard. Activa el monitoreo diario, archiva canales inactivos o restaura búsquedas previas.
            </p>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-[var(--vl-bg-surface)]/40 border border-[var(--vl-border)]/55 px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--vl-text-secondary)]">
              <Database className="w-4 h-4 text-purple-500" />
              <span>Snapshots en DB: <strong className="text-[var(--vl-text-primary)]">{stats.totalSnapshots}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm px-4 py-3 rounded-xl">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* Mini Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Canales', value: stats.total, color: 'text-[var(--vl-text-primary)]', bg: 'bg-white/[0.02] border-[var(--vl-border)]/40' },
          { label: 'Monitoreados (Tracked)', value: stats.tracked, color: 'text-green-500', bg: 'bg-green-500/5 border-green-500/10' },
          { label: 'Archivados', value: stats.archived, color: 'text-amber-500', bg: 'bg-amber-500/5 border-amber-500/10' },
          { label: 'Búsquedas (Searched)', value: stats.searched, color: 'text-blue-500', bg: 'bg-blue-500/5 border-blue-500/10' },
        ].map((item, idx) => (
          <div key={idx} className={`p-4 rounded-xl border ${item.bg} backdrop-blur-md`}>
            <p className="text-[10px] uppercase font-bold text-[var(--vl-text-tertiary)] tracking-wider">{item.label}</p>
            <p className={`text-2xl font-black mt-1 ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-[var(--vl-bg-surface)]/30 border border-[var(--vl-border)]/40 rounded-2xl backdrop-blur-md">
        
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--vl-text-tertiary)]" />
          <input
            type="text"
            placeholder="Buscar canal por nombre, slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/[0.02] border border-[var(--vl-border)]/60 rounded-xl text-sm font-medium text-[var(--vl-text-primary)] focus:outline-none focus:border-red-500/40 transition-colors placeholder-[var(--vl-text-disabled)]"
          />
        </div>

        {/* Filters Selects */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[var(--vl-text-tertiary)]" />
            <span className="text-xs font-semibold text-[var(--vl-text-tertiary)]">Filtrar:</span>
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/[0.02] border border-[var(--vl-border)]/60 text-xs font-semibold text-[var(--vl-text-secondary)] rounded-xl py-2 px-3 focus:outline-none focus:border-red-500/40 cursor-pointer"
          >
            <option value="all">Todos los Estados</option>
            <option value="tracked">Monitoreados (Tracked)</option>
            <option value="archived">Archivados</option>
            <option value="searched">Búsquedas (Searched)</option>
          </select>

          {/* Platform filter */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="bg-white/[0.02] border border-[var(--vl-border)]/60 text-xs font-semibold text-[var(--vl-text-secondary)] rounded-xl py-2 px-3 focus:outline-none focus:border-red-500/40 cursor-pointer"
          >
            <option value="all">Todas las Plataformas</option>
            <option value="youtube">YouTube</option>
            <option value="twitch">Twitch</option>
            <option value="kick">Kick</option>
          </select>
        </div>
      </div>

      {/* Channels Table Container */}
      <div className="vl-card-dashboard overflow-hidden border border-[var(--vl-border)]/45 bg-[var(--vl-bg-surface)]/40 rounded-2xl backdrop-blur-md">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            <p className="text-xs font-semibold text-[var(--vl-text-tertiary)] uppercase tracking-wider">Cargando canales...</p>
          </div>
        ) : filteredCreators.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <AlertCircle className="w-10 h-10 text-[var(--vl-text-disabled)] mx-auto" />
            <h3 className="text-sm font-bold text-[var(--vl-text-secondary)]">No se encontraron canales</h3>
            <p className="text-xs text-[var(--vl-text-tertiary)]">Prueba ajustando los filtros o criterios de búsqueda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--vl-border)]/45 text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider">
                  <th className="p-4 pl-6">Canal</th>
                  <th className="p-4">Plataforma</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4">Snapshots</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 pr-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--vl-border)]/35">
                {filteredCreators.map((creator) => {
                  
                  // Status badge style mapping
                  const statusColors = {
                    tracked: 'bg-green-500/10 text-green-500 border-green-500/20',
                    archived: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
                    searched: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                  }[creator.trackingStatus] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';

                  const platformBadgeColors = {
                    youtube: 'bg-red-500/10 text-red-500 border-red-500/20',
                    twitch: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
                    kick: 'bg-green-500/10 text-green-500 border-green-500/20'
                  }[creator.platform.toLowerCase()] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';

                  const isSeed = creator.channelId.includes('_Seed');

                  return (
                    <tr key={creator.id} className="hover:bg-white/[0.01] transition-colors group">
                      
                      {/* Name / Avatar */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="relative shrink-0">
                            {creator.avatarUrl ? (
                              <img
                                src={creator.avatarUrl}
                                alt={creator.displayName}
                                className="w-10 h-10 rounded-full object-cover border border-[var(--vl-border)]/60"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-[var(--vl-border)]/60 flex items-center justify-center text-xs font-bold text-[var(--vl-text-tertiary)] uppercase">
                                {creator.displayName.substring(0, 2)}
                              </div>
                            )}
                            {creator.trackingStatus === 'tracked' && (
                              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[var(--vl-bg-surface)] rounded-full" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-sm text-[var(--vl-text-primary)] truncate block">
                                {creator.displayName}
                              </span>
                              {isSeed && (
                                <span className="text-[8px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30 px-1 rounded">
                                  Seed
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-semibold text-[var(--vl-text-tertiary)] truncate block mt-0.5 max-w-[150px] sm:max-w-none">
                              {creator.channelId}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Platform */}
                      <td className="p-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded ${platformBadgeColors}`}>
                          {creator.platform}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="p-4">
                        <span className="text-xs text-[var(--vl-text-secondary)] font-medium">
                          {creator.category || 'N/A'}
                        </span>
                      </td>

                      {/* Snapshots Count */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-[var(--vl-text-primary)]">
                            {creator._count.snapshots}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded whitespace-nowrap ${statusColors}`}>
                          {creator.trackingStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          {updatingId === creator.id ? (
                            <Loader2 className="w-4 h-4 text-[var(--vl-text-tertiary)] animate-spin" />
                          ) : (
                            <div className="flex flex-wrap items-center justify-end gap-1.5 max-w-[280px]">
                              
                              {/* 1. When channel is TRACKED: show 'Archivar' and 'Pausar monitoreo' */}
                              {creator.trackingStatus === 'tracked' && (
                                <>
                                  <button
                                    onClick={() => handleUpdateStatus(creator.id, 'archived')}
                                    title="Archivar canal (Archive)"
                                    disabled={updatingId !== null}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 text-amber-500 transition-colors disabled:opacity-50"
                                  >
                                    <Archive className="w-3 h-3" />
                                    <span className="hidden sm:inline">Archivar</span>
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(creator.id, 'archived')}
                                    title="Pausar monitoreo"
                                    disabled={updatingId !== null}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 transition-colors disabled:opacity-50"
                                  >
                                    <Pause className="w-3 h-3" />
                                    <span className="hidden sm:inline">Pausar monitoreo</span>
                                  </button>
                                </>
                              )}

                              {/* 2. When channel is ARCHIVED: show 'Restaurar' */}
                              {creator.trackingStatus === 'archived' && (
                                <button
                                  onClick={() => handleUpdateStatus(creator.id, 'tracked')}
                                  title="Restaurar monitoreo (Restore)"
                                  disabled={updatingId !== null}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 text-green-500 transition-colors disabled:opacity-50"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  <span>Restaurar</span>
                                </button>
                              )}

                              {/* 3. When channel is SEARCHED: show 'Activar monitoreo' */}
                              {creator.trackingStatus === 'searched' && (
                                <button
                                  onClick={() => handleUpdateStatus(creator.id, 'tracked')}
                                  title="Activar monitoreo"
                                  disabled={updatingId !== null}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 text-green-500 transition-colors disabled:opacity-50"
                                >
                                  <Play className="w-3 h-3 fill-green-500/20" />
                                  <span>Activar monitoreo</span>
                                </button>
                              )}

                              {/* Dashboard details link */}
                              <a
                                href={`/channel/${creator.platform}/${creator.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                title="Ver en Dashboard"
                                className="p-1.5 rounded-lg border border-[var(--vl-border)]/55 bg-white/[0.01] hover:bg-white/[0.03] text-[var(--vl-text-secondary)] hover:text-[var(--vl-text-primary)] transition-colors shrink-0"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          )}

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
