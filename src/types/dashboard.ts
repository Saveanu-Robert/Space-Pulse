import type { ApiResponse } from './common';
import type { APODSummary } from './apod';
import type { SpaceWeatherSummary } from './space-weather';
import type { NEOSummary } from './neos';
import type { EarthEventsSummary } from './earth-events';

export interface DashboardOverview {
  apod: ApiResponse<APODSummary>;
  spaceWeather: ApiResponse<SpaceWeatherSummary>;
  neos: ApiResponse<NEOSummary>;
  earthEvents: ApiResponse<EarthEventsSummary>;
}
