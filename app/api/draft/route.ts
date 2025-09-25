import { NextResponse } from 'next/server';
import { draftMode } from 'next/headers';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');
  const path = searchParams.get('path') || '/';

  if (!secret || secret !== process.env.DRAFT_SECRET_TOKEN) {
    return new NextResponse('Invalid secret', { status: 401 });
  }

  draftMode().enable();

  const baseUrl = process.env.URL || 'http://localhost:3000';
  const url = new URL(path, baseUrl);

  if (!url.searchParams.has('edit')) {
    url.searchParams.set('edit', '1');
  }

  return NextResponse.redirect(url);
}
