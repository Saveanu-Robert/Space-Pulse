import { NextRequest } from 'next/server';
import { getEnv } from '@/lib/config/env';
import { cacheManager } from '@/lib/cache/cache-manager';
import { jsonResponse } from '@/lib/utils/http';
import type { ApiResponse } from '@/types/common';
import { logger } from '@/lib/observability/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const result = await cacheManager.getOrLoad(
      'mars-photos',
      async () => {
        const env = getEnv();
        const res = await fetch(
          `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=${env.NASA_API_KEY}`,
          { signal: AbortSignal.timeout(15000) }
        );
        if (!res.ok) throw new Error(`Mars API ${res.status}`);
        const data = await res.json();
        return data.latest_photos?.slice(0, 12) ?? [];
      },
      { ttlMs: 600_000 } // 10 min cache
    );

    const resp: ApiResponse<unknown[]> = {
      success: true,
      data: result.data as unknown[],
      error: null,
      metadata: { lastUpdated: result.lastUpdated, fetchedAt: result.fetchedAt, isStale: result.isStale, sourceStatus: result.isStale ? 'stale' : 'ok' },
    };
    return jsonResponse(resp);
  } catch (error) {
    logger.error('mars-photos', 'Failed', { error: String(error) });
    return jsonResponse({ success: false, data: null, error: 'Mars photos unavailable', metadata: { lastUpdated: new Date().toISOString(), fetchedAt: new Date().toISOString(), isStale: false, sourceStatus: 'error' as const } }, 502);
  }
}
