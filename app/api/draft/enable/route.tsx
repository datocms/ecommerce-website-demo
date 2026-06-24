import { cookies, draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { isSafeRedirectUrl } from '@/utils/isSafeRedirectUrl';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const { searchParams } = requestUrl;

  const token = searchParams.get('token');
  const url = searchParams.get('redirect');

  if (token !== process.env.DRAFT_SECRET_TOKEN)
    return new Response('Invalid token', { status: 401 });

  const draft = await draftMode();
  draft.enable();

  if (!url) return new Response('Draft mode is enabled');

  if (!isSafeRedirectUrl(url, requestUrl))
    return new Response('URL must be relative!', { status: 422 });

  //to avoid losing the cookie on redirect in the iFrame
  const cookieStore = await cookies();
  const cookie = cookieStore.get('__prerender_bypass')!;
  cookieStore.set({
    name: '__prerender_bypass',
    value: cookie?.value,
    httpOnly: true,
    path: '/',
    secure: true,
    sameSite: 'none',
    partitioned: true,
  });

  redirect(url);
}
