import { CACHE_CONFIG } from '../config/constants';
import type { CacheEntry, CacheMeta, CacheManagerOptions, CacheStore } from './types';
import { MemoryCacheStore } from './memory-store';
import { logger } from '../observability/logger';

const defaultStore = new MemoryCacheStore(CACHE_CONFIG.CLEANUP_INTERVAL_MS);

export class CacheManager {
  constructor(private store: CacheStore = defaultStore) {}

  getMeta(key: string): CacheMeta | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    const age = Date.now() - entry.createdAt;
    return {
      createdAt: entry.createdAt,
      age,
      ttlMs: entry.ttlMs,
      isFresh: age <= entry.ttlMs,
      isStale: age > entry.ttlMs,
      lastUpdated: entry.lastUpdated,
    };
  }

  get<T>(key: string): { data: T; meta: CacheMeta } | null {
    const entry = this.store.get<T>(key);
    if (!entry) return null;
    const meta = this.getMeta(key)!;
    return { data: entry.data, meta };
  }

  set<T>(key: string, data: T, ttlMs: number = CACHE_CONFIG.DEFAULT_TTL_MS): void {
    const entry: CacheEntry<T> = {
      data,
      createdAt: Date.now(),
      ttlMs,
      lastUpdated: new Date().toISOString(),
    };
    this.store.set(key, entry);
  }

  async getOrLoad<T>(
    key: string,
    loader: () => Promise<T>,
    options: CacheManagerOptions = {}
  ): Promise<{ data: T; isStale: boolean; lastUpdated: string; fetchedAt: string }> {
    const ttl = options.ttlMs ?? CACHE_CONFIG.DEFAULT_TTL_MS;
    const force = options.forceRefresh ?? false;

    if (!force) {
      const cached = this.get<T>(key);
      if (cached && cached.meta.isFresh) {
        logger.debug('cache', `HIT (fresh) for key: ${key}`);
        return {
          data: cached.data,
          isStale: false,
          lastUpdated: cached.meta.lastUpdated,
          fetchedAt: cached.meta.lastUpdated,
        };
      }
    }

    try {
      const freshData = await loader();
      this.set(key, freshData, ttl);
      const now = new Date().toISOString();
      logger.debug('cache', `MISS/REFRESH for key: ${key}`);
      return { data: freshData, isStale: false, lastUpdated: now, fetchedAt: now };
    } catch (error) {
      const stale = this.get<T>(key);
      if (stale) {
        logger.warn('cache', `Loader failed for key: ${key}, serving STALE data`, {
          error: error instanceof Error ? error.message : String(error),
        });
        return {
          data: stale.data,
          isStale: true,
          lastUpdated: stale.meta.lastUpdated,
          fetchedAt: stale.meta.lastUpdated,
        };
      }
      throw error;
    }
  }
}

export const cacheManager = new CacheManager();
