export interface CacheEntry<T> {
  data: T;
  createdAt: number;
  ttlMs: number;
  lastUpdated: string;
}

export interface CacheMeta {
  createdAt: number;
  age: number;
  ttlMs: number;
  isFresh: boolean;
  isStale: boolean;
  lastUpdated: string;
}

export interface CacheStore {
  get<T>(key: string): CacheEntry<T> | undefined;
  set<T>(key: string, entry: CacheEntry<T>): void;
  delete(key: string): void;
  has(key: string): boolean;
  clear(): void;
}

export interface CacheManagerOptions {
  ttlMs?: number;
  forceRefresh?: boolean;
}
