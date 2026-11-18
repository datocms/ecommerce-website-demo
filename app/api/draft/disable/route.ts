// Opened by the draft-mode toggle and the "Published version" preview link

import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { isSafeRedirectUrl } from '@/lib/isSafeRedirectUrl';
import { reissueDraftCookieForIframes } from '../bypassCookie';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const redirectUrl = requestUrl.searchParams.get('redirect');

  const draft = await draftMode();
  draft.disable();

  if (!redirectUrl) return new Response('Draft mode is disabled');

  if (!isSafeRedirectUrl(redirectUrl, requestUrl))
    return new Response('Redirect must point to this site', { status: 422 });

  await reissueDraftCookieForIframes();

  redirect(redirectUrl);
}
