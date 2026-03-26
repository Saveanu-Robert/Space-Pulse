'use client';

import { useMemo } from 'react';
import type { NEOApproach } from '@/types/neos';
import { HazardBadge } from '@/components/shared/hazard-badge';
import { formatDate, formatDistance } from '@/lib/utils/format';
import { Trophy, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NeoRiskRankingProps {
  approaches: NEOApproach[];
  onSelect: (neo: NEOApproach) => void;
}

function riskScore(neo: NEOApproach): number {
  const proximityScore = Math.max(0, 100 - (neo.missDistanceLunar * 10));
  const speedScore = Math.min(neo.velocityKph / 2000, 30);
  const sizeScore = Math.min(neo.diameterMaxM / 5, 30);
  const hazardBonus = neo.hazardous ? 25 : 0;
  return Math.round(proximityScore + speedScore + sizeScore + hazardBonus);
}

function riskColor(score: number): string {
  if (score >= 80) return 'text-status-danger';
  if (score >= 50) return 'text-status-warning';
  if (score >= 25) return 'text-nebula-blue';
  return 'text-status-safe';
}

export function NeoRiskRanking({ approaches, onSelect }: NeoRiskRankingProps) {
  const ranked = useMemo(() => {
    return approaches
      .map((neo) => ({ ...neo, risk: riskScore(neo) }))
      .sort((a, b) => b.risk - a.risk)
      .slice(0, 8);
  }, [approaches]);

  if (ranked.length === 0) return null;

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-white/[0.06] p-4">
        <Trophy className="h-4 w-4 text-status-warning" />
        <h3 className="text-sm font-semibold text-white">Closest Encounters</h3>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {ranked.map((neo, i) => (
          <button
            key={`${neo.id}-${neo.closeApproachDate}`}
            onClick={() => onSelect(neo)}
            className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-white/[0.03]"
          >
            <span className={cn(
              'flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold',
              i === 0 ? 'bg-status-danger/20 text-status-danger' :
              i < 3 ? 'bg-status-warning/20 text-status-warning' :
              'bg-white/[0.06] text-muted-foreground'
            )}>
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-white truncate">{neo.name}</span>
                <HazardBadge hazardous={neo.hazardous} />
              </div>
              <p className="text-[10px] text-muted-foreground">
                {formatDate(neo.closeApproachDate)} &middot; {formatDistance(neo.missDistanceKm)}
              </p>
            </div>
            <div className={cn('text-sm font-bold tabular-nums', riskColor(neo.risk))}>
              {neo.risk}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
