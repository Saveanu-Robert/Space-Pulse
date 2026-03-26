'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useEarthEvents } from '@/hooks/use-earth-events';
import { SectionContainer } from '@/components/layout/section-container';
import { SectionHeader } from '@/components/shared/section-header';
import { RefreshButton } from '@/components/shared/refresh-button';
import { StaleIndicator } from '@/components/shared/stale-indicator';
import { ErrorState } from '@/components/states/error-state';
import { EmptyState } from '@/components/states/empty-state';
import { MapSkeleton, CardListSkeleton, ChartSkeleton } from '@/components/states/loading-skeleton';
import { EarthEventsChart } from '@/components/charts/earth-events-chart';
import { queryKeys } from '@/lib/query/query-keys';
import { formatDateTime } from '@/lib/utils/format';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { CATEGORY_COLORS } from '@/lib/config/constants';
import { Globe, ExternalLink } from 'lucide-react';
import type { EarthEvent } from '@/types/earth-events';

const EarthEventsMap = dynamic(
  () => import('@/components/maps/earth-events-map').then((mod) => mod.EarthEventsMap),
  { ssr: false, loading: () => <MapSkeleton /> }
);

export function EarthEventsSection() {
  const { data: response, isLoading, isError, error } = useEarthEvents();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EarthEvent | null>(null);

  const events = response?.data?.events ?? [];
  const filteredEvents = useMemo(() => {
    if (!selectedCategory) return events;
    return events.filter((e) => e.category.id === selectedCategory);
  }, [events, selectedCategory]);

  if (isLoading) {
    return (
      <SectionContainer id="earth-events">
        <SectionHeader title="Earth Events" />
        <MapSkeleton />
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <CardListSkeleton count={4} />
          <ChartSkeleton />
        </div>
      </SectionContainer>
    );
  }

  if (isError || !response?.success || !response.data) {
    return (
      <SectionContainer id="earth-events">
        <SectionHeader title="Earth Events" />
        <ErrorState
          title="Failed to load Earth events"
          message={error?.message ?? response?.error ?? undefined}
        />
      </SectionContainer>
    );
  }

  const data = response.data;
  const isStale = response.metadata.isStale;

  if (data.events.length === 0) {
    return (
      <SectionContainer id="earth-events">
        <SectionHeader title="Earth Events" />
        <EmptyState icon={Globe} title="No active Earth events" message="Check back later for updates" />
      </SectionContainer>
    );
  }

  return (
    <SectionContainer id="earth-events">
      <SectionHeader title="Earth Events" description="Active natural events worldwide">
        {isStale && <StaleIndicator />}
        <RefreshButton queryKey={queryKeys.earthEvents.root} label="Refresh Earth events" />
      </SectionHeader>

      <div className="space-y-6">
        {/* Filter chips */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === null ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(null)}
          >
            All ({data.totalOpenEvents})
          </Badge>
          {data.categories.map((cat) => {
            const color = CATEGORY_COLORS[cat.id];
            return (
              <Badge
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                className="cursor-pointer"
                style={selectedCategory === cat.id && color ? { backgroundColor: color, borderColor: color } : undefined}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              >
                {cat.title} ({cat.count})
              </Badge>
            );
          })}
        </div>

        {/* Map */}
        <div className="glass-card overflow-hidden">
          <EarthEventsMap events={filteredEvents} onSelectEvent={setSelectedEvent} />
        </div>

        {/* Event list + Chart */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="glass-card overflow-hidden">
            <div className="border-b border-white/[0.06] p-4">
              <h3 className="text-sm font-semibold text-white">Recent Events</h3>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              <div className="divide-y divide-white/[0.04]">
                {filteredEvents.slice(0, 15).map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-white/[0.03]"
                  >
                    <div
                      className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[event.category.id] ?? '#3B82F6' }}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white">{event.title}</p>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{event.category.title}</span>
                        {event.date && <span>&middot; {formatDateTime(event.date)}</span>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <EarthEventsChart categories={data.categories} />
        </div>
      </div>

      {/* Detail drawer */}
      <Sheet open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <SheetContent className="border-white/[0.08] p-6" style={{ backgroundColor: '#0B1228' }}>
          {selectedEvent && (
            <>
              <SheetHeader>
                <SheetTitle className="text-white">{selectedEvent.title}</SheetTitle>
                <SheetDescription>
                  {selectedEvent.category.title}
                  {selectedEvent.date && ` — ${formatDateTime(selectedEvent.date)}`}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {selectedEvent.description && (
                  <p className="text-sm text-white/80">{selectedEvent.description}</p>
                )}
                {selectedEvent.geometry && selectedEvent.geometry.coordinates?.length >= 2 && (
                  <div className="text-xs text-muted-foreground">
                    <p>Coordinates: {selectedEvent.geometry.coordinates[1]?.toFixed(4)}, {selectedEvent.geometry.coordinates[0]?.toFixed(4)}</p>
                    {selectedEvent.geometry.magnitudeValue !== null && (
                      <p>Magnitude: {selectedEvent.geometry.magnitudeValue} {selectedEvent.geometry.magnitudeUnit}</p>
                    )}
                  </div>
                )}
                {selectedEvent.isClosed && (
                  <Badge variant="outline" className="text-xs">Closed</Badge>
                )}
                {selectedEvent.sources.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Sources</p>
                    {selectedEvent.sources.map((source) => (
                      <a
                        key={source.id}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-nebula-blue hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {source.id}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </SectionContainer>
  );
}
