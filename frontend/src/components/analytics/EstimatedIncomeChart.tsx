'use client';

import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Landmark, TrendingUp } from 'lucide-react';

interface GrowthProps {
  views_30d: number;
}

interface VideoProps {
  published_at: string;
  views: number;
}

interface ChartProps {
  growth?: GrowthProps;
  recentVideos?: VideoProps[];
}

export function EstimatedIncomeChart({ growth, recentVideos = [] }: ChartProps) {
  const views30d = growth?.views_30d || 0;
  
  // RPM estimates (Revenue per mille)
  const RPM_LOW = 0.25;
  const RPM_HIGH = 4.00;
  const RPM_AVG = 1.50; // Used for charting

  // Calculate SocialBlade style ranges
  const monthlyLow = (views30d * RPM_LOW) / 1000;
  const monthlyHigh = (views30d * RPM_HIGH) / 1000;
  const yearlyLow = monthlyLow * 12;
  const yearlyHigh = monthlyHigh * 12;

  // Format currency
  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Generate 14-day realistic curve
  const chartData = useMemo(() => {
    const data = [];
    const today = new Date();
    
    // Base daily income from historical catalog (distribute 50% of monthly views across 30 days)
    const baseDailyViews = (views30d * 0.5) / 30;
    const baseDailyIncome = (baseDailyViews * RPM_AVG) / 1000;

    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // Check if any video was uploaded this day
      const videosToday = recentVideos.filter(v => v.published_at.startsWith(dateStr));
      const spikeViews = videosToday.reduce((acc, v) => acc + v.views, 0);
      
      // Assume a video gets 40% of its total views on day 1 (the spike)
      const spikeIncome = ((spikeViews * 0.4) * RPM_AVG) / 1000;

      // Use a deterministic pseudo-random value based on the day index to satisfy React purity rules
      const pseudoRandom = ((i * 17) % 100) / 100; // 0.0 to 0.99
      const randomNoise = baseDailyIncome * (0.85 + pseudoRandom * 0.3);
      
      const totalEstimated = randomNoise + spikeIncome;

      data.push({
        date: date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
        income: Math.round(totalEstimated)
      });
    }

    return data;
  }, [views30d, recentVideos]);

  // Premium area gradient colors
  const chartColor = 'var(--vl-success)';
  const gridColor = 'rgba(255,255,255,0.02)';
  const tickColor = '#667085';

  // Custom tooltips with glassmorphism styling
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0b0c10]/90 backdrop-blur-md border border-white/[0.08] rounded-xl px-3.5 py-2.5 shadow-2xl">
          <p className="text-[var(--vl-text-tertiary)] font-bold text-[9px] uppercase tracking-wider mb-0.5">{label}</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--vl-success)]" />
            <p className="text-sm font-black text-[var(--vl-text-primary)]">
              Estimado: <span className="text-[var(--vl-success)]">{formatMoney(payload[0].value)}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="vl-card-dashboard p-6 h-full flex flex-col border border-[var(--vl-border)] rounded-2xl bg-[var(--vl-bg-surface)]/60 backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className="text-lg font-bold text-[var(--vl-text-primary)]">Ingresos Estimados</h3>
          </div>
          <p className="text-xs text-[var(--vl-text-secondary)] font-medium">
            Basado en CPM de $0.25 - $4.00 y tráfico de 30 días
          </p>
        </div>
        
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[var(--vl-success-soft)] text-[var(--vl-success)] rounded-full text-xs font-bold border border-[var(--vl-success)]/20 shadow-sm animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--vl-success)]" />
          Monetización Activa
        </div>
      </div>

      {/* Grid: Left column (cards) & Right column (chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-stretch">
        
        {/* Left Column (Stacking Monthly/Yearly projections) */}
        <div className="grid grid-cols-2 lg:flex lg:flex-col gap-4">
          <div className="p-3 sm:p-4.5 rounded-xl bg-white/[0.01] border border-[var(--vl-border)]/55 hover:border-white/10 transition-all duration-300 flex-1 flex flex-col justify-center">
            <p className="text-[9px] sm:text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider mb-1">Ingreso Estimado Mensual</p>
            <p className="text-base sm:text-2xl font-black text-[var(--vl-text-primary)] tracking-tight">
              {formatMoney(monthlyLow)} <span className="text-[var(--vl-text-secondary)] font-medium text-xs sm:text-base mx-0.5 sm:mx-1">-</span> {formatMoney(monthlyHigh)}
            </p>
          </div>
          <div className="p-3 sm:p-4.5 rounded-xl bg-white/[0.01] border border-[var(--vl-border)]/55 hover:border-white/10 transition-all duration-300 flex-1 flex flex-col justify-center">
            <p className="text-[9px] sm:text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider mb-1">Ingreso Estimado Anual</p>
            <p className="text-base sm:text-2xl font-black text-[var(--vl-text-primary)] tracking-tight">
              {formatMoney(yearlyLow)} <span className="text-[var(--vl-text-secondary)] font-medium text-xs sm:text-base mx-0.5 sm:mx-1">-</span> {formatMoney(yearlyHigh)}
            </p>
          </div>
        </div>

        {/* Right Column (Area Chart) */}
        <div className="lg:col-span-2 flex flex-col min-h-[220px] sm:min-h-[250px]">
          <div className="flex items-center gap-1.5 mb-3">
            <TrendingUp className="w-4 h-4 text-[var(--vl-text-tertiary)]" />
            <h4 className="text-[10px] font-bold text-[var(--vl-text-tertiary)] uppercase tracking-wider">Proyección de Generación Diaria (Últimos 14 días)</h4>
          </div>
          <div className="flex-1 w-full min-h-[180px] sm:min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.18}/>
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={gridColor} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: tickColor, fontSize: 9, fontWeight: 600 }}
                  tickMargin={8}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: tickColor, fontSize: 9, fontWeight: 600 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  content={<CustomTooltip />} 
                  cursor={{ stroke: 'rgba(255, 255, 255, 0.08)', strokeWidth: 1, strokeDasharray: '3 3' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stroke={chartColor} 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorIncome)" 
                  dot={false}
                  activeDot={{ r: 4.5, fill: chartColor, stroke: '#06070A', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
