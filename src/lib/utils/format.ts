import { format, formatDistanceToNow, parseISO } from 'date-fns';

export function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'MMM d, yyyy');
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'MMM d, yyyy HH:mm');
  } catch {
    return dateStr;
  }
}

export function formatRelativeTime(dateStr: string): string {
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
}

export function formatNumber(num: number, decimals: number = 0): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toFixed(decimals);
}

export function formatDistance(km: number): string {
  if (km >= 1_000_000) {
    return `${(km / 1_000_000).toFixed(2)}M km`;
  }
  if (km >= 1_000) {
    return `${(km / 1_000).toFixed(1)}K km`;
  }
  return `${km.toFixed(0)} km`;
}

export function formatVelocity(kph: number): string {
  return `${formatNumber(kph, 0)} km/h`;
}

export function formatDiameter(minM: number, maxM: number): string {
  if (maxM < 1) {
    return `${(minM * 100).toFixed(0)}-${(maxM * 100).toFixed(0)} cm`;
  }
  return `${minM.toFixed(0)}-${maxM.toFixed(0)} m`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '...';
}
