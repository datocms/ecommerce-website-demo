// Opened by Web Previews / Visual Editing, the preview links and the draft-mode token form

import { cookies, draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { isSafeRedirectUrl } from '@/lib/isSafeRedirectUrl';

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
    return new Response('Redirect must point to this site', { status: 422 });

  // DatoCMS shows the site in an iframe (a third-party context), so the draft cookie is reissued
  // as SameSite=None; Secure; Partitioned to survive the redirect
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
