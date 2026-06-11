'use client';

import { useEffect, useState } from 'react';
import {
  TrendingUp,
  Calendar,
  BarChart3,
  AlertTriangle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ReferenceLine,
  ComposedChart,
} from 'recharts';

/* ── Types matching backend ProjectionResult ── */
interface ProjectionPoint {
  daysFromNow: number;
  date: string;
  subscribers: number;
  totalViews: number;
}

interface ProjectionResult {
  creatorId: string;
  currentSubscribers: number;
  currentTotalViews: number;
  confidence: number;
  dataPoints: number;
  historical: ProjectionPoint[];
  projected: ProjectionPoint[];
  subscribersGrowthRate: number;
  viewsGrowthRate: number;
}

interface ProjectionPanelProps {
  creatorId: string;
  isOpen: boolean;
}

/* ── Helpers ── */
function formatSubs(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDateShort(isoDate: string): string {
  const datePart = isoDate.split('T')[0];
  const [year, month, day] = datePart.split('-');
  return `${day}/${month}`;
}

function formatDateFull(isoDate: string): string {
  const datePart = isoDate.split('T')[0];
  const [year, month, day] = datePart.split('-');
  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
  ];
  return `${day} ${months[parseInt(month, 10) - 1]} ${year}`;
}

function getConfidenceColor(confidence: number): {
  bg: string;
  text: string;
  border: string;
  label: string;
} {
  if (confidence >= 70) {
    return {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/20',
      label: 'Alta',
    };
  }
  if (confidence >= 40) {
    return {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/20',
      label: 'Media',
    };
  }
  return {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/20',
    label: 'Baja',
  };
}

/* ── Skeleton ── */
function ProjectionSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-5 w-48 bg-[var(--vl-border)] rounded" />
        <div className="h-5 w-28 bg-[var(--vl-border)] rounded" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-[var(--vl-border)]/50 rounded-xl" />
        ))}
      </div>
      <div className="h-[280px] bg-[var(--vl-border)]/30 rounded-xl" />
    </div>
  );
}

/* ── Projection Card ── */
function ProjectionCard({
  label,
  date,
  subscribers,
  delta,
}: {
  label: string;
  date: string;
  subscribers: number;
  delta: number;
}) {
  return (
    <div className="vl-metric-card-interactive border border-[var(--vl-border)]/55 bg-[var(--vl-bg-surface)]/40 backdrop-blur-md flex-col !items-start !gap-2">
      <p className="vl-metric-label">{label}</p>
      <p className="text-lg sm:text-xl font-black text-[var(--vl-text-primary)] tracking-tight leading-none mt-1">
        {formatSubs(subscribers)}
      </p>
      <p className="text-[10px] text-[var(--vl-text-tertiary)] font-semibold">
        {formatDateFull(date)}
      </p>
      <div className="flex items-center gap-1 mt-1">
        <TrendingUp className="w-3 h-3 text-[var(--vl-cyan)]" />
        <span className="text-[10px] font-bold text-[var(--vl-cyan)]">
          +{formatSubs(delta)} vs hoy
        </span>
      </div>
    </div>
  );
}

/* ── Custom Tooltip ── */
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;

  const historicalVal = payload.find(
    (p: { dataKey: string }) => p.dataKey === 'historical'
  );
  const projectedVal = payload.find(
    (p: { dataKey: string }) => p.dataKey === 'projected'
  );
  const value = historicalVal?.value ?? projectedVal?.value;
  const isProjected = !historicalVal?.value && !!projectedVal?.value;

  return (
    <div className="bg-[#0b0c10]/90 backdrop-blur-md border border-white/[0.08] rounded-xl px-3.5 py-2.5 shadow-2xl">
      <p className="text-gray-400 font-bold text-[9px] uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <p className="font-extrabold text-white text-sm tracking-tight">
        Subs:{' '}
        <span className={isProjected ? 'text-cyan-400/70' : 'text-cyan-400'}>
          {value != null ? formatSubs(value) : '—'}
        </span>
      </p>
      {isProjected && (
        <p className="text-[9px] text-gray-500 font-semibold mt-0.5 italic">
          Proyectado
        </p>
      )}
    </div>
  );
}

/* ── Main Component ── */
export function ProjectionPanel({ creatorId, isOpen }: ProjectionPanelProps) {
  const [data, setData] = useState<ProjectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when panel is closed
      return;
    }

    let cancelled = false;

    const attemptFetch = async (): Promise<ProjectionResult | null> => {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const url = `${apiUrl}/api/projection/${creatorId}`;
      console.log('PROJECTION_SLUG:', creatorId);

      for (let attempt = 0; attempt < 2; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000);

        let response: Response;
        try {
          response = await fetch(url, { signal: controller.signal });
          clearTimeout(timeoutId);
        } catch {
          // Error de red o timeout (AbortError)
          clearTimeout(timeoutId);
          if (attempt < 1 && !cancelled) {
            await new Promise((r) => setTimeout(r, 3000));
            continue; // reintentar
          }
          throw new Error('fetch_failed');
        }

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          if (
            body.message === 'Historial insuficiente para proyectar' ||
            response.status === 400
          ) {
            throw new Error('insufficient_history');
          }
          if (attempt < 1 && !cancelled) {
            await new Promise((r) => setTimeout(r, 3000));
            continue; // reintentar errores 5xx
          }
          throw new Error('fetch_failed');
        }

        return await response.json();
      }
      throw new Error('fetch_failed');
    };

    const fetchProjection = async () => {
      setLoading(true);
      setError(null);
      try {
        const json = await attemptFetch();
        if (!cancelled && json) setData(json);
      } catch (err) {
        if (!cancelled) {
          setError(
            (err as Error).message === 'insufficient_history'
              ? 'insufficient_history'
              : 'fetch_failed'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProjection();
    return () => {
      cancelled = true;
    };
  }, [isOpen, creatorId]);

  if (!isOpen) return null;

  /* ── Error states ── */
  if (error === 'insufficient_history') {
    return (
      <div
        className="border border-amber-500/20 bg-amber-500/5 rounded-2xl p-5 sm:p-6 backdrop-blur-md"
        style={{ animation: 'vl-projection-fade-in 0.35s ease-out' }}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-400">
              Historial insuficiente
            </h3>
            <p className="text-xs text-[var(--vl-text-secondary)] mt-1 leading-relaxed">
              Se necesitan al menos 3 días de historial para generar una
              proyección. El sistema recolecta snapshots automáticamente cada
              día.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error === 'fetch_failed') {
    return (
      <div
        className="border border-red-500/20 bg-red-500/5 rounded-2xl p-5 sm:p-6 backdrop-blur-md"
        style={{ animation: 'vl-projection-fade-in 0.35s ease-out' }}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-red-400">
              Error al cargar proyección
            </h3>
            <p className="text-xs text-[var(--vl-text-secondary)] mt-1">
              No se pudo obtener la proyección en este momento. Intenta de
              nuevo más tarde.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div
        className="border border-[var(--vl-border)] bg-[var(--vl-bg-secondary)] rounded-2xl p-5 sm:p-6 backdrop-blur-md"
        style={{ animation: 'vl-projection-fade-in 0.35s ease-out' }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-[var(--vl-text-primary)]">Calculando proyección...</p>
            <p className="text-[10px] text-[var(--vl-text-tertiary)] font-semibold mt-0.5">
              Analizando historial y aplicando regresión lineal
            </p>
          </div>
          <span className="ml-auto inline-flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
        </div>
        <ProjectionSkeleton />
      </div>
    );
  }

  /* ── Build chart data ── */
  const confidenceStyle = getConfidenceColor(data.confidence);

  // Historical points with the 'historical' key
  const chartHistorical = data.historical.map((p) => ({
    date: formatDateShort(p.date),
    historical: p.subscribers,
    projected: null as number | null,
  }));

  // The bridge point: last historical is also first projected
  const lastHistorical = data.historical[data.historical.length - 1];

  // Projected points with the 'projected' key
  const chartProjected = data.projected.map((p) => ({
    date: formatDateShort(p.date),
    historical: null as number | null,
    projected: p.subscribers,
  }));

  // Bridge: the last historical point also has projected value to connect the lines
  const bridgePoint = {
    date: formatDateShort(lastHistorical.date),
    historical: lastHistorical.subscribers,
    projected: lastHistorical.subscribers,
  };

  // Replace last historical with bridge, then append projected
  const chartData = [
    ...chartHistorical.slice(0, -1),
    bridgePoint,
    ...chartProjected,
  ];

  // Y-axis domain
  const allValues = [
    ...data.historical.map((p) => p.subscribers),
    ...data.projected.map((p) => p.subscribers),
  ];
  const yMin = Math.min(...allValues);
  const yMax = Math.max(...allValues);
  const yPadding = (yMax - yMin) * 0.1 || yMax * 0.02;

  return (
    <div
      className="border border-[var(--vl-border)] bg-[var(--vl-bg-secondary)] rounded-2xl p-5 sm:p-6 backdrop-blur-md"
      style={{ animation: 'vl-projection-fade-in 0.35s ease-out' }}
    >
      {/* ── Panel Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-[var(--vl-text-primary)] tracking-tight">
              Proyección de Crecimiento
            </h3>
            <p className="text-[10px] sm:text-xs text-[var(--vl-text-tertiary)] font-semibold mt-0.5">
              Basado en {data.dataPoints} snapshots históricos
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${confidenceStyle.bg} ${confidenceStyle.text} ${confidenceStyle.border} whitespace-nowrap`}
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                data.confidence >= 70
                  ? 'bg-emerald-400'
                  : data.confidence >= 40
                    ? 'bg-amber-400'
                    : 'bg-red-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                data.confidence >= 70
                  ? 'bg-emerald-400'
                  : data.confidence >= 40
                    ? 'bg-amber-400'
                    : 'bg-red-400'
              }`}
            />
          </span>
          {Math.round(data.confidence)}% de confianza
        </span>
      </div>

      {/* ── Projection Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {data.projected.map((p, i) => (
          <ProjectionCard
            key={p.daysFromNow}
            label={`En ${p.daysFromNow} días`}
            date={p.date}
            subscribers={p.subscribers}
            delta={p.subscribers - data.currentSubscribers}
          />
        ))}
      </div>

      {/* ── Chart ── */}
      <div className="bg-[var(--vl-bg-surface)]/40 border border-[var(--vl-border)]/50 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-3 text-[10px] font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-[2px] bg-cyan-400 rounded-full" />
            <span className="text-[var(--vl-text-tertiary)]">Histórico</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-[2px] bg-cyan-400/40 rounded-full border-t border-dashed border-cyan-400/60" />
            <span className="text-[var(--vl-text-tertiary)]">Proyectado</span>
          </div>
        </div>

        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="projAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--vl-cyan)" stopOpacity={0.08} />
                  <stop offset="95%" stopColor="var(--vl-cyan)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke="rgba(255,255,255,0.02)"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#667085', fontSize: 9, fontWeight: 600 }}
              />
              <YAxis
                domain={[yMin - yPadding, yMax + yPadding]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#667085', fontSize: 9, fontWeight: 600 }}
                tickFormatter={(val: number) => formatSubs(val)}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{
                  stroke: 'rgba(255, 255, 255, 0.08)',
                  strokeWidth: 1,
                  strokeDasharray: '3 3',
                }}
              />

              {/* Projected area fill */}
              <Area
                type="monotone"
                dataKey="projected"
                stroke="none"
                fill="url(#projAreaGradient)"
                fillOpacity={1}
                connectNulls={false}
              />

              {/* Historical solid line */}
              <Line
                type="monotone"
                dataKey="historical"
                stroke="var(--vl-cyan)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 4.5,
                  fill: 'var(--vl-cyan)',
                  stroke: '#06070A',
                  strokeWidth: 2,
                }}
                connectNulls={false}
              />

              {/* Projected dashed line */}
              <Line
                type="monotone"
                dataKey="projected"
                stroke="var(--vl-cyan)"
                strokeWidth={2}
                strokeDasharray="6 4"
                strokeOpacity={0.45}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: 'var(--vl-cyan)',
                  fillOpacity: 0.5,
                  stroke: '#06070A',
                  strokeWidth: 2,
                }}
                connectNulls={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Growth Rates Summary ── */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 pl-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[var(--vl-text-secondary)]">Suscriptores/día:</span>
          <span className="text-[var(--vl-text-primary)] font-bold">
            +{formatSubs(data.subscribersGrowthRate)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-[var(--vl-text-secondary)]">Vistas/día:</span>
          <span className="text-[var(--vl-text-primary)] font-bold">
            +{formatSubs(data.viewsGrowthRate)}
          </span>
        </div>
      </div>

      {/* ── Disclaimer ── */}
      <p className="text-[10px] text-[var(--vl-text-tertiary)] mt-4 leading-relaxed font-medium opacity-60">
        Las proyecciones se basan en regresión lineal del historial disponible y
        pueden variar según la actividad del canal.
      </p>
    </div>
  );
}
