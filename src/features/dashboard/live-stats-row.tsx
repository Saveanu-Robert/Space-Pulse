'use client';

import { useDashboardOverview } from '@/hooks/use-dashboard-overview';
import { StatCard } from '@/components/shared/stat-card';
import { StatsSkeleton } from '@/components/states/loading-skeleton';
import { Sun, Zap, Activity, Globe, Crosshair } from 'lucide-react';

export function LiveStatsRow() {
  const { data: response, isLoading } = useDashboardOverview();

  if (isLoading || !response) return <StatsSkeleton />;

  const sw = response.data?.spaceWeather?.data;
  const neos = response.data?.neos?.data;
  const events = response.data?.earthEvents?.data;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      <StatCard
        label="Solar Flares"
        value={sw?.counts.flares ?? 0}
        icon={Sun}
        accentColor="amber"
        isLoading={isLoading}
      />
      <StatCard
        label="CMEs"
        value={sw?.counts.cmes ?? 0}
        icon={Zap}
        accentColor="violet"
        isLoading={isLoading}
      />
      <StatCard
        label="Geo. Storms"
        value={sw?.counts.geomagneticStorms ?? 0}
        icon={Activity}
        accentColor="red"
        isLoading={isLoading}
      />
      <StatCard
        label="Earth Events"
        value={events?.totalOpenEvents ?? 0}
        icon={Globe}
        accentColor="blue"
        isLoading={isLoading}
      />
      <StatCard
        label="Near-Earth Objects"
        value={neos?.totalUpcoming ?? 0}
        icon={Crosshair}
        accentColor="cyan"
        isLoading={isLoading}
      />
    </div>
  );
}
