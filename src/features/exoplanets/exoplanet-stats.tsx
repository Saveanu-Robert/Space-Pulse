'use client';

import { useState, useEffect } from 'react';
import { StatCard } from '@/components/shared/stat-card';
import { Globe, Star, Orbit, Sun } from 'lucide-react';

interface ExoplanetData {
  totalConfirmed: number;
  habitableZone: number;
  recentYear: number;
  recentCount: number;
}

export function ExoplanetStats() {
  const [data, setData] = useState<ExoplanetData | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/exoplanets');
        if (!res.ok) return;
        const json = await res.json();
        if (mounted && json.success && json.data) setData(json.data);
      } catch { /* ignore */ }
    })();
    return () => { mounted = false; };
  }, []);

  if (!data) return null;

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Orbit className="h-4 w-4 text-nebula-violet" />
        <h3 className="text-sm font-semibold text-white">Exoplanet Census</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-white/[0.06] p-3 bg-white/[0.02]">
          <Globe className="h-3.5 w-3.5 text-nebula-blue mb-1" />
          <p className="text-lg font-bold text-white tabular-nums">{data.totalConfirmed.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">Confirmed Planets</p>
        </div>
        <div className="rounded-lg border border-white/[0.06] p-3 bg-white/[0.02]">
          <Star className="h-3.5 w-3.5 text-status-warning mb-1" />
          <p className="text-lg font-bold text-white tabular-nums">{data.habitableZone.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">Habitable Zone</p>
        </div>
      </div>
    </div>
  );
}
