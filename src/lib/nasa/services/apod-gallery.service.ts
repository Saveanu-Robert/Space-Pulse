import { cacheManager } from '@/lib/cache/cache-manager';
import { nasaFetch } from '../fetchers/base-fetcher';
import { mapRawAPOD } from '../mappers/apod.mapper';
import type { ApiResponse } from '@/types/common';
import type { APODGalleryResponse } from '@/types/apod';
import { logger } from '@/lib/observability/logger';
import { z } from 'zod/v4';
import { NasaApodRawSchema } from '@/lib/schemas/apod.schema';
import { NASA_BASE_URLS } from '@/lib/config/constants';
import { format, subDays } from 'date-fns';

const GallerySchema = z.array(NasaApodRawSchema);
const CACHE_KEY = 'apod-gallery';

export async function getAPODGallery(
  count: number = 12,
  force: boolean = false
): Promise<ApiResponse<APODGalleryResponse>> {
  try {
    const result = await cacheManager.getOrLoad<APODGalleryResponse>(
      CACHE_KEY,
      async () => {
        const end = new Date();
        const start = subDays(end, count - 1);
        const raw = await nasaFetch(
          'apod-gallery',
          NASA_BASE_URLS.APOD,
          GallerySchema,
          {
            start_date: format(start, 'yyyy-MM-dd'),
            end_date: format(end, 'yyyy-MM-dd'),
          }
        );
        const items = raw.map(mapRawAPOD).reverse();
        return { items, total: items.length };
      },
      { forceRefresh: force, ttlMs: 300_000 } // 5 min cache for gallery
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
    logger.error('apod-gallery', 'Service failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      success: false,
      data: null,
      error: 'Failed to fetch APOD gallery',
      metadata: {
        lastUpdated: new Date().toISOString(),
        fetchedAt: new Date().toISOString(),
        isStale: false,
        sourceStatus: 'error',
      },
    };
  }
}
