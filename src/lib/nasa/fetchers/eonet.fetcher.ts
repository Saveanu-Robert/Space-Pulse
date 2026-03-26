import { resilientFetch } from '@/lib/resilience/resilient-fetch';
import { NasaEONETResponseSchema, type NasaEONETResponse } from '@/lib/schemas/eonet.schema';
import { NASA_BASE_URLS, EONET_DEFAULT_LIMIT } from '@/lib/config/constants';
import { logger } from '@/lib/observability/logger';

// EONET v3 doesn't require an API key
export async function fetchEONETEvents(
  status: 'open' | 'closed' | 'all' = 'open',
  limit: number = EONET_DEFAULT_LIMIT
): Promise<NasaEONETResponse> {
  const url = new URL(NASA_BASE_URLS.EONET_EVENTS);
  url.searchParams.set('status', status);
  url.searchParams.set('limit', String(limit));

  const response = await resilientFetch({
    module: 'eonet',
    url: url.toString(),
  });

  if (!response.ok) {
    logger.error('eonet', `EONET API returned ${response.status}`);
    throw Object.assign(new Error(`EONET returned ${response.status}`), {
      status: response.status,
    });
  }

  const json = await response.json();
  const parsed = NasaEONETResponseSchema.safeParse(json);

  if (!parsed.success) {
    logger.error('eonet', 'EONET validation failed', {
      errors: String(parsed.error).slice(0, 500),
    });
    throw new Error('Validation failed for eonet');
  }

  return parsed.data;
}
