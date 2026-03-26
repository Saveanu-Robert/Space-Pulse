'use client';

import { useState, useEffect } from 'react';
import { Satellite } from 'lucide-react';

interface ISSPosition {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export function ISSTracker() {
  const [position, setPosition] = useState<ISSPosition | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchPosition = async () => {
      try {
        const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) {
          setPosition({
            latitude: data.latitude,
            longitude: data.longitude,
            timestamp: data.timestamp,
          });
        }
      } catch { /* silently fail */ }
    };

    fetchPosition();
    const interval = setInterval(fetchPosition, 10000); // Update every 10s
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  if (!position) return null;

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Satellite className="h-4 w-4 text-nebula-cyan" />
        <h3 className="text-sm font-semibold text-white">ISS Live Position</h3>
        <span className="relative flex h-2 w-2 ml-auto">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-safe opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-status-safe" />
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] text-muted-foreground">Latitude</p>
          <p className="text-sm font-semibold text-white tabular-nums">{position.latitude.toFixed(4)}°</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground">Longitude</p>
          <p className="text-sm font-semibold text-white tabular-nums">{position.longitude.toFixed(4)}°</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className="h-1.5 flex-1 rounded-full bg-space-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-nebula-cyan transition-all duration-[10000ms] ease-linear"
            style={{ width: `${((position.longitude + 180) / 360) * 100}%` }}
          />
        </div>
        <span className="text-[9px] text-muted-foreground">Orbit</span>
      </div>
    </div>
  );
}
