import { cookies, draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const token = searchParams.get('token');
  const url = searchParams.get('url');

  if (token !== process.env.DRAFT_SECRET_TOKEN)
    return new Response('Invalid token', { status: 401 });

  draftMode().enable();

  if (!url) return new Response('Draft mode is enabled');

  const siteUrl = process.env.URL || 'http://localhost:3000';
  const redirectUrl = new URL(url, siteUrl);

  if (!redirectUrl.searchParams.has('edit')) {
    redirectUrl.searchParams.set('edit', '1');
  }

  //to avoid losing the cookie on redirect in the iFrame
  const cookieStore = cookies();
  const cookie = cookieStore.get('__prerender_bypass')!;
  cookies().set({
    name: '__prerender_bypass',
    value: cookie?.value,
    httpOnly: true,
    path: '/',
    secure: true,
    sameSite: 'none',
    partitioned: true,
  });

  redirect(redirectUrl.toString());
}
