import type { ApiResponse } from '@/types/common';
import type { APODSummary, APODGalleryResponse } from '@/types/apod';
import type { SpaceWeatherSummary } from '@/types/space-weather';
import type { NEOSummary } from '@/types/neos';
import type { EarthEventsSummary } from '@/types/earth-events';
import type { DashboardOverview } from '@/types/dashboard';

interface FetchOptions {
  force?: boolean;
  signal?: AbortSignal;
}

async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {},
  params?: Record<string, string>
): Promise<ApiResponse<T>> {
  const searchParams = new URLSearchParams();
  if (options.force) searchParams.set('force', '1');
  if (params) {
    for (const [k, v] of Object.entries(params)) searchParams.set(k, v);
  }
  const qs = searchParams.toString();
  const path = `/api${endpoint}${qs ? `?${qs}` : ''}`;

  const response = await fetch(path, {
    signal: options.signal,
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<ApiResponse<T>>;
}

export const apiClient = {
  getApod: (opts?: FetchOptions) =>
    fetchApi<APODSummary>('/apod', opts),
  getApodGallery: (opts?: FetchOptions) =>
    fetchApi<APODGalleryResponse>('/apod/gallery', opts),
  getSpaceWeather: (days: number = 7, opts?: FetchOptions) =>
    fetchApi<SpaceWeatherSummary>('/space-weather', opts, { days: String(days) }),
  getNeos: (opts?: FetchOptions) =>
    fetchApi<NEOSummary>('/neos', opts),
  getEarthEvents: (opts?: FetchOptions) =>
    fetchApi<EarthEventsSummary>('/earth-events', opts),
  getDashboardOverview: (opts?: FetchOptions) =>
    fetchApi<DashboardOverview>('/dashboard/overview', opts),
};
