// Opened by the draft-mode toggle and the "Published version" preview link

import { cookies, draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { isSafeRedirectUrl } from '@/lib/isSafeRedirectUrl';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const { searchParams } = requestUrl;

  const url = searchParams.get('redirect');

  const draft = await draftMode();
  draft.disable();

  if (!url) return new Response('Draft mode is disabled');

  if (!isSafeRedirectUrl(url, requestUrl))
    return new Response('Redirect must point to this site', { status: 422 });

  // Reissued as SameSite=None; Secure so the cleared cookie survives the redirect inside the
  // DatoCMS iframe
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
