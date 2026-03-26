import { NextRequest } from 'next/server';
import { getDashboardOverview } from '@/lib/nasa/services/dashboard.service';
import { jsonResponse, parseForceRefresh } from '@/lib/utils/http';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const force = parseForceRefresh(request);
  const result = await getDashboardOverview(force);
  return jsonResponse(result, 200); // Always 200 for partial responses
}
