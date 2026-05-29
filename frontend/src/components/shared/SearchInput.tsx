'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
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
}

export function SearchInput({ variant = 'default', onSelect }: { variant?: 'default' | 'minimal', onSelect?: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
      <form 
        onSubmit={handleAnalyze} 
        className={`relative flex items-center bg-[var(--vl-bg-surface)] border border-[var(--vl-border)] overflow-hidden z-20 ${
          variant === 'minimal' 
            ? 'h-9 rounded-xl hover:bg-[var(--vl-bg-elevated)] vl-transition-fast' 
            : 'flex-col sm:flex-row p-1.5 sm:p-0 rounded-2xl shadow-xl gap-2 sm:gap-0'
        }`}
      >
        <div className="flex w-full sm:flex-1 items-center">
          <Search className={`${variant === 'minimal' ? 'w-4 h-4 ml-3' : 'w-5 h-5 md:w-6 md:h-6 ml-3 md:ml-6'} text-[var(--vl-text-tertiary)] shrink-0`} />
          <input 
            type="text" 
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.length < 2) setShowDropdown(false);
            }}
            placeholder="Busca un creador, podcast o canal..." 
            className={`flex-1 bg-transparent text-[var(--vl-text-primary)] placeholder:text-[var(--vl-text-tertiary)] focus:outline-none min-w-0 ${
              variant === 'minimal' ? 'h-9 px-3 text-sm' : 'h-12 sm:h-14 md:h-16 px-3 md:px-6 text-base md:text-lg'
            }`}
          />
          {variant === 'minimal' && isSearching && (
            <Loader2 className="w-4 h-4 mr-3 vl-animate-spin text-[var(--vl-text-secondary)]" />
          )}
        </div>
        
        {variant !== 'minimal' && (
          <button 
            type="submit"
            disabled={isSearching}
            className="w-full sm:w-auto h-12 sm:h-14 md:h-16 px-6 md:px-8 bg-[var(--vl-red)] hover:bg-[var(--vl-red-hover)] text-white font-semibold text-base md:text-lg vl-transition-fast flex items-center justify-center gap-2 rounded-xl sm:rounded-none shrink-0 disabled:opacity-70"
          >
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Analizar'}
          </button>
        )}
      </form>

      {/* Dropdown Results */}
      {showDropdown && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--vl-bg-elevated)] border border-[var(--vl-border)] rounded-xl shadow-2xl z-30 max-h-[400px] overflow-y-auto vl-animate-slide-down">
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => handleSelect(result)}
              className="w-full text-left px-4 py-3 flex items-center gap-4 hover:bg-[var(--vl-bg-secondary)] vl-transition-fast border-b border-[var(--vl-border)] last:border-0"
            >
              {result.avatar_url ? (
                <img src={result.avatar_url} alt={result.display_name} className="w-10 h-10 rounded-full object-cover bg-[var(--vl-bg-secondary)]" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[var(--vl-bg-secondary)] flex items-center justify-center text-[var(--vl-text-tertiary)]">
                  <Search className="w-5 h-5" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[var(--vl-text-primary)] truncate">{result.display_name}</p>
                <div className="flex items-center gap-2 text-xs text-[var(--vl-text-secondary)]">
                  <span className="capitalize">{result.platform}</span>
                  <span>•</span>
                  <span>{new Intl.NumberFormat('es-ES', { notation: "compact", compactDisplay: "short" }).format(result.subscribers)} subs</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showDropdown && results.length === 0 && !isSearching && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--vl-bg-elevated)] border border-[var(--vl-border)] rounded-xl shadow-2xl z-30 p-4 text-center text-[var(--vl-text-secondary)] vl-animate-slide-down">
          No se encontraron resultados para &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}
