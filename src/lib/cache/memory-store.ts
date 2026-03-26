import type { CacheEntry, CacheStore } from './types';

export class MemoryCacheStore implements CacheStore {
  private store = new Map<string, CacheEntry<unknown>>();
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;

  constructor(cleanupIntervalMs?: number) {
    if (cleanupIntervalMs) {
      this.cleanupTimer = setInterval(() => this.purgeExpired(), cleanupIntervalMs);
      if (this.cleanupTimer.unref) {
        this.cleanupTimer.unref();
      }
    }
  }

  get<T>(key: string): CacheEntry<T> | undefined {
    return this.store.get(key) as CacheEntry<T> | undefined;
  }

  set<T>(key: string, entry: CacheEntry<T>): void {
    this.store.set(key, entry as CacheEntry<unknown>);
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  clear(): void {
    this.store.clear();
  }

  private purgeExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      const maxAge = entry.ttlMs * 6; // Keep stale for up to ~5.5 min
      if (now - entry.createdAt > maxAge) {
        this.store.delete(key);
      }
    }
  }
}
