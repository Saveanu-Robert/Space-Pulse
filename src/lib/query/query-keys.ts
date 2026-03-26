export const queryKeys = {
  all: ['space-pulse'] as const,
  dashboard: {
    overview: ['space-pulse', 'dashboard', 'overview'] as const,
  },
  apod: {
    root: ['space-pulse', 'apod'] as const,
    gallery: ['space-pulse', 'apod', 'gallery'] as const,
  },
  spaceWeather: {
    root: ['space-pulse', 'space-weather'] as const,
  },
  neos: {
    root: ['space-pulse', 'neos'] as const,
  },
  earthEvents: {
    root: ['space-pulse', 'earth-events'] as const,
  },
} as const;
