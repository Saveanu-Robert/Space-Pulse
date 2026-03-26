import { NextResponse } from 'next/server';
import type { ApiResponse } from '@/types/common';

export function jsonResponse<T>(data: ApiResponse<T>, status: number = 200): NextResponse {
  return NextResponse.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Source-Status': data.metadata.sourceStatus,
    },
  });
}

export function parseForceRefresh(request: Request): boolean {
  const url = new URL(request.url);
  return url.searchParams.get('force') === '1';
}

export function errorResponse(message: string, status: number = 500): NextResponse {
  const body: ApiResponse<null> = {
    success: false,
    data: null,
    error: process.env.NODE_ENV === 'development' ? message : 'Internal server error',
    metadata: {
      lastUpdated: new Date().toISOString(),
      fetchedAt: new Date().toISOString(),
      isStale: false,
      sourceStatus: 'error',
    },
  };
  return NextResponse.json(body, { status });
}
