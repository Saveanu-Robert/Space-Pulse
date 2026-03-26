import type { z } from 'zod/v4';
import { getEnv } from '@/lib/config/env';
import { resilientFetch } from '@/lib/resilience/resilient-fetch';
import { logger } from '@/lib/observability/logger';

export async function nasaFetch<T>(
  module: string,
  baseUrl: string,
  schema: z.ZodType<T>,
  params?: Record<string, string>
): Promise<T> {
  const env = getEnv();
  const url = new URL(baseUrl);

  // EONET doesn't need API key but it doesn't hurt to include
  url.searchParams.set('api_key', env.NASA_API_KEY);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  // Don't log the URL with the API key
  const logUrl = baseUrl + (params ? `?${new URLSearchParams(params).toString()}` : '');

  const response = await resilientFetch({
    module,
    url: url.toString(),
    dedupKey: `${module}:${logUrl}`,
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Unknown error');
    logger.error(module, `NASA API returned ${response.status}`, {
      status: response.status,
      body: errorBody.slice(0, 200),
    });
    throw Object.assign(new Error(`NASA API ${module} returned ${response.status}`), {
      status: response.status,
    });
  }

  const json = await response.json();
  const parsed = schema.safeParse(json);

  if (!parsed.success) {
    logger.error(module, 'Response validation failed', {
      errors: String(parsed.error).slice(0, 500),
    });
    throw new Error(`Validation failed for ${module}`);
  }

  return parsed.data;
}
