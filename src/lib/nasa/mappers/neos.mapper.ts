import type { NasaNeoWsFeed } from '@/lib/schemas/neows.schema';
import type { NEOSummary, NEOApproach } from '@/types/neos';

export function mapNEOFeed(raw: NasaNeoWsFeed): NEOSummary {
  const approaches: NEOApproach[] = [];

  for (const [, neos] of Object.entries(raw.near_earth_objects)) {
    for (const neo of neos) {
      for (const approach of neo.close_approach_data) {
        approaches.push({
          id: neo.id,
          name: cleanNEOName(neo.name),
          closeApproachDate: approach.close_approach_date,
          hazardous: neo.is_potentially_hazardous_asteroid,
          missDistanceKm: parseFloat(approach.miss_distance.kilometers),
          missDistanceLunar: parseFloat(approach.miss_distance.lunar),
          velocityKph: parseFloat(approach.relative_velocity.kilometers_per_hour),
          diameterMinM: neo.estimated_diameter.meters.estimated_diameter_min,
          diameterMaxM: neo.estimated_diameter.meters.estimated_diameter_max,
          nasaJplUrl: neo.nasa_jpl_url,
        });
      }
    }
  }

  approaches.sort((a, b) => {
    const dateDiff = a.closeApproachDate.localeCompare(b.closeApproachDate);
    if (dateDiff !== 0) return dateDiff;
    return a.missDistanceKm - b.missDistanceKm;
  });

  return {
    totalUpcoming: approaches.length,
    hazardousCount: approaches.filter((a) => a.hazardous).length,
    approaches,
  };
}

function cleanNEOName(name: string): string {
  return name.replace(/^\(|\)$/g, '').trim();
}
