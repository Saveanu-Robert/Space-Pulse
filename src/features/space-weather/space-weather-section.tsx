'use client';

import { useState } from 'react';
import { useSpaceWeather } from '@/hooks/use-space-weather';
import { SectionContainer } from '@/components/layout/section-container';
import { SectionHeader } from '@/components/shared/section-header';
import { RefreshButton } from '@/components/shared/refresh-button';
import { StaleIndicator } from '@/components/shared/stale-indicator';
import { ErrorState } from '@/components/states/error-state';
import { EmptyState } from '@/components/states/empty-state';
import { CardListSkeleton, ChartSkeleton } from '@/components/states/loading-skeleton';
import { SpaceWeatherChart } from '@/components/charts/space-weather-chart';
import { SeverityBadge } from '@/components/shared/severity-badge';
import { TimeWindowSelector } from '@/components/shared/time-window-selector';
import { queryKeys } from '@/lib/query/query-keys';
import { formatDateTime } from '@/lib/utils/format';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { NotificationFeed } from './notification-feed';
import { SeverityMeter } from './severity-meter';
import { CmeSpeedGauge } from './cme-speed-gauge';
import { AuroraIndicator } from './aurora-indicator';
import { ForecastPanel } from './forecast-panel';
import { EventChain } from './event-chain';
import { CloudOff, Sun, Zap, Activity } from 'lucide-react';
import type { TimelineItem } from '@/types/space-weather';

const typeConfig = {
  FLR: { icon: Sun, label: 'Solar Flare', color: 'bg-status-warning/10 text-status-warning border-status-warning/20' },
  CME: { icon: Zap, label: 'CME', color: 'bg-nebula-violet/10 text-nebula-violet border-nebula-violet/20' },
  GST: { icon: Activity, label: 'Geo. Storm', color: 'bg-status-danger/10 text-status-danger border-status-danger/20' },
} as const;

export function SpaceWeatherSection() {
  const [timeWindow, setTimeWindow] = useState('7');
  const days = parseInt(timeWindow, 10);
  const { data: response, isLoading, isError, error } = useSpaceWeather(days);
  const [selectedEvent, setSelectedEvent] = useState<TimelineItem | null>(null);

  if (isLoading) {
    return (
      <SectionContainer id="space-weather">
        <SectionHeader title="Space Weather" description="Solar flares, CMEs, and geomagnetic storms" />
        <CardListSkeleton count={4} />
        <div className="mt-6"><ChartSkeleton /></div>
      </SectionContainer>
    );
  }

  if (isError || !response?.success || !response.data) {
    return (
      <SectionContainer id="space-weather">
        <SectionHeader title="Space Weather" />
        <ErrorState
          title="Failed to load space weather data"
          message={error?.message ?? response?.error ?? undefined}
        />
      </SectionContainer>
    );
  }

  const data = response.data;
  const isStale = response.metadata.isStale;

  if (data.timeline.length === 0) {
    return (
      <SectionContainer id="space-weather">
        <SectionHeader title="Space Weather" />
        <EmptyState icon={CloudOff} title="No recent space weather events" message="Check back later for updates" />
      </SectionContainer>
    );
  }

  return (
    <SectionContainer id="space-weather">
      <SectionHeader title="Space Weather" description={`Solar flares, CMEs, and geomagnetic storms (last ${timeWindow === '1' ? '24 hours' : timeWindow === '7' ? '7 days' : '30 days'})`}>
        <TimeWindowSelector value={timeWindow} onChange={setTimeWindow} />
        {isStale && <StaleIndicator />}
        <RefreshButton queryKey={queryKeys.spaceWeather.root} label="Refresh space weather" />
      </SectionHeader>

      <div className="space-y-6">
        {/* Severity + Gauge + Aurora + Forecast */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SeverityMeter data={data} />
          <CmeSpeedGauge timeline={data.timeline} />
          <AuroraIndicator data={data} />
          <ForecastPanel notifications={data.notifications} />
        </div>

        {/* Event Chains */}
        <EventChain timeline={data.timeline} />

        {/* Timeline + Notifications */}
        <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card overflow-hidden">
          <div className="border-b border-white/[0.06] p-4">
            <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            <div className="divide-y divide-white/[0.04]">
              {data.timeline.slice(0, 15).map((item) => {
                const config = typeConfig[item.type];
                const Icon = config.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedEvent(item)}
                    className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-white/[0.03]"
                  >
                    <div className="mt-0.5 shrink-0">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-white">{item.title}</span>
                        <Badge variant="outline" className={`text-[10px] ${config.color}`}>
                          {config.label}
                        </Badge>
                        <SeverityBadge severity={item.severity} />
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatDateTime(item.date)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Notifications feed */}
        <NotificationFeed notifications={data.notifications} />
        </div>

        {/* Chart */}
        <SpaceWeatherChart data={data.chartData} />
      </div>

      {/* Detail drawer */}
      <Sheet open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <SheetContent className="border-white/[0.08] p-6" style={{ backgroundColor: '#0B1228' }}>
          {selectedEvent && (
            <>
              <SheetHeader>
                <SheetTitle className="text-white text-lg">{selectedEvent.title}</SheetTitle>
                <SheetDescription>
                  {formatDateTime(selectedEvent.date)}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={typeConfig[selectedEvent.type].color}>
                    {typeConfig[selectedEvent.type].label}
                  </Badge>
                  <SeverityBadge severity={selectedEvent.severity} />
                </div>
                {selectedEvent.details && (
                  <p className="text-sm leading-relaxed text-white/80">{selectedEvent.details}</p>
                )}
                {selectedEvent.sourceUrl && (
                  <a
                    href={selectedEvent.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-nebula-blue hover:underline"
                  >
                    View source data
                  </a>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </SectionContainer>
  );
}
