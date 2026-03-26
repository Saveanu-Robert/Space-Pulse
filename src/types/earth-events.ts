export interface EventCategorySummary {
  id: string;
  title: string;
  count: number;
}

export interface EventGeometry {
  type: string;
  coordinates: [number, number]; // [longitude, latitude] GeoJSON convention
  magnitudeValue: number | null;
  magnitudeUnit: string | null;
}

export interface EventSource {
  id: string;
  url: string;
}

export interface EarthEvent {
  id: string;
  title: string;
  description: string | null;
  category: { id: string; title: string };
  isClosed: boolean;
  closedDate: string | null;
  date: string | null;
  geometry: EventGeometry | null;
  sources: EventSource[];
  link: string;
}

export interface EarthEventsSummary {
  totalOpenEvents: number;
  categories: EventCategorySummary[];
  events: EarthEvent[];
}
