/**
 * Draft enable endpoint for embedded flows
 * - Accepts `?token=<secret>&url=/en/home`.
 * - Enables Next.js preview cookies and redirects back to `url`.
 * - Re-sets `__prerender_bypass` as a partitioned cookie to avoid losing it
 *   when this endpoint is called inside an iframe (DatoCMS editor preview).
 */
import { cookies, draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const token = searchParams.get('token');
  const url = searchParams.get('url');

  if (token !== process.env.DRAFT_SECRET_TOKEN)
    return new Response('Invalid token', { status: 401 });

  const draft = await draftMode();
  draft.enable();

  if (!url) return new Response('Draft mode is enabled');

  const siteUrl = process.env.URL || 'http://localhost:3000';
  const redirectUrl = new URL(url, siteUrl);

  // Mark the URL so the editor knows it is in editable mode (optional).
  if (!redirectUrl.searchParams.has('edit')) {
    redirectUrl.searchParams.set('edit', '1');
  }

  // Avoid losing the cookie on redirect inside an iframe by re-setting it with
  // `partitioned: true` (Chrome) and SameSite=None.
  const cookieStore = await cookies();
  const cookie = cookieStore.get('__prerender_bypass');
  if (cookie?.value) {
    cookieStore.set({
      name: '__prerender_bypass',
      value: cookie.value,
      httpOnly: true,
      path: '/',
      secure: true,
      sameSite: 'none',
      partitioned: true,
    });
  }

  redirect(redirectUrl.toString());
}
