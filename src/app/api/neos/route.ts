import { NextRequest } from 'next/server';
import { getNEOs } from '@/lib/nasa/services/neos.service';
import { jsonResponse, parseForceRefresh } from '@/lib/utils/http';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const force = parseForceRefresh(request);
  const result = await getNEOs(force);
  return jsonResponse(result, result.success ? 200 : 502);
}
