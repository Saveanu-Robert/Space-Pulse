import { format, subDays } from 'date-fns';
import { nasaFetch } from './base-fetcher';
import { NasaNeoWsFeedSchema, type NasaNeoWsFeed } from '@/lib/schemas/neows.schema';
import { NASA_BASE_URLS, NEOWS_DEFAULT_WINDOW_DAYS } from '@/lib/config/constants';

export function fetchNEOFeed(days: number = NEOWS_DEFAULT_WINDOW_DAYS): Promise<NasaNeoWsFeed> {
  const end = new Date();
  const start = subDays(end, Math.min(days, 7) - 1); // NeoWs max 7 calendar days
  return nasaFetch<NasaNeoWsFeed>('neows', NASA_BASE_URLS.NEOWS_FEED, NasaNeoWsFeedSchema, {
    start_date: format(start, 'yyyy-MM-dd'),
    end_date: format(end, 'yyyy-MM-dd'),
  });
}
