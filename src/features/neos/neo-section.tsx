'use client';

import { useState, useMemo } from 'react';
import { useNeos } from '@/hooks/use-neos';

import { SectionContainer } from '@/components/layout/section-container';
import { SectionHeader } from '@/components/shared/section-header';
import { RefreshButton } from '@/components/shared/refresh-button';
import { StaleIndicator } from '@/components/shared/stale-indicator';
import { ExportButton } from '@/components/shared/export-button';
import { ErrorState } from '@/components/states/error-state';
import { EmptyState } from '@/components/states/empty-state';
import { TableSkeleton, ChartSkeleton } from '@/components/states/loading-skeleton';
import { NeoApproachesChart } from '@/components/charts/neo-approaches-chart';
import { HazardBadge } from '@/components/shared/hazard-badge';
import { StatCard } from '@/components/shared/stat-card';
import { NeoFilterBar } from '@/components/shared/neo-filter-bar';
import { queryKeys } from '@/lib/query/query-keys';
import { formatDate, formatDistance, formatVelocity, formatDiameter } from '@/lib/utils/format';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NeoDetailModal } from './neo-detail-modal';
import { NeoOrbitViz } from './neo-orbit-viz';
import { NeoRiskRanking } from './neo-risk-ranking';
import { Crosshair, ShieldAlert } from 'lucide-react';
import type { NEOApproach } from '@/types/neos';

type SortKey = 'date' | 'distance' | 'velocity' | 'size';

export function NeoSection() {
  const { data: response, isLoading, isError, error } = useNeos();
  const [sortBy, setSortBy] = useState<SortKey>('date');
  const [selectedNeo, setSelectedNeo] = useState<NEOApproach | null>(null);
  const [search, setSearch] = useState('');
  const [hazardousOnly, setHazardousOnly] = useState(false);

  const approaches = response?.data?.approaches ?? [];
  const filtered = useMemo(() => {
    let items = approaches;
    if (hazardousOnly) items = items.filter((a) => a.hazardous);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter((a) => a.name.toLowerCase().includes(q));
    }
    return items;
  }, [approaches, hazardousOnly, search]);

  if (isLoading) {
    return (
      <SectionContainer id="neos">
        <SectionHeader title="Near-Earth Objects" />
        <TableSkeleton />
        <div className="mt-6"><ChartSkeleton /></div>
      </SectionContainer>
    );
  }

  if (isError || !response?.success || !response.data) {
    return (
      <SectionContainer id="neos">
        <SectionHeader title="Near-Earth Objects" />
        <ErrorState
          title="Failed to load near-Earth object data"
          message={error?.message ?? response?.error ?? undefined}
        />
      </SectionContainer>
    );
  }

  const data = response.data;
  const isStale = response.metadata.isStale;
  const sorted = sortApproaches(filtered, sortBy);

  const exportData = data.approaches.map((a) => ({
    Name: a.name,
    Date: a.closeApproachDate,
    Hazardous: a.hazardous ? 'Yes' : 'No',
    'Miss Distance (km)': Math.round(a.missDistanceKm),
    'Velocity (km/h)': Math.round(a.velocityKph),
    'Diameter Min (m)': a.diameterMinM.toFixed(1),
    'Diameter Max (m)': a.diameterMaxM.toFixed(1),
  }));

  return (
    <SectionContainer id="neos">
      <SectionHeader title="Near-Earth Objects" description="Upcoming close approaches (next 7 days)">
        {isStale && <StaleIndicator />}
        <ExportButton data={exportData} filename="neo-approaches" label="Export" />
        <RefreshButton queryKey={queryKeys.neos.root} label="Refresh NEOs" />
      </SectionHeader>

      <div className="space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Objects" value={data.totalUpcoming} icon={Crosshair} accentColor="cyan" />
          <StatCard label="Hazardous" value={data.hazardousCount} icon={ShieldAlert} accentColor="red" />
          <StatCard
            label="Closest Approach"
            value={data.approaches.length > 0 ? `${Math.min(...data.approaches.map(a => a.missDistanceLunar)).toFixed(1)} LD` : 'N/A'}
            icon={Crosshair}
            accentColor="amber"
          />
          <StatCard
            label="Fastest Object"
            value={data.approaches.length > 0 ? `${Math.round(Math.max(...data.approaches.map(a => a.velocityKph)))} km/h` : 'N/A'}
            icon={Crosshair}
            accentColor="violet"
          />
        </div>

        {/* Search + Filter */}
        <NeoFilterBar
          search={search}
          onSearchChange={setSearch}
          hazardousOnly={hazardousOnly}
          onHazardousOnlyChange={setHazardousOnly}
          totalCount={data.totalUpcoming}
          filteredCount={filtered.length}
        />

        {/* Table (desktop) / Cards (mobile) — render both, toggle via CSS to avoid hydration mismatch */}
        <div className="md:hidden">
          <MobileNeoList approaches={sorted} onSelect={setSelectedNeo} />
        </div>
        <div className="hidden md:block">
          <div className="glass-card overflow-hidden">
            <ScrollArea className="max-h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/[0.06] hover:bg-transparent">
                    <TableHead className="cursor-pointer hover:text-white" onClick={() => setSortBy('date')}>
                      Date {sortBy === 'date' && '↓'}
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="cursor-pointer hover:text-white" onClick={() => setSortBy('distance')}>
                      Miss Distance {sortBy === 'distance' && '↑'}
                    </TableHead>
                    <TableHead className="cursor-pointer hover:text-white" onClick={() => setSortBy('velocity')}>
                      Velocity {sortBy === 'velocity' && '↓'}
                    </TableHead>
                    <TableHead className="cursor-pointer hover:text-white" onClick={() => setSortBy('size')}>
                      Diameter {sortBy === 'size' && '↓'}
                    </TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorted.slice(0, 30).map((neo) => (
                    <TableRow
                      key={`${neo.id}-${neo.closeApproachDate}`}
                      className="border-white/[0.04] cursor-pointer hover:bg-white/[0.03]"
                      onClick={() => setSelectedNeo(neo)}
                    >
                      <TableCell className="text-xs">{formatDate(neo.closeApproachDate)}</TableCell>
                      <TableCell>
                        <span className="text-sm font-medium text-nebula-blue">
                          {neo.name}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs">{formatDistance(neo.missDistanceKm)}</TableCell>
                      <TableCell className="text-xs">{formatVelocity(neo.velocityKph)}</TableCell>
                      <TableCell className="text-xs">{formatDiameter(neo.diameterMinM, neo.diameterMaxM)}</TableCell>
                      <TableCell><HazardBadge hazardous={neo.hazardous} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>

        {/* Orbit viz + Risk ranking */}
        <div className="grid gap-6 lg:grid-cols-2">
          <NeoOrbitViz approaches={data.approaches} onSelect={setSelectedNeo} />
          <NeoRiskRanking approaches={data.approaches} onSelect={setSelectedNeo} />
        </div>

        {/* Chart */}
        <NeoApproachesChart approaches={data.approaches} />
      </div>

      <NeoDetailModal
        neo={selectedNeo}
        open={!!selectedNeo}
        onClose={() => setSelectedNeo(null)}
      />
    </SectionContainer>
  );
}

function MobileNeoList({ approaches, onSelect }: { approaches: NEOApproach[]; onSelect: (neo: NEOApproach) => void }) {
  if (approaches.length === 0) {
    return <EmptyState title="No upcoming close approaches" icon={Crosshair} />;
  }

  return (
    <div className="space-y-3">
      {approaches.slice(0, 15).map((neo) => (
        <button key={`${neo.id}-${neo.closeApproachDate}`} className="glass-card glass-card-hover p-4 w-full text-left" onClick={() => onSelect(neo)}>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <span className="text-sm font-medium text-nebula-blue">
                {neo.name}
              </span>
              <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(neo.closeApproachDate)}</p>
            </div>
            <HazardBadge hazardous={neo.hazardous} />
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
            <div><span className="block text-white">{formatDistance(neo.missDistanceKm)}</span>Distance</div>
            <div><span className="block text-white">{formatVelocity(neo.velocityKph)}</span>Velocity</div>
            <div><span className="block text-white">{formatDiameter(neo.diameterMinM, neo.diameterMaxM)}</span>Diameter</div>
          </div>
        </button>
      ))}
    </div>
  );
}

function sortApproaches(approaches: NEOApproach[], sortBy: SortKey): NEOApproach[] {
  return [...approaches].sort((a, b) => {
    switch (sortBy) {
      case 'date': return a.closeApproachDate.localeCompare(b.closeApproachDate);
      case 'distance': return a.missDistanceKm - b.missDistanceKm;
      case 'velocity': return b.velocityKph - a.velocityKph;
      case 'size': return b.diameterMaxM - a.diameterMaxM;
      default: return 0;
    }
  });
}
