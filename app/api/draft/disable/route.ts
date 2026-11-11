// Opened by the draft-mode toggle and the "Published version" preview link

import { cookies, draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { isSafeRedirectUrl } from '@/lib/isSafeRedirectUrl';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const { searchParams } = requestUrl;

  const url = searchParams.get('redirect');

  const draft = await draftMode();
  draft.disable();

  if (!url) return new Response('Draft mode is disabled');

  if (!isSafeRedirectUrl(url, requestUrl))
    return new Response('Redirect must point to this site', { status: 422 });

  // DatoCMS shows the site in an iframe: reissue the cleared cookie as SameSite=None; Secure
  const cookieStore = await cookies();
  const cookie = cookieStore.get('__prerender_bypass')!;
  cookieStore.set({
    name: '__prerender_bypass',
    value: cookie?.value,
    httpOnly: true,
    path: '/',
    secure: true,
    sameSite: 'none',
  });

  redirect(url);
}
