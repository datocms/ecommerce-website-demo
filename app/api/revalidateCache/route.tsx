// Called by the cache-revalidation webhook created in /api/post-install

import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  // The token is sent by the webhook as a request header (see /api/post-install)
  const token = request.headers.get('authorization')?.replace(/^Bearer /, '');

  if (!token || token !== process.env.CACHE_INVALIDATION_SECRET_TOKEN) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    // Every published CDA request is tagged "datocms" (lib/datocms/queryDatoCMS.ts); draft
    // requests are never cached. "max" serves the stale page while it regenerates.
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
