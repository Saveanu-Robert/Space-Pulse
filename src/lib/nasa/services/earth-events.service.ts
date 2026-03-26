import { cacheManager } from '@/lib/cache/cache-manager';
import { fetchEONETEvents } from '../fetchers/eonet.fetcher';
import { mapEONETEvents } from '../mappers/earth-events.mapper';
import type { ApiResponse } from '@/types/common';
import type { EarthEventsSummary } from '@/types/earth-events';
import { logger } from '@/lib/observability/logger';

const CACHE_KEY = 'earth-events';

export async function getEarthEvents(force: boolean = false): Promise<ApiResponse<EarthEventsSummary>> {
  try {
    const result = await cacheManager.getOrLoad<EarthEventsSummary>(
      CACHE_KEY,
      async () => {
        const raw = await fetchEONETEvents();
        return mapEONETEvents(raw);
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
    logger.error('earth-events', 'Service failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      success: false,
      data: null,
      error: 'Failed to fetch Earth events data',
      metadata: {
        lastUpdated: new Date().toISOString(),
        fetchedAt: new Date().toISOString(),
        isStale: false,
        sourceStatus: 'error',
      },
    };
  }
}
