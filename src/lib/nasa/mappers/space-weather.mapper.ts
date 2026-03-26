import type { NasaDonkiFLRItem, NasaDonkiCMEItem, NasaDonkiGSTItem, NasaDonkiNotificationItem } from '@/lib/schemas/donki.schema';
import type {
  SpaceWeatherSummary,
  SpaceWeatherCounts,
  TimelineItem,
  SpaceWeatherChartDataPoint,
  NotificationItem,
} from '@/types/space-weather';
import type { Severity } from '@/types/common';
import { format, parseISO } from 'date-fns';
import { sanitizeText } from '@/lib/utils/sanitize';

interface SpaceWeatherRawData {
  flares: NasaDonkiFLRItem[];
  cmes: NasaDonkiCMEItem[];
  geomagneticStorms: NasaDonkiGSTItem[];
  notifications: NasaDonkiNotificationItem[];
}

export function mapSpaceWeather(raw: SpaceWeatherRawData): SpaceWeatherSummary {
  const counts: SpaceWeatherCounts = {
    flares: raw.flares.length,
    cmes: raw.cmes.length,
    geomagneticStorms: raw.geomagneticStorms.length,
    notifications: raw.notifications.length,
  };

  const timeline = buildTimeline(raw);
  const chartData = buildChartData(raw);
  const notifications = buildNotifications(raw.notifications);

  return { counts, timeline, chartData, notifications };
}

function classToSeverity(classType: string | null | undefined): Severity {
  if (!classType) return 'low';
  const upper = classType.toUpperCase();
  if (upper.startsWith('X')) return 'extreme';
  if (upper.startsWith('M')) return 'high';
  if (upper.startsWith('C')) return 'moderate';
  return 'low';
}

function kpToSeverity(kpIndex: number): Severity {
  if (kpIndex >= 8) return 'extreme';
  if (kpIndex >= 6) return 'high';
  if (kpIndex >= 4) return 'moderate';
  return 'low';
}

function buildTimeline(raw: SpaceWeatherRawData): TimelineItem[] {
  const items: TimelineItem[] = [];

  for (const flr of raw.flares) {
    items.push({
      id: flr.flrID,
      type: 'FLR',
      title: `Solar Flare ${flr.classType ?? ''}`.trim(),
      date: flr.beginTime,
      severity: classToSeverity(flr.classType),
      sourceUrl: flr.link ?? null,
      details: flr.sourceLocation ? `Source: ${flr.sourceLocation}` : null,
    });
  }

  for (const cme of raw.cmes) {
    const speed = cme.cmeAnalyses?.[0]?.speed;
    items.push({
      id: cme.activityID,
      type: 'CME',
      title: `Coronal Mass Ejection${speed ? ` (${speed} km/s)` : ''}`,
      date: cme.startTime,
      severity: speed && speed > 1000 ? 'extreme' : speed && speed > 500 ? 'high' : 'moderate',
      sourceUrl: cme.link ?? null,
      details: cme.note ?? null,
    });
  }

  for (const gst of raw.geomagneticStorms) {
    const maxKp = gst.allKpIndex?.reduce((max, kp) => Math.max(max, kp.kpIndex), 0) ?? 0;
    items.push({
      id: gst.gstID,
      type: 'GST',
      title: `Geomagnetic Storm (Kp ${maxKp})`,
      date: gst.startTime,
      severity: kpToSeverity(maxKp),
      sourceUrl: gst.link ?? null,
      details: maxKp ? `Maximum Kp index: ${maxKp}` : null,
    });
  }

  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return items;
}

function buildNotifications(raw: NasaDonkiNotificationItem[]): NotificationItem[] {
  return raw
    .map((n) => ({
      id: n.messageID,
      type: n.messageType,
      issueTime: n.messageIssueTime,
      body: sanitizeText(n.messageBody).slice(0, 500),
      url: n.messageURL ?? null,
    }))
    .sort((a, b) => new Date(b.issueTime).getTime() - new Date(a.issueTime).getTime());
}

function buildChartData(raw: SpaceWeatherRawData): SpaceWeatherChartDataPoint[] {
  const dateMap = new Map<string, SpaceWeatherChartDataPoint>();

  const ensureDate = (dateStr: string) => {
    try {
      const day = format(parseISO(dateStr), 'yyyy-MM-dd');
      if (!dateMap.has(day)) {
        dateMap.set(day, { date: day, flares: 0, cmes: 0, geomagneticStorms: 0 });
      }
      return day;
    } catch {
      return null;
    }
  };

  for (const flr of raw.flares) {
    const day = ensureDate(flr.beginTime);
    if (day) dateMap.get(day)!.flares++;
  }

  for (const cme of raw.cmes) {
    const day = ensureDate(cme.startTime);
    if (day) dateMap.get(day)!.cmes++;
  }

  for (const gst of raw.geomagneticStorms) {
    const day = ensureDate(gst.startTime);
    if (day) dateMap.get(day)!.geomagneticStorms++;
  }

  return Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));
}
