import { getAPOD } from './apod.service';
import { getSpaceWeather } from './space-weather.service';
import { getNEOs } from './neos.service';
import { getEarthEvents } from './earth-events.service';
import type { ApiResponse } from '@/types/common';
import type { DashboardOverview } from '@/types/dashboard';

export async function getDashboardOverview(
  force: boolean = false
): Promise<ApiResponse<DashboardOverview>> {
  const [apod, spaceWeather, neos, earthEvents] = await Promise.all([
    getAPOD(force),
    getSpaceWeather(force),
    getNEOs(force),
    getEarthEvents(force),
  ]);

  const anySuccess = [apod, spaceWeather, neos, earthEvents].some((r) => r.success);
  const anyStale = [apod, spaceWeather, neos, earthEvents].some((r) => r.metadata.isStale);
  const fetchedAt = new Date().toISOString();

  return {
    success: anySuccess,
    data: { apod, spaceWeather, neos, earthEvents },
    error: anySuccess ? null : 'All data sources are currently unavailable',
    metadata: {
      lastUpdated: fetchedAt,
      fetchedAt,
      isStale: anyStale,
      sourceStatus: anySuccess ? (anyStale ? 'stale' : 'ok') : 'error',
    },
  };
}
