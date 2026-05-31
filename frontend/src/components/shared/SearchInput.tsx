'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  platform: string;
  channel_id: string;
  slug: string;
  display_name: string;
  subscribers: number;
  verified: boolean;
  avatar_url?: string;
  alreadyExists?: boolean;
}

const PLACEHOLDERS = [
  "Busca un creador (ej. Alofoke Radio Show)...",
  "Busca un podcast (ej. Capricornio TV)...",
  "Busca un streamer (ej. Mata Lluvia)...",
  "Analiza métricas de YouTube, Twitch y Kick...",
  "Busca a tu creador favorito..."
];

export function SearchInput({ variant = 'default', onSelect }: { variant?: 'default' | 'minimal', onSelect?: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [importStates, setImportStates] = useState<Record<string, 'idle' | 'importing' | 'imported' | 'alreadyExists'>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleImport = async (e: React.MouseEvent, result: SearchResult) => {
    e.stopPropagation();
    setImportStates(prev => ({ ...prev, [result.channel_id]: 'importing' }));

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/admin/channels/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          channelId: result.channel_id,
          platform: 'youtube'
        })
      });

      if (!res.ok) throw new Error('Import failed');

      const data = await res.json();
      if (data.alreadyExists) {
        setImportStates(prev => ({ ...prev, [result.channel_id]: 'alreadyExists' }));
      } else {
        setImportStates(prev => ({ ...prev, [result.channel_id]: 'imported' }));
      }
      
      router.refresh();
    } catch (error) {
      console.error('Error importing channel:', error);
      setImportStates(prev => ({ ...prev, [result.channel_id]: 'idle' }));
    }
  };

  useEffect(() => {
    // Handle clicking outside to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut: Focus search on '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && 
          document.activeElement !== inputRef.current && 
          document.activeElement?.tagName !== 'INPUT' && 
          document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cycle placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
    }, 500); // 500ms debounce

    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    setShowDropdown(false);
    setQuery('');
    if (onSelect) onSelect();
    router.push(`/channel/${result.platform}/${result.channel_id}`);
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      if (results.length > 0) {
        handleSelect(results[0]);
      } else {
        if (onSelect) onSelect();
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Outer glow container */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-red-500/30 via-purple-500/20 to-cyan-500/30 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 group-hover:opacity-60 transition duration-500" />
      
      <form 
        onSubmit={handleAnalyze} 
        className={`relative flex items-center bg-[var(--vl-bg-surface)] border border-[var(--vl-border)] overflow-hidden z-20 group-focus-within:border-[var(--vl-red)] transition-all duration-300 ${
          variant === 'minimal' 
            ? 'h-9 rounded-xl hover:bg-[var(--vl-bg-elevated)]' 
            : 'flex-col sm:flex-row p-1.5 sm:p-0 rounded-2xl shadow-2xl gap-2 sm:gap-0'
        }`}
      >
        <div className="flex w-full sm:flex-1 items-center relative">
          <Search className={`${variant === 'minimal' ? 'w-4 h-4 ml-3' : 'w-5 h-5 md:w-6 md:h-6 ml-3 md:ml-6'} text-[var(--vl-text-tertiary)] shrink-0`} />
          <input 
            ref={inputRef}
            type="text" 
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.length < 2) setShowDropdown(false);
            }}
            placeholder={PLACEHOLDERS[placeholderIndex]} 
            className={`flex-1 bg-transparent text-[var(--vl-text-primary)] placeholder:text-[var(--vl-text-tertiary)] placeholder:transition-opacity placeholder:duration-500 focus:outline-none min-w-0 ${
              variant === 'minimal' ? 'h-9 px-3 text-sm' : 'h-12 sm:h-14 md:h-16 px-3 md:px-6 text-base md:text-lg'
            }`}
          />
          {variant !== 'minimal' && !query && (
            <div className="absolute right-4 hidden md:flex items-center gap-1.5 pointer-events-none">
              <span className="text-[10px] text-[var(--vl-text-tertiary)] uppercase tracking-wider font-semibold">Presiona</span>
              <kbd className="vl-kbd">/</kbd>
            </div>
          )}
          {variant === 'minimal' && isSearching && (
            <Loader2 className="w-4 h-4 mr-3 vl-animate-spin text-[var(--vl-text-secondary)]" />
          )}
        </div>
        
        {variant !== 'minimal' && (
          <button 
            type="submit"
            disabled={isSearching}
            className="w-full sm:w-auto h-12 sm:h-14 md:h-16 px-8 md:px-10 bg-[var(--vl-red)] hover:bg-[var(--vl-red-hover)] text-white font-semibold text-base md:text-lg transition-all duration-300 flex items-center justify-center gap-2 rounded-xl sm:rounded-none shrink-0 disabled:opacity-70 group/btn"
          >
            {isSearching ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Analizar</span>
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
              </>
            )}
          </button>
        )}
      </form>

      {/* Dropdown Results */}
      {showDropdown && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-[var(--vl-bg-elevated)] border border-[var(--vl-border)] rounded-2xl shadow-2xl z-30 max-h-[350px] overflow-y-auto divide-y divide-[var(--vl-border)] animate-in fade-in slide-in-from-top-2 duration-300">
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => handleSelect(result)}
              className="w-full text-left px-5 py-3.5 flex items-center gap-4 hover:bg-white/[0.02] transition-colors duration-200"
            >
              {result.avatar_url ? (
                <img src={result.avatar_url} alt={result.display_name} className="w-10 h-10 rounded-full object-cover ring-1 ring-[var(--vl-border)] bg-[var(--vl-bg-secondary)]" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[var(--vl-bg-secondary)] border border-[var(--vl-border)] flex items-center justify-center text-[var(--vl-text-tertiary)] font-bold text-sm">
                  {result.display_name.slice(0,2).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-[var(--vl-text-primary)] truncate text-sm md:text-base">{result.display_name}</p>
                  {result.verified && (
                    <span className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold" title="Verificado">✓</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--vl-text-secondary)] mt-0.5">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    result.platform === 'youtube' ? 'bg-red-500/10 text-red-500' :
                    result.platform === 'twitch' ? 'bg-purple-500/10 text-purple-500' : 'bg-green-500/10 text-green-500'
                  }`}>{result.platform}</span>
                  <span>•</span>
                  <span>{new Intl.NumberFormat('es-ES', { notation: "compact", compactDisplay: "short" }).format(result.subscribers)} subs</span>
                </div>
              </div>
              {result.platform === 'youtube' && (
                <button
                  onClick={(e) => handleImport(e, result)}
                  disabled={importStates[result.channel_id] === 'importing' || result.alreadyExists || importStates[result.channel_id] === 'imported' || importStates[result.channel_id] === 'alreadyExists'}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 shrink-0 ${
                    result.alreadyExists || importStates[result.channel_id] === 'alreadyExists'
                      ? 'bg-white/[0.04] text-[var(--vl-text-tertiary)] border border-[var(--vl-border)]/50 cursor-not-allowed'
                      : importStates[result.channel_id] === 'imported'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : importStates[result.channel_id] === 'importing'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20 cursor-wait'
                      : 'bg-[var(--vl-red)] hover:bg-[var(--vl-red-hover)] text-white'
                  }`}
                >
                  {importStates[result.channel_id] === 'importing' ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Importando</span>
                    </span>
                  ) : importStates[result.channel_id] === 'imported' ? (
                    <span>Agregado</span>
                  ) : result.alreadyExists || importStates[result.channel_id] === 'alreadyExists' ? (
                    <span>Ya existe</span>
                  ) : (
                    <span>Agregar a Viewlytics</span>
                  )}
                </button>
              )}
            </button>
          ))}
        </div>
      )}

      {showDropdown && results.length === 0 && !isSearching && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-[var(--vl-bg-elevated)] border border-[var(--vl-border)] rounded-2xl shadow-2xl z-30 p-6 text-center text-[var(--vl-text-secondary)] animate-in fade-in slide-in-from-top-2 duration-300">
          No se encontraron resultados para &quot;<span className="text-[var(--vl-text-primary)] font-semibold">{query}</span>&quot;
        </div>
      )}
    </div>
  );
}
