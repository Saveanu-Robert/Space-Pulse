import type { Severity } from './common';

export interface SpaceWeatherCounts {
  flares: number;
  cmes: number;
  geomagneticStorms: number;
  notifications: number;
}

export interface TimelineItem {
  id: string;
  type: 'FLR' | 'CME' | 'GST';
  title: string;
  date: string;
  severity: Severity;
  sourceUrl: string | null;
  details: string | null;
}

export interface SpaceWeatherChartDataPoint {
  date: string;
  flares: number;
  cmes: number;
  geomagneticStorms: number;
}

export interface NotificationItem {
  id: string;
  type: string;
  issueTime: string;
  body: string;
  url: string | null;
}

export interface SpaceWeatherSummary {
  counts: SpaceWeatherCounts;
  timeline: TimelineItem[];
  chartData: SpaceWeatherChartDataPoint[];
  notifications: NotificationItem[];
}
