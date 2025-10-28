/**
 * Draft disable endpoint
 * - Accepts `?url=/en/home` and clears preview cookies.
 * - Mirrors /api/draft/enable’s cookie handling for iframe safety.
 */
import { cookies, draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Disable Next draft-mode and redirect back to the provided URL.
 *
 * Query parameters:
 * - `url`: absolute path to redirect to after disabling
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const url = searchParams.get('url');

  const draft = await draftMode();
  draft.disable();

  if (!url) return new Response('Draft mode is disabled');

  // Avoid losing the cookie on redirect in an iframe; see enable route.
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
    });
  }

  redirect(url);
}
