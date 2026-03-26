import { cacheManager } from '@/lib/cache/cache-manager';
import { fetchAPOD } from '../fetchers/apod.fetcher';
import { mapRawAPOD } from '../mappers/apod.mapper';
import type { ApiResponse } from '@/types/common';
import type { APODSummary } from '@/types/apod';
import { logger } from '@/lib/observability/logger';

const CACHE_KEY = 'apod';

export async function getAPOD(force: boolean = false): Promise<ApiResponse<APODSummary>> {
  try {
    const result = await cacheManager.getOrLoad<APODSummary>(
      CACHE_KEY,
      async () => {
        const raw = await fetchAPOD();
        return mapRawAPOD(raw);
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
    logger.error('apod', 'Service failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      success: false,
      data: null,
      error: 'Failed to fetch Astronomy Picture of the Day',
      metadata: {
        lastUpdated: new Date().toISOString(),
        fetchedAt: new Date().toISOString(),
        isStale: false,
        sourceStatus: 'error',
      },
    };
  }
}
