import type { NasaApodRaw } from '@/lib/schemas/apod.schema';
import type { APODSummary } from '@/types/apod';
import { sanitizeText } from '@/lib/utils/sanitize';

export function mapRawAPOD(raw: NasaApodRaw): APODSummary {
  const isVideo = raw.media_type === 'video';

  return {
    title: sanitizeText(raw.title),
    date: raw.date,
    mediaType: isVideo ? 'video' : 'image',
    imageUrl: isVideo ? null : raw.url,
    hdImageUrl: isVideo ? null : (raw.hdurl ?? null),
    videoUrl: isVideo ? raw.url : null,
    thumbnailUrl: raw.thumbnail_url ?? null,
    explanation: sanitizeText(raw.explanation),
    copyright: raw.copyright ? sanitizeText(raw.copyright) : null,
  };
}
