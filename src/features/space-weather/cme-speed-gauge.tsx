'use client';

import { useMemo } from 'react';
import type { TimelineItem } from '@/types/space-weather';
import { cn } from '@/lib/utils';
import { Gauge } from 'lucide-react';

interface CmeSpeedGaugeProps {
  timeline: TimelineItem[];
}

export function CmeSpeedGauge({ timeline }: CmeSpeedGaugeProps) {
  const maxSpeed = useMemo(() => {
    let max = 0;
    for (const item of timeline) {
      if (item.type === 'CME') {
        const match = item.title.match(/\((\d+)\s*km\/s\)/);
        if (match) max = Math.max(max, parseInt(match[1], 10));
      }
    }
    return max;
  }, [timeline]);

  const pct = maxSpeed > 0 ? Math.min((maxSpeed / 2500) * 100, 100) : 0;
  const label = maxSpeed === 0 ? 'No Data' : maxSpeed >= 2000 ? 'Extreme' : maxSpeed >= 1000 ? 'Fast' : maxSpeed >= 500 ? 'Moderate' : 'Slow';
  const color = maxSpeed === 0 ? 'text-muted-foreground' : maxSpeed >= 2000 ? 'text-status-danger' : maxSpeed >= 1000 ? 'text-status-warning' : maxSpeed >= 500 ? 'text-nebula-blue' : 'text-status-safe';

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Gauge className={cn('h-4 w-4', color)} />
        <h3 className="text-sm font-semibold text-white">Peak CME Speed</h3>
      </div>
      <div className="text-center mb-2">
        <span className={cn('text-3xl font-bold tabular-nums', color)}>{maxSpeed}</span>
        <span className="text-sm text-muted-foreground ml-1">km/s</span>
      </div>
      <div className="relative h-2.5 rounded-full bg-space-800 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, #22C55E 0%, #3B82F6 30%, #F59E0B 60%, #EF4444 100%)`,
          }}
        />
      </div>
      <div className="flex justify-between mt-1 text-[9px] text-muted-foreground">
        <span>0</span>
        <span>500 (Moderate)</span>
        <span>1000 (Fast)</span>
        <span>2500</span>
      </div>
      <p className={cn('text-center text-xs font-medium mt-2', color)}>{label}</p>
    </div>
  );
}
