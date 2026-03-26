import { cacheManager } from '@/lib/cache/cache-manager';
import { fetchFLR, fetchCME, fetchGST, fetchNotifications } from '../fetchers/donki.fetcher';
import { mapSpaceWeather } from '../mappers/space-weather.mapper';
import type { ApiResponse } from '@/types/common';
import type { SpaceWeatherSummary } from '@/types/space-weather';
import { logger } from '@/lib/observability/logger';

export async function getSpaceWeather(force: boolean = false, days: number = 7): Promise<ApiResponse<SpaceWeatherSummary>> {
  const cacheKey = `space-weather-${days}d`;
  try {
    const result = await cacheManager.getOrLoad<SpaceWeatherSummary>(
      cacheKey,
      async () => {
        const [flrResult, cmeResult, gstResult, notifResult] = await Promise.allSettled([
          fetchFLR(days),
          fetchCME(days),
          fetchGST(days),
          fetchNotifications(days),
        ]);

        const flares = flrResult.status === 'fulfilled' ? flrResult.value : [];
        const cmes = cmeResult.status === 'fulfilled' ? cmeResult.value : [];
        const geomagneticStorms = gstResult.status === 'fulfilled' ? gstResult.value : [];
        const notifications = notifResult.status === 'fulfilled' ? notifResult.value : [];

        if (flrResult.status === 'rejected') logger.warn('space-weather', 'FLR fetch failed', { error: String(flrResult.reason) });
        if (cmeResult.status === 'rejected') logger.warn('space-weather', 'CME fetch failed', { error: String(cmeResult.reason) });
        if (gstResult.status === 'rejected') logger.warn('space-weather', 'GST fetch failed', { error: String(gstResult.reason) });
        if (notifResult.status === 'rejected') logger.warn('space-weather', 'Notifications fetch failed', { error: String(notifResult.reason) });

        const allFailed = [flrResult, cmeResult, gstResult, notifResult].every((r) => r.status === 'rejected');
        if (allFailed) throw new Error('All DONKI endpoints failed');

        return mapSpaceWeather({ flares, cmes, geomagneticStorms, notifications });
      },
      { forceRefresh: force }
    );

    return {
      success: true,
      data: result.data,
      error: null,
      metadata: {
        lastUpdated: result.lastUpdated,
        fetchedAt: result.fetchedAt,
        isStale: result.isStale,
        sourceStatus: result.isStale ? 'stale' : 'ok',
      },
    };
  } catch (error) {
    logger.error('space-weather', 'Service failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      success: false,
      data: null,
      error: 'Failed to fetch space weather data',
      metadata: {
        lastUpdated: new Date().toISOString(),
        fetchedAt: new Date().toISOString(),
        isStale: false,
        sourceStatus: 'error',
      },
    };
  }
}
