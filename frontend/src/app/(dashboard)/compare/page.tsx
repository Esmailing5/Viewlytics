'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GitCompareArrows, Sparkles } from 'lucide-react';
import { ChannelSlot } from '@/components/compare/ChannelSlot';
import { ComparisonTable } from '@/components/compare/ComparisonTable';
import type { ChannelData } from '@/components/compare/ChannelSlot';

/* ── Map raw API response to ChannelData ── */
function mapApiToChannelData(json: Record<string, unknown>): ChannelData {
  const profile = json.profile as Record<string, unknown> | undefined;
  const metrics = json.metrics as Record<string, unknown> | undefined;
  const growth  = json.growth  as Record<string, unknown> | undefined;

  return {
    displayName:     (profile?.display_name as string) || 'Canal',
    avatarUrl:       (profile?.avatar_url as string) || '',
    subscribers:     (profile?.subscribers as number) || 0,
    totalViews:      (metrics?.total_views as number) || 0,
    totalVideos:     (metrics?.total_videos as number) || 0,
    views30d:        (growth?.views_30d as number) || 0,
    shorts_views_30d:(growth?.shorts_views_30d as number) || 0,
    total_views_30d: (growth?.total_views_30d as number) || 0,
    videos_30d:      (growth?.videos_30d as number) || 0,
    shorts_count_30d:(growth?.shorts_count_30d as number) || 0,
    engagement_rate: (metrics?.engagement_rate as number) || 0,
    average_views:   (metrics?.average_views as number) || 0,
  };
}

/* ════════════════════════════════════════════════════════════════════════════
 * ComparePageContent — Inner component that uses useSearchParams
 * ════════════════════════════════════════════════════════════════════════════ */
function ComparePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ── State per slot ── */
  const [slugA, setSlugA] = useState<string | null>(null);
  const [slugB, setSlugB] = useState<string | null>(null);
  const [channelA, setChannelA] = useState<ChannelData | null>(null);
  const [channelB, setChannelB] = useState<ChannelData | null>(null);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);

  /* ── URL sync: update URL when slugs change ── */
  const syncUrl = useCallback(
    (a: string | null, b: string | null) => {
      const params = new URLSearchParams();
      if (a) params.set('a', a);
      if (b) params.set('b', b);
      const qs = params.toString();
      router.replace(`/compare${qs ? `?${qs}` : ''}`, { scroll: false });
    },
    [router],
  );

  /* ── Fetch channel data helper ── */
  const fetchChannel = useCallback(async (slug: string): Promise<ChannelData | null> => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/channel/youtube/${slug}`);
      if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
      const json = await res.json();
      return mapApiToChannelData(json);
    } catch (err) {
      console.error(`[Compare] Error fetching channel "${slug}":`, err);
      return null;
    }
  }, []);

  /* ── Load from URL params on mount ── */
  useEffect(() => {
    const paramA = searchParams.get('a');
    const paramB = searchParams.get('b');

    if (paramA && paramA !== slugA) {
      setSlugA(paramA);
      setLoadingA(true);
      fetchChannel(paramA).then((data) => {
        setChannelA(data);
        setLoadingA(false);
      });
    }
    if (paramB && paramB !== slugB) {
      setSlugB(paramB);
      setLoadingB(true);
      fetchChannel(paramB).then((data) => {
        setChannelB(data);
        setLoadingB(false);
      });
    }
    // Only run on mount / when searchParams change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  /* ── Handlers ── */
  const handleSelectA = (slug: string) => {
    setSlugA(slug);
    setLoadingA(true);
    syncUrl(slug, slugB);
    fetchChannel(slug).then((data) => {
      setChannelA(data);
      setLoadingA(false);
    });
  };

  const handleSelectB = (slug: string) => {
    setSlugB(slug);
    setLoadingB(true);
    syncUrl(slugA, slug);
    fetchChannel(slug).then((data) => {
      setChannelB(data);
      setLoadingB(false);
    });
  };

  const handleClearA = () => {
    setSlugA(null);
    setChannelA(null);
    syncUrl(null, slugB);
  };

  const handleClearB = () => {
    setSlugB(null);
    setChannelB(null);
    syncUrl(slugA, null);
  };

  const bothLoaded = channelA !== null && channelB !== null;

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 px-4 sm:px-6 pb-12">
      {/* ── Page Header ── */}
      <div className="pt-2">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--vl-cyan-soft)] border border-[var(--vl-cyan)]/20 text-[10px] font-bold uppercase tracking-widest text-[var(--vl-cyan)]">
            <Sparkles className="w-3 h-3" />
            Análisis Comparativo
          </span>
        </div>
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--vl-text-primary)] tracking-tight">
          Comparar Canales
        </h1>
        {/* Description */}
        <p className="text-[var(--vl-text-secondary)] mt-2 text-sm sm:text-base font-medium max-w-xl">
          Compara el rendimiento de dos canales dominicanos lado a lado
        </p>
      </div>

      {/* ── Two-Column Slots ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <ChannelSlot
          label="Canal A"
          channelData={channelA}
          loading={loadingA}
          onSelect={handleSelectA}
          onClear={handleClearA}
        />

        <ChannelSlot
          label="Canal B"
          channelData={channelB}
          loading={loadingB}
          onSelect={handleSelectB}
          onClear={handleClearB}
        />
      </div>

      {/* ── VS Divider between slots ── */}
      {(channelA || channelB) && (
        <div className="flex items-center justify-center -mt-4 -mb-4">
          <div className="w-12 h-12 rounded-full bg-[var(--vl-bg-elevated)] border border-[var(--vl-border)] flex items-center justify-center shadow-lg">
            <GitCompareArrows className="w-5 h-5 text-[var(--vl-cyan)]" />
          </div>
        </div>
      )}

      {/* ── Comparison Table ── */}
      {bothLoaded && (
        <ComparisonTable channelA={channelA} channelB={channelB} />
      )}

      {/* ── Empty state hint ── */}
      {!bothLoaded && !loadingA && !loadingB && (
        <div className="text-center py-8 opacity-50">
          <p className="text-sm text-[var(--vl-text-tertiary)] font-medium">
            {!channelA && !channelB
              ? 'Selecciona dos canales para comenzar la comparación'
              : 'Selecciona el segundo canal para ver la comparación'}
          </p>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
 * ComparePage — Wraps content in Suspense for useSearchParams
 * ════════════════════════════════════════════════════════════════════════════ */
export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <div className="w-10 h-10 rounded-full border-4 border-[var(--vl-cyan)] border-t-transparent animate-spin" />
        </div>
      }
    >
      <ComparePageContent />
    </Suspense>
  );
}
