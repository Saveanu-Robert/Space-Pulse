'use client';

import { useDashboardOverview } from '@/hooks/use-dashboard-overview';
import { formatRelativeTime } from '@/lib/utils/format';
import { Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SourceStatus } from '@/types/common';

const statusIcon = {
  ok: CheckCircle,
  stale: AlertCircle,
  error: XCircle,
  unavailable: XCircle,
};

const statusColor = {
  ok: 'text-status-safe',
  stale: 'text-status-warning',
  error: 'text-status-danger',
  unavailable: 'text-muted-foreground/40',
};

export function DataFreshness() {
  const { data: response } = useDashboardOverview();
  if (!response?.data) return null;

  const sources = [
    { name: 'APOD', ...response.data.apod.metadata },
    { name: 'Space Weather', ...response.data.spaceWeather.metadata },
    { name: 'Near-Earth Objects', ...response.data.neos.metadata },
    { name: 'Earth Events', ...response.data.earthEvents.metadata },
  ];

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-white">Data Sources</h3>
      </div>
      <div className="space-y-2">
        {sources.map((s) => {
          const Icon = statusIcon[s.sourceStatus as SourceStatus] ?? CheckCircle;
          return (
            <div key={s.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className={cn('h-3.5 w-3.5', statusColor[s.sourceStatus as SourceStatus])} />
                <span className="text-xs text-white">{s.name}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">{formatRelativeTime(s.fetchedAt)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
