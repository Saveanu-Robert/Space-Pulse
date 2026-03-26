import { format, subDays } from 'date-fns';
import { nasaFetch } from './base-fetcher';
import {
  NasaDonkiFLRSchema, type NasaDonkiFLRItem,
  NasaDonkiCMESchema, type NasaDonkiCMEItem,
  NasaDonkiGSTSchema, type NasaDonkiGSTItem,
  NasaDonkiNotificationsSchema, type NasaDonkiNotificationItem,
} from '@/lib/schemas/donki.schema';
import { NASA_BASE_URLS, DONKI_DEFAULT_WINDOW_DAYS } from '@/lib/config/constants';

function dateRange(days: number = DONKI_DEFAULT_WINDOW_DAYS) {
  const end = new Date();
  const start = subDays(end, days);
  return {
    startDate: format(start, 'yyyy-MM-dd'),
    endDate: format(end, 'yyyy-MM-dd'),
  };
}

export function fetchFLR(days?: number): Promise<NasaDonkiFLRItem[]> {
  const { startDate, endDate } = dateRange(days);
  return nasaFetch('donki-flr', NASA_BASE_URLS.DONKI_FLR, NasaDonkiFLRSchema, { startDate, endDate });
}

export function fetchCME(days?: number): Promise<NasaDonkiCMEItem[]> {
  const { startDate, endDate } = dateRange(days);
  return nasaFetch('donki-cme', NASA_BASE_URLS.DONKI_CME, NasaDonkiCMESchema, { startDate, endDate });
}

export function fetchGST(days?: number): Promise<NasaDonkiGSTItem[]> {
  const { startDate, endDate } = dateRange(days);
  return nasaFetch('donki-gst', NASA_BASE_URLS.DONKI_GST, NasaDonkiGSTSchema, { startDate, endDate });
}

export function fetchNotifications(days?: number): Promise<NasaDonkiNotificationItem[]> {
  const { startDate, endDate } = dateRange(days);
  return nasaFetch('donki-notifications', NASA_BASE_URLS.DONKI_NOTIFICATIONS, NasaDonkiNotificationsSchema, {
    startDate,
    endDate,
    type: 'all',
  });
}
