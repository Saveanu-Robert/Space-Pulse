export const NASA_BASE_URLS = {
  APOD: 'https://api.nasa.gov/planetary/apod',
  DONKI_FLR: 'https://api.nasa.gov/DONKI/FLR',
  DONKI_CME: 'https://api.nasa.gov/DONKI/CME',
  DONKI_GST: 'https://api.nasa.gov/DONKI/GST',
  DONKI_NOTIFICATIONS: 'https://api.nasa.gov/DONKI/notifications',
  NEOWS_FEED: 'https://api.nasa.gov/neo/rest/v1/feed',
  EONET_EVENTS: 'https://eonet.gsfc.nasa.gov/api/v3/events',
} as const;

export const CACHE_CONFIG = {
  DEFAULT_TTL_MS: 55_000,
  STALE_WHILE_REVALIDATE_MS: 300_000,
  CLEANUP_INTERVAL_MS: 120_000,
} as const;

export const FETCH_CONFIG = {
  TIMEOUT_MS: 10_000,
  MAX_RETRIES: 2,
  RETRY_BASE_DELAY_MS: 500,
  RETRY_MAX_DELAY_MS: 3_000,
} as const;

export const CIRCUIT_BREAKER_CONFIG = {
  FAILURE_THRESHOLD: 5,
  RECOVERY_TIMEOUT_MS: 30_000,
} as const;

export const DONKI_DEFAULT_WINDOW_DAYS = 7;
export const NEOWS_DEFAULT_WINDOW_DAYS = 7;
export const EONET_DEFAULT_LIMIT = 50;

export const REFRESH_INTERVAL_MS = 60_000;

export const CHART_THEME = {
  colors: {
    flare: '#F59E0B',
    cme: '#8B5CF6',
    gst: '#EF4444',
    notification: '#3B82F6',
    hazardous: '#EF4444',
    safe: '#22C55E',
    neo: '#06B6D4',
  },
  axis: {
    stroke: 'rgba(255, 255, 255, 0.15)',
    tick: { fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 },
  },
  grid: {
    strokeDasharray: '3 3',
    stroke: 'rgba(255, 255, 255, 0.06)',
  },
  tooltip: {
    contentStyle: {
      backgroundColor: 'rgba(11, 18, 40, 0.95)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      color: '#fff',
      fontSize: '13px',
    },
  },
} as const;

export const MOTION = {
  sectionEntry: {
    initial: { opacity: 0, y: 20 } as const,
    whileInView: { opacity: 1, y: 0 } as const,
    viewport: { once: true, margin: '-50px' } as const,
    transition: { duration: 0.5, ease: 'easeOut' } as const,
  },
  cardHover: {
    whileHover: { y: -3 } as const,
    transition: { duration: 0.2, ease: 'easeOut' } as const,
  },
  staggerContainer: {
    initial: 'hidden' as const,
    whileInView: 'visible' as const,
    viewport: { once: true } as const,
    variants: {
      hidden: {},
      visible: { transition: { staggerChildren: 0.08 } },
    },
  },
  staggerItem: {
    variants: {
      hidden: { opacity: 0, y: 12 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    },
  },
} as const;

export const CATEGORY_COLORS: Record<string, string> = {
  wildfires: '#EF4444',
  volcanoes: '#F97316',
  severeStorms: '#8B5CF6',
  floods: '#3B82F6',
  earthquakes: '#F59E0B',
  drought: '#D97706',
  dustHaze: '#A78BFA',
  landslides: '#92400E',
  seaLakeIce: '#06B6D4',
  snow: '#E2E8F0',
  tempExtremes: '#DC2626',
  waterColor: '#0EA5E9',
  manmade: '#6B7280',
};
