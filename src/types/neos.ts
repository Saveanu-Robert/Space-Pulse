export interface NEOApproach {
  id: string;
  name: string;
  closeApproachDate: string;
  hazardous: boolean;
  missDistanceKm: number;
  missDistanceLunar: number;
  velocityKph: number;
  diameterMinM: number;
  diameterMaxM: number;
  nasaJplUrl: string;
}

export interface NEOSummary {
  totalUpcoming: number;
  hazardousCount: number;
  approaches: NEOApproach[];
}
