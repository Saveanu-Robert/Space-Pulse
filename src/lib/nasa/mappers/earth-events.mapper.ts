import type { NasaEONETResponse, NasaEONETEvent } from '@/lib/schemas/eonet.schema';
import type { EarthEventsSummary, EarthEvent, EventCategorySummary } from '@/types/earth-events';
import { sanitizeText } from '@/lib/utils/sanitize';
import type { EventGeometry } from '@/types/earth-events';

function extractGeometry(geo: { type: string; coordinates: unknown; magnitudeValue?: number | null; magnitudeUnit?: string | null }): EventGeometry | null {
  let coords: [number, number] | null = null;

  if (geo.type === 'Point' && Array.isArray(geo.coordinates)) {
    const c = geo.coordinates;
    if (typeof c[0] === 'number' && typeof c[1] === 'number' && isFinite(c[0]) && isFinite(c[1])) {
      coords = [c[0], c[1]];
    }
  } else if (geo.type === 'Polygon' && Array.isArray(geo.coordinates)) {
    // For Polygon, take centroid of first ring
    const ring = Array.isArray(geo.coordinates[0]) ? geo.coordinates[0] : [];
    if (ring.length > 0 && Array.isArray(ring[0]) && ring[0].length >= 2) {
      const lngs = ring.map((p: number[]) => p[0]).filter(isFinite);
      const lats = ring.map((p: number[]) => p[1]).filter(isFinite);
      if (lngs.length > 0 && lats.length > 0) {
        coords = [lngs.reduce((a: number, b: number) => a + b, 0) / lngs.length, lats.reduce((a: number, b: number) => a + b, 0) / lats.length];
      }
    }
  }

  if (!coords) return null;

  return {
    type: geo.type,
    coordinates: coords,
    magnitudeValue: geo.magnitudeValue ?? null,
    magnitudeUnit: geo.magnitudeUnit ?? null,
  };
}

export function mapEONETEvents(raw: NasaEONETResponse): EarthEventsSummary {
  const events: EarthEvent[] = raw.events.map(mapSingleEvent);

  const categoryMap = new Map<string, { id: string; title: string; count: number }>();
  for (const event of events) {
    const cat = event.category;
    const existing = categoryMap.get(cat.id);
    if (existing) {
      existing.count++;
    } else {
      categoryMap.set(cat.id, { id: cat.id, title: cat.title, count: 1 });
    }
  }

  const categories: EventCategorySummary[] = Array.from(categoryMap.values())
    .sort((a, b) => b.count - a.count);

  return {
    totalOpenEvents: events.length,
    categories,
    events,
  };
}

function mapSingleEvent(raw: NasaEONETEvent): EarthEvent {
  const latestGeo = raw.geometry
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  return {
    id: raw.id,
    title: sanitizeText(raw.title),
    description: raw.description ? sanitizeText(raw.description) : null,
    category: raw.categories[0] ?? { id: 'unknown', title: 'Unknown' },
    isClosed: raw.closed !== null && raw.closed !== undefined,
    closedDate: raw.closed ?? null,
    date: latestGeo?.date ?? null,
    geometry: latestGeo
      ? extractGeometry(latestGeo)
      : null,
    sources: raw.sources.map((s) => ({ id: s.id, url: s.url })),
    link: raw.link,
  };
}
