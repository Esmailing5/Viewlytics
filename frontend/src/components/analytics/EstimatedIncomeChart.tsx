'use client';

import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign } from 'lucide-react';

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

  return (
    <div className="dashboard-card p-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h3 className="text-xl font-bold text-[var(--text-primary)]">Ingresos Estimados</h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Basado en CPM de $0.25 - $4.00 y tráfico de 30 días
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl font-semibold">
          <DollarSign className="w-5 h-5" /> Monetización Activa
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)]">
          <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">Ingreso Estimado Mensual</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--text-primary)] break-words">
            {formatMoney(monthlyLow)} <span className="text-[var(--text-secondary)] font-normal text-lg mx-1">-</span> {formatMoney(monthlyHigh)}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)]">
          <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">Ingreso Estimado Anual</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--text-primary)] break-words">
            {formatMoney(yearlyLow)} <span className="text-[var(--text-secondary)] font-normal text-lg mx-1">-</span> {formatMoney(yearlyHigh)}
          </p>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[250px]">
        <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-4">Proyección de Generación Diaria (Últimos 14 días)</h4>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-color)',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
              itemStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
              formatter={(value: number) => [`$${value}`, 'Ingreso Diario']}
              labelStyle={{ color: 'var(--text-secondary)', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="income" 
              stroke="#10b981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorIncome)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
