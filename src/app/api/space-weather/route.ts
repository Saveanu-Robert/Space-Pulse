import { NextRequest } from 'next/server';
import { getSpaceWeather } from '@/lib/nasa/services/space-weather.service';
import { jsonResponse, parseForceRefresh } from '@/lib/utils/http';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const force = parseForceRefresh(request);
  const url = new URL(request.url);
  const days = parseInt(url.searchParams.get('days') ?? '7', 10);
  const safeDays = [1, 7, 30].includes(days) ? days : 7;
  const result = await getSpaceWeather(force, safeDays);
  return jsonResponse(result, result.success ? 200 : 502);
}
