import { withTimeout } from './timeout';
import { withRetry } from './retry';
import { CircuitBreaker } from './circuit-breaker';
import { dedup } from './dedup';
import { FETCH_CONFIG } from '../config/constants';
import { withTiming } from '../observability/timing';

const circuitBreakers = new Map<string, CircuitBreaker>();

function getCircuitBreaker(name: string): CircuitBreaker {
  let cb = circuitBreakers.get(name);
  if (!cb) {
    cb = new CircuitBreaker(name);
    circuitBreakers.set(name, cb);
  }
  return cb;
}

export interface ResilientFetchOptions {
  module: string;
  url: string;
  timeoutMs?: number;
  dedupKey?: string;
}

export async function resilientFetch(options: ResilientFetchOptions): Promise<Response> {
  const { module, url, timeoutMs = FETCH_CONFIG.TIMEOUT_MS } = options;
  const dedupKey = options.dedupKey ?? `${module}:${url.split('?')[0]}`;
  const cb = getCircuitBreaker(module);

  return dedup(dedupKey, () =>
    withTiming(module, `fetch ${module}`, () =>
      cb.execute(() =>
        withRetry(
          () => withTimeout(fetch(url), timeoutMs),
          {
            maxRetries: FETCH_CONFIG.MAX_RETRIES,
            baseDelayMs: FETCH_CONFIG.RETRY_BASE_DELAY_MS,
            maxDelayMs: FETCH_CONFIG.RETRY_MAX_DELAY_MS,
          }
        )
      )
    )
  );
}
