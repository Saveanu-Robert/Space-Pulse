import { NextRequest } from 'next/server';
import { cacheManager } from '@/lib/cache/cache-manager';
import { jsonResponse } from '@/lib/utils/http';
import type { ApiResponse } from '@/types/common';
import { logger } from '@/lib/observability/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const result = await cacheManager.getOrLoad(
      'exoplanets',
      async () => {
        // NASA Exoplanet Archive TAP query
        const query = encodeURIComponent('select count(*) as total from pscomppars');
        const hzQuery = encodeURIComponent('select count(*) as total from pscomppars where pl_insol between 0.36 and 1.11');

        const [totalRes, hzRes] = await Promise.all([
          fetch(`https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${query}&format=json`, { signal: AbortSignal.timeout(15000) }),
          fetch(`https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${hzQuery}&format=json`, { signal: AbortSignal.timeout(15000) }),
        ]);

        let totalConfirmed = 5800; // Fallback
        let habitableZone = 200;

        if (totalRes.ok) {
          const d = await totalRes.json();
          if (d?.[0]?.total) totalConfirmed = d[0].total;
        }
        if (hzRes.ok) {
          const d = await hzRes.json();
          if (d?.[0]?.total) habitableZone = d[0].total;
        }

        return {
          totalConfirmed,
          habitableZone,
          recentYear: new Date().getFullYear(),
          recentCount: 0,
        };
      },
      { ttlMs: 3600_000 } // 1 hour cache
    );

    const resp: ApiResponse<unknown> = {
      success: true,
      data: result.data,
      error: null,
      metadata: { lastUpdated: result.lastUpdated, fetchedAt: result.fetchedAt, isStale: result.isStale, sourceStatus: result.isStale ? 'stale' : 'ok' },
    };
    return jsonResponse(resp);
  } catch (error) {
    logger.error('exoplanets', 'Failed', { error: String(error) });
    return jsonResponse({ success: false, data: null, error: 'Exoplanet data unavailable', metadata: { lastUpdated: new Date().toISOString(), fetchedAt: new Date().toISOString(), isStale: false, sourceStatus: 'error' as const } }, 502);
  }
}
