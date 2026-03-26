import { cacheManager } from '@/lib/cache/cache-manager';
import { fetchNEOFeed } from '../fetchers/neows.fetcher';
import { mapNEOFeed } from '../mappers/neos.mapper';
import type { ApiResponse } from '@/types/common';
import type { NEOSummary } from '@/types/neos';
import { logger } from '@/lib/observability/logger';

const CACHE_KEY = 'neos';

export async function getNEOs(force: boolean = false): Promise<ApiResponse<NEOSummary>> {
  try {
    const result = await cacheManager.getOrLoad<NEOSummary>(
      CACHE_KEY,
      async () => {
        const raw = await fetchNEOFeed();
        return mapNEOFeed(raw);
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
    logger.error('neos', 'Service failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      success: false,
      data: null,
      error: 'Failed to fetch near-Earth object data',
      metadata: {
        lastUpdated: new Date().toISOString(),
        fetchedAt: new Date().toISOString(),
        isStale: false,
        sourceStatus: 'error',
      },
    };
  }
}
