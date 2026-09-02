import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  // The token is sent by the webhook as a request header (see /api/post-install)
  const token = req.headers.get('authorization')?.replace(/^Bearer /, '');

  if (!token || token !== process.env.CACHE_INVALIDATION_SECRET_TOKEN) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
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
