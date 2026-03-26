'use client';

import { useDashboardOverview } from '@/hooks/use-dashboard-overview';
import { Sun, Activity, Globe, Crosshair, ShieldAlert, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SourceStatus } from '@/types/common';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const statusColors: Record<SourceStatus, string> = {
  ok: 'bg-status-safe',
  stale: 'bg-status-warning',
  error: 'bg-status-danger',
  unavailable: 'bg-muted-foreground/40',
};

const statusLabels: Record<SourceStatus, string> = {
  ok: 'Live',
  stale: 'Cached',
  error: 'Degraded',
  unavailable: 'Offline',
};

interface StatusItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  status: SourceStatus;
}

function StatusItem({ icon: Icon, label, value, status }: StatusItemProps) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="flex items-center gap-2 px-3 py-2 sm:px-4">
          <div className={cn('h-1.5 w-1.5 rounded-full shrink-0', statusColors[status])} />
          <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0 hidden sm:block" />
          <span className="text-[11px] text-muted-foreground hidden md:inline">{label}</span>
          <span className="text-xs font-semibold text-white tabular-nums">{value}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {label}: {value} &mdash; {statusLabels[status]}
      </TooltipContent>
    </Tooltip>
  );
}

export function StatusBar() {
  const { data: response, isLoading } = useDashboardOverview();

  if (isLoading || !response?.data) {
    return <div className="glass-card h-10 shimmer-bg rounded-xl" />;
  }

  const { spaceWeather, neos, earthEvents } = response.data;
  const sw = spaceWeather.data;
  const neo = neos.data;
  const ev = earthEvents.data;

  // Count how many sources are healthy (exclude APOD since it's visual-only, not a metric source)
  const metricSources = [spaceWeather, neos, earthEvents];
  const healthyCount = metricSources.filter(s => s.metadata.sourceStatus === 'ok').length;
  const totalSources = metricSources.length;

  return (
    <div className="glass-card">
      <div className="flex flex-wrap items-center divide-x divide-white/[0.06]">
        <StatusItem
          icon={Activity}
          label="Active Storms"
          value={String(sw?.counts.geomagneticStorms ?? 0)}
          status={spaceWeather.metadata.sourceStatus}
        />
        <StatusItem
          icon={Sun}
          label="Flares & CMEs"
          value={String((sw?.counts.flares ?? 0) + (sw?.counts.cmes ?? 0))}
          status={spaceWeather.metadata.sourceStatus}
        />
        <StatusItem
          icon={ShieldAlert}
          label="Hazardous NEOs"
          value={String(neo?.hazardousCount ?? 0)}
          status={neos.metadata.sourceStatus}
        />
        <StatusItem
          icon={Globe}
          label="Earth Events"
          value={String(ev?.totalOpenEvents ?? 0)}
          status={earthEvents.metadata.sourceStatus}
        />
        <StatusItem
          icon={Crosshair}
          label="Tracked Objects"
          value={String(neo?.totalUpcoming ?? 0)}
          status={neos.metadata.sourceStatus}
        />

        {/* System health indicator */}
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-2 px-3 py-2 sm:px-4 ml-auto">
              <Database className="h-3 w-3 text-muted-foreground/60" />
              <span className="text-[10px] text-muted-foreground hidden sm:inline">
                {healthyCount}/{totalSources} sources
              </span>
              <div className={cn(
                'h-2 w-2 rounded-full',
                healthyCount === totalSources ? 'bg-status-safe' :
                healthyCount > 0 ? 'bg-status-warning' : 'bg-status-danger'
              )} />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            <div className="space-y-1">
              <p className="font-medium">Data Source Health</p>
              <p>DONKI: {statusLabels[spaceWeather.metadata.sourceStatus]}</p>
              <p>NeoWs: {statusLabels[neos.metadata.sourceStatus]}</p>
              <p>EONET: {statusLabels[earthEvents.metadata.sourceStatus]}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
