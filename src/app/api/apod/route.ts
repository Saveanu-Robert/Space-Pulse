import { NextRequest } from 'next/server';
import { getAPOD } from '@/lib/nasa/services/apod.service';
import { jsonResponse, parseForceRefresh } from '@/lib/utils/http';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const force = parseForceRefresh(request);
  const result = await getAPOD(force);
  return jsonResponse(result, result.success ? 200 : 502);
}
