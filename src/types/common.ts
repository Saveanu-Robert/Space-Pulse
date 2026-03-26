export type SourceStatus = 'ok' | 'stale' | 'error' | 'unavailable';
export type Severity = 'low' | 'moderate' | 'high' | 'extreme';

export interface FreshnessMetadata {
  lastUpdated: string;
  fetchedAt: string;
  isStale: boolean;
  sourceStatus: SourceStatus;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  metadata: FreshnessMetadata;
}
