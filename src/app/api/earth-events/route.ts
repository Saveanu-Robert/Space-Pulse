import { NextRequest } from 'next/server';
import { getEarthEvents } from '@/lib/nasa/services/earth-events.service';
import { jsonResponse, parseForceRefresh } from '@/lib/utils/http';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const force = parseForceRefresh(request);
  const result = await getEarthEvents(force);
  return jsonResponse(result, result.success ? 200 : 502);
}
