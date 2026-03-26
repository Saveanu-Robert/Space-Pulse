import { nasaFetch } from './base-fetcher';
import { NasaApodRawSchema, type NasaApodRaw } from '@/lib/schemas/apod.schema';
import { NASA_BASE_URLS } from '@/lib/config/constants';

export function fetchAPOD(): Promise<NasaApodRaw> {
  return nasaFetch<NasaApodRaw>('apod', NASA_BASE_URLS.APOD, NasaApodRawSchema);
}
