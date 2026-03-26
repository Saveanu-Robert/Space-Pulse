'use client';

import type { SpaceWeatherSummary } from '@/types/space-weather';
import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuroraIndicatorProps {
  data: SpaceWeatherSummary;
}

export function AuroraIndicator({ data }: AuroraIndicatorProps) {
  const { kpMax, visibleAt, probability } = useMemo(() => {
    let kpMax = 0;
    for (const item of data.timeline) {
      if (item.type === 'GST') {
        const match = item.title.match(/Kp\s*(\d+)/);
        if (match) kpMax = Math.max(kpMax, parseInt(match[1], 10));
      }
    }

    const visibleAt = kpMax >= 9 ? '40°N (New York, Madrid)' :
                      kpMax >= 7 ? '50°N (London, Prague)' :
                      kpMax >= 5 ? '60°N (Oslo, Helsinki)' :
                      kpMax >= 3 ? '65°N (Iceland, N. Scandinavia)' : 'Polar regions only';

    const probability = kpMax >= 7 ? 'High' : kpMax >= 5 ? 'Moderate' : kpMax >= 3 ? 'Low' : 'Very Low';

    return { kpMax, visibleAt, probability };
  }, [data]);

  const color = kpMax >= 7 ? 'text-status-safe' : kpMax >= 5 ? 'text-nebula-cyan' : 'text-muted-foreground';

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className={cn('h-4 w-4', color)} />
        <h3 className="text-sm font-semibold text-white">Aurora Probability</h3>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Current Kp index</span>
          <span className={cn('text-sm font-bold', color)}>{kpMax > 0 ? kpMax : '—'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Probability</span>
          <span className={cn('text-xs font-medium', color)}>{probability}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Visible at</span>
          <span className="text-xs text-white/70">{visibleAt}</span>
        </div>
      </div>
    </div>
  );
}
