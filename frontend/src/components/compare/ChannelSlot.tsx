'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, X } from 'lucide-react';

/* ── Types ── */
interface SearchResult {
  id: string;
  platform: string;
  channel_id: string;
  slug: string;
  display_name: string;
  subscribers: number;
  verified: boolean;
  avatar_url?: string;
}

export interface ChannelData {
  displayName: string;
  avatarUrl: string;
  subscribers: number;
  totalViews: number;
  totalVideos: number;
  views30d: number;
  shorts_views_30d: number;
  total_views_30d: number;
  videos_30d: number;
  shorts_count_30d: number;
  engagement_rate: number;
  average_views: number;
}

interface ChannelSlotProps {
  label: string;
  channelData: ChannelData | null;
  loading: boolean;
  onSelect: (slug: string) => void;
  onClear: () => void;
}

/* ── Skeleton Loader ── */
function SlotSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 py-8 animate-pulse">
      <div className="w-20 h-20 rounded-full bg-[var(--vl-border)]" />
      <div className="h-5 w-40 bg-[var(--vl-border)] rounded-lg" />
      <div className="h-3 w-28 bg-[var(--vl-border)] rounded-lg" />
      <div className="grid grid-cols-2 gap-3 w-full mt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 bg-[var(--vl-border)] rounded-xl" />
        ))}
      </div>
    </div>
  );
}

/* ── Metric Mini Card ── */
function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/[0.02] border border-[var(--vl-border)] rounded-xl px-3 py-2.5 text-center">
      <p className="text-[10px] uppercase tracking-wider font-semibold text-[var(--vl-text-tertiary)] mb-1">{label}</p>
      <p className="text-sm font-bold text-[var(--vl-text-primary)]">{value}</p>
    </div>
  );
}

const fmt = (n: number) =>
  new Intl.NumberFormat('es-ES', { notation: 'compact', maximumFractionDigits: 1 }).format(n);

/* ════════════════════════════════════════════════════════════════════════════
 * ChannelSlot — Empty (search) or Loaded (channel preview)
 * ════════════════════════════════════════════════════════════════════════════ */
export function ChannelSlot({ label, channelData, loading, onSelect, onClear }: ChannelSlotProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* Debounced search */
  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const res = await fetch(`${apiUrl}/api/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        setResults(data.results || []);
        setShowDropdown(true);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(() => {
      if (query.length >= 2) {
        fetchResults();
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    setShowDropdown(false);
    setQuery('');
    setResults([]);
    onSelect(result.channel_id);
  };

  /* ── Loading State ── */
  if (loading) {
    return (
      <div className="vl-card-dashboard border border-[var(--vl-border)] rounded-2xl bg-[var(--vl-bg-surface)]/60 backdrop-blur-md p-6">
        <p className="text-[10px] uppercase tracking-widest font-bold text-[var(--vl-text-tertiary)] mb-4">{label}</p>
        <SlotSkeleton />
      </div>
    );
  }

  /* ── Loaded State ── */
  if (channelData) {
    return (
      <div className="vl-card-dashboard border border-[var(--vl-border)] rounded-2xl bg-[var(--vl-bg-surface)]/60 backdrop-blur-md p-6 transition-all duration-500 animate-in fade-in slide-in-from-bottom-2">
        {/* Header row */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-[10px] uppercase tracking-widest font-bold text-[var(--vl-text-tertiary)]">{label}</p>
          <button
            onClick={onClear}
            className="p-1.5 rounded-lg hover:bg-white/[0.06] text-[var(--vl-text-tertiary)] hover:text-[var(--vl-text-primary)] transition-all duration-200"
            title="Cambiar canal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Channel identity */}
        <div className="flex flex-col items-center text-center gap-3 mb-6">
          {channelData.avatarUrl ? (
            <img
              src={channelData.avatarUrl}
              alt={channelData.displayName}
              className="w-20 h-20 rounded-full ring-2 ring-[var(--vl-border)] object-cover shadow-lg"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[var(--vl-bg-elevated)] border border-[var(--vl-border)] flex items-center justify-center text-2xl font-bold text-[var(--vl-text-tertiary)]">
              {channelData.displayName.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-[var(--vl-text-primary)] leading-tight">{channelData.displayName}</h3>
            <p className="text-xs text-[var(--vl-text-secondary)] mt-1 font-medium">{fmt(channelData.subscribers)} suscriptores</p>
          </div>
        </div>

        {/* Mini metric grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <MiniMetric label="Vistas Totales" value={fmt(channelData.totalViews)} />
          <MiniMetric label="Videos Totales" value={fmt(channelData.totalVideos)} />
          <MiniMetric label="Impacto 30D" value={fmt(channelData.total_views_30d)} />
          <MiniMetric label="Engagement" value={`${channelData.engagement_rate.toFixed(1)}%`} />
        </div>
      </div>
    );
  }

  /* ── Empty State (Search) ── */
  return (
    <div className="vl-card-dashboard border border-[var(--vl-border)] border-dashed rounded-2xl bg-[var(--vl-bg-surface)]/30 backdrop-blur-md p-6 min-h-[340px] flex flex-col">
      <p className="text-[10px] uppercase tracking-widest font-bold text-[var(--vl-text-tertiary)] mb-4">{label}</p>

      {/* Search input */}
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center bg-[var(--vl-bg-elevated)] border border-[var(--vl-border)] rounded-xl overflow-hidden transition-all duration-300 focus-within:border-[var(--vl-cyan)]/40">
          <Search className="w-4 h-4 ml-3 text-[var(--vl-text-tertiary)] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.length < 2) setShowDropdown(false);
            }}
            placeholder="Buscar canal..."
            className="flex-1 bg-transparent h-11 px-3 text-sm text-[var(--vl-text-primary)] placeholder:text-[var(--vl-text-tertiary)] focus:outline-none min-w-0"
          />
          {isSearching && (
            <Loader2 className="w-4 h-4 mr-3 animate-spin text-[var(--vl-text-secondary)]" />
          )}
        </div>

        {/* Dropdown results */}
        {showDropdown && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--vl-bg-elevated)] border border-[var(--vl-border)] rounded-xl shadow-2xl z-30 max-h-[260px] overflow-y-auto divide-y divide-[var(--vl-border)] animate-in fade-in slide-in-from-top-2 duration-300">
            {results.map((result) => (
              <button
                key={result.id}
                onClick={() => handleSelect(result)}
                className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/[0.03] transition-colors duration-200"
              >
                {result.avatar_url ? (
                  <img src={result.avatar_url} alt={result.display_name} className="w-9 h-9 rounded-full object-cover ring-1 ring-[var(--vl-border)] bg-[var(--vl-bg-secondary)] shrink-0" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[var(--vl-bg-secondary)] border border-[var(--vl-border)] flex items-center justify-center text-[var(--vl-text-tertiary)] font-bold text-xs shrink-0">
                    {result.display_name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-[var(--vl-text-primary)] truncate text-sm">{result.display_name}</p>
                    {result.verified && (
                      <span className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold shrink-0" title="Verificado">✓</span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--vl-text-secondary)] mt-0.5">
                    {fmt(result.subscribers)} subs
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {showDropdown && results.length === 0 && !isSearching && query.length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--vl-bg-elevated)] border border-[var(--vl-border)] rounded-xl shadow-2xl z-30 p-5 text-center text-[var(--vl-text-secondary)] text-sm animate-in fade-in slide-in-from-top-2 duration-300">
            No se encontraron resultados para &quot;<span className="text-[var(--vl-text-primary)] font-semibold">{query}</span>&quot;
          </div>
        )}
      </div>

      {/* Visual placeholder */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 mt-6 opacity-40">
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-[var(--vl-border)] flex items-center justify-center">
          <Search className="w-6 h-6 text-[var(--vl-text-tertiary)]" />
        </div>
        <p className="text-xs text-[var(--vl-text-tertiary)] font-medium text-center">Selecciona un canal para comparar</p>
      </div>
    </div>
  );
}
