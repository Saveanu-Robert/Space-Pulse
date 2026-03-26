import { NextRequest } from 'next/server';
import { getAPODGallery } from '@/lib/nasa/services/apod-gallery.service';
import { jsonResponse, parseForceRefresh } from '@/lib/utils/http';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const force = parseForceRefresh(request);
  const result = await getAPODGallery(12, force);
  return jsonResponse(result, result.success ? 200 : 502);
}
