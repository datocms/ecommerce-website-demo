// Called by the cache-revalidation webhook created in /api/post-install

import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { hasBearerToken } from '@/lib/hasBearerToken';

export async function POST(request: NextRequest) {
  // The webhook sends the token as a request header (see /api/post-install)
  if (!hasBearerToken(request, process.env.CACHE_INVALIDATION_SECRET_TOKEN)) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    // Every published query is tagged "datocms" (lib/datocms/queryDatoCMS.ts); "max" serves the
    // stale page while it regenerates
    revalidateTag('datocms', 'max');
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }

  return NextResponse.json({ status: 'Cache Cleared' });
}
