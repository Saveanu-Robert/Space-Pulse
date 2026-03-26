'use client';

import { useMemo } from 'react';
import type { SpaceWeatherSummary } from '@/types/space-weather';
import { cn } from '@/lib/utils';
import { Shield } from 'lucide-react';

interface SeverityMeterProps {
  data: SpaceWeatherSummary;
}

type ThreatLevel = 'quiet' | 'minor' | 'moderate' | 'severe' | 'extreme';

const levels: { level: ThreatLevel; label: string; color: string; min: number }[] = [
  { level: 'quiet', label: 'Quiet', color: 'text-status-safe', min: 0 },
  { level: 'minor', label: 'Minor', color: 'text-nebula-cyan', min: 15 },
  { level: 'moderate', label: 'Moderate', color: 'text-nebula-blue', min: 35 },
  { level: 'severe', label: 'Severe', color: 'text-status-warning', min: 60 },
  { level: 'extreme', label: 'Extreme', color: 'text-status-danger', min: 80 },
];

function calculateThreatScore(data: SpaceWeatherSummary): number {
  // Score based on LAST 48 HOURS only — regardless of the selected time window.
  // The time window affects the timeline/chart, but threat level = current conditions.
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  const recent = data.timeline.filter(t => {
    try { return new Date(t.date).getTime() >= cutoff; } catch { return false; }
  });

  let score = 0;

  // Geomagnetic storms are the most impactful (affects power grids, satellites)
  const recentStorms = recent.filter(t => t.type === 'GST').length;
  score += recentStorms * 25;

  // Extreme-severity events (X-class flares, CMEs >1000 km/s)
  const extremeRecent = recent.filter(t => t.severity === 'extreme').length;
  score += extremeRecent * 18;

  // High-severity events
  const highRecent = recent.filter(t => t.severity === 'high').length;
  score += Math.min(highRecent * 5, 15);

  // Moderate events add a baseline signal
  const moderateRecent = recent.filter(t => t.severity === 'moderate').length;
  score += Math.min(moderateRecent * 1, 8);

  // Recent flares indicate an active sun
  const recentFlares = recent.filter(t => t.type === 'FLR').length;
  score += Math.min(recentFlares * 4, 12);

  return Math.min(Math.round(score), 100);
}

export function SeverityMeter({ data }: SeverityMeterProps) {
  const score = useMemo(() => calculateThreatScore(data), [data]);
  const current = levels.reduce((acc, l) => (score >= l.min ? l : acc), levels[0]);

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield className={cn('h-5 w-5', current.color)} />
          <h3 className="text-sm font-semibold text-white">Solar Activity</h3>
        </div>
        <span className="text-[9px] text-muted-foreground">Last 48h</span>
      </div>

      <div className="text-center mb-3">
        <span className={cn('text-2xl font-bold', current.color)}>{current.label}</span>
        <p className="text-[10px] text-muted-foreground mt-0.5">{score}/100</p>
      </div>

      <div className="relative h-2.5 rounded-full bg-space-800 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${Math.min(score, 100)}%`,
            background: 'linear-gradient(90deg, #22C55E 0%, #06B6D4 25%, #3B82F6 45%, #F59E0B 70%, #EF4444 100%)',
          }}
        />
        {levels.slice(1).map((l) => (
          <div key={l.level} className="absolute top-0 bottom-0 w-px bg-white/10" style={{ left: `${l.min}%` }} />
        ))}
      </div>

      <div className="flex justify-between mt-1">
        {levels.map((l) => (
          <span key={l.level} className={cn('text-[8px]', current.level === l.level ? l.color + ' font-semibold' : 'text-muted-foreground/40')}>
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}
