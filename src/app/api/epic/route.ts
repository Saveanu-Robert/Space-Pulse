import { NextRequest } from 'next/server';
import { getEnv } from '@/lib/config/env';
import { cacheManager } from '@/lib/cache/cache-manager';
import { jsonResponse } from '@/lib/utils/http';
import type { ApiResponse } from '@/types/common';
import { logger } from '@/lib/observability/logger';

export const dynamic = 'force-dynamic';

interface EpicRaw {
  identifier: string;
  caption: string;
  date: string;
  image: string;
}

export async function GET(request: NextRequest) {
  try {
    const result = await cacheManager.getOrLoad(
      'epic-earth',
      async () => {
        const env = getEnv();
        const res = await fetch(
          `https://api.nasa.gov/EPIC/api/natural?api_key=${env.NASA_API_KEY}`,
          { signal: AbortSignal.timeout(15000) }
        );
        if (!res.ok) throw new Error(`EPIC API ${res.status}`);
        const data: EpicRaw[] = await res.json();

        return data.slice(0, 6).map((img) => {
          const dateParts = img.date.split(' ')[0].replace(/-/g, '/');
          return {
            identifier: img.identifier,
            caption: img.caption,
            date: img.date,
            image: img.image,
            url: `https://epic.gsfc.nasa.gov/archive/natural/${dateParts}/png/${img.image}.png`,
          };
        });
      },
      { ttlMs: 600_000 }
    );

    const resp: ApiResponse<unknown> = {
      success: true,
      data: result.data,
      error: null,
      metadata: { lastUpdated: result.lastUpdated, fetchedAt: result.fetchedAt, isStale: result.isStale, sourceStatus: result.isStale ? 'stale' : 'ok' },
    };
    return jsonResponse(resp);
  } catch (error) {
    logger.error('epic', 'Failed', { error: String(error) });
    return jsonResponse({ success: false, data: null, error: 'EPIC unavailable', metadata: { lastUpdated: new Date().toISOString(), fetchedAt: new Date().toISOString(), isStale: false, sourceStatus: 'error' as const } }, 502);
  }
}
