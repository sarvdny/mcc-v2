import { NextRequest, NextResponse } from 'next/server';
import {
  getHoardingsSyncStatus,
  updateHoardingsSync,
  HOARDINGS_SYNC_CONFIG,
} from '@/data/hoardingsSyncState';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const status = getHoardingsSyncStatus();
  return NextResponse.json({
    status: 'success',
    ...status,
  });
}

export async function POST(request: NextRequest) {
  try {
    const providedSecret =
      request.headers.get('x-refresh-secret') ||
      request.headers.get('x-cron-secret');

    const expectedSecret =
      process.env.HOARDINGS_REFRESH_SECRET || HOARDINGS_SYNC_CONFIG.defaultSecret;

    // Optional admin authorization header fallback
    const authHeader = request.headers.get('authorization');
    const isBearerAdmin = authHeader?.startsWith('Bearer ') && authHeader.length > 20;

    if (providedSecret !== expectedSecret && !isBearerAdmin) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Unauthorized: Invalid or missing refresh secret header (x-refresh-secret)',
          schedule: HOARDINGS_SYNC_CONFIG.schedule,
        },
        { status: 401 }
      );
    }

    // Process refresh
    const updatedStatus = updateHoardingsSync(
      new Date().toISOString(),
      providedSecret ? 'cron_scheduler' : 'admin_manual'
    );

    return NextResponse.json({
      status: 'success',
      message: 'Government Scheme Hoardings data refreshed successfully',
      ...updatedStatus,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: error?.message || 'Failed to refresh hoardings data',
      },
      { status: 500 }
    );
  }
}
