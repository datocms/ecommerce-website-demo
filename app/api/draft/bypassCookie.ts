import { cookies } from 'next/headers';

const BYPASS_COOKIE = '__prerender_bypass';

/**
 * DatoCMS shows the site in an iframe, where browsers only send SameSite=None; Secure cookies:
 * reissues the draft-mode cookie Next.js has just set or cleared with those attributes.
 */
export async function reissueDraftCookieForIframes(
  options: { partitioned?: boolean } = {},
) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: BYPASS_COOKIE,
    value: cookieStore.get(BYPASS_COOKIE)?.value ?? '',
    httpOnly: true,
    path: '/',
    secure: true,
    sameSite: 'none',
    ...options,
  });
}
