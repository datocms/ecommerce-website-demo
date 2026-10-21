/**
 * True when `candidate` resolves to the request's hostname, so draft-mode redirects can't be used
 * as an open redirect (this also rejects `//evil.com` and `/\evil.com`).
 */
export function isSafeRedirectUrl(candidate: string, requestUrl: URL): boolean {
  try {
    const target = new URL(candidate, requestUrl);
    return target.hostname === requestUrl.hostname;
  } catch {
    return false;
  }
}
