// Opened by Web Previews / Visual Editing, the preview links and the draft-mode token form

import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { isSafeRedirectUrl } from '@/lib/isSafeRedirectUrl';
import { reissueDraftCookieForIframes } from '../bypassCookie';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const token = requestUrl.searchParams.get('token');
  const redirectUrl = requestUrl.searchParams.get('redirect');

  if (token !== process.env.DRAFT_SECRET_TOKEN)
    return new Response('Invalid token', { status: 401 });

  const draft = await draftMode();
  draft.enable();

  if (!redirectUrl) return new Response('Draft mode is enabled');

  if (!isSafeRedirectUrl(redirectUrl, requestUrl))
    return new Response('Redirect must point to this site', { status: 422 });

  await reissueDraftCookieForIframes({ partitioned: true });

  redirect(redirectUrl);
}
