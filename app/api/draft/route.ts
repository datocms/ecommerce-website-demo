import { draftMode } from 'next/headers';
/**
 * Legacy draft enable endpoint
 * - Accepts `?secret=<token>&path=/en/home` and redirects to the path with
 *   preview cookies set. Intended for local testing from a simple link.
 * - For embedded editors/iframe flows prefer /api/draft/enable which handles
 *   cookie partitioning.
 */
import { NextResponse } from 'next/server';

/**
 * Enable draft mode from a simple link.
 *
 * Query parameters:
 * - `secret`: must match `DRAFT_SECRET_TOKEN`
 * - `path`: absolute path to redirect to after enabling (defaults to `/`)
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');
  const path = searchParams.get('path') || '/';

  if (!secret || secret !== process.env.DRAFT_SECRET_TOKEN) {
    return new NextResponse('Invalid secret', { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  const baseUrl = process.env.URL || 'http://localhost:3000';
  const url = new URL(path, baseUrl);

  return NextResponse.redirect(url);
}
