import { cookies, draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { isSafeRedirectUrl } from '@/utils/isSafeRedirectUrl';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const { searchParams } = requestUrl;

  const url = searchParams.get('redirect');

  const draft = await draftMode();
  draft.disable();

  if (!url) return new Response('Draft mode is disabled');

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
  });

  redirect(url);
}
