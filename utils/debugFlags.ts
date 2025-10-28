// Lightweight helpers to toggle debug logs without code changes.

/**
 * Whether client-side image debug logging is enabled.
 *
 * Enabled by default in development. In production, checks (in order):
 * - `?debugImages=1` query string
 * - `localStorage['debug:images']` equals `1` or `true`
 * - `NEXT_PUBLIC_DEBUG_IMAGES` env var equals `1` (inlined at build time)
 */
export function isClientImageDebugEnabled(): boolean {
  // Always on in development.
  if (process.env.NODE_ENV !== 'production') return true;
  if (typeof window === 'undefined') return false;
  try {
    const qs = new URL(window.location.href).searchParams;
    if (qs.get('debugImages') === '1') return true;
    const ls = window.localStorage.getItem('debug:images');
    if (ls === '1' || ls === 'true') return true;
  } catch {
    // ignore
  }
  // Build-time flag; safe on client because it’s inlined.
  return process.env.NEXT_PUBLIC_DEBUG_IMAGES === '1';
}

/**
 * Whether server-side image debug logging is enabled.
 *
 * Enabled by default in development; in production, controlled by the
 * `DEBUG_IMAGES=1` environment variable.
 */
export function isServerImageDebugEnabled(): boolean {
  // Always on in development for server-side logs.
  if (process.env.NODE_ENV !== 'production') return true;
  return process.env.DEBUG_IMAGES === '1';
}

/** Resolved client debug configuration. */
export type ClientImageDebugConfig = {
  enabled: boolean;
  filter: string | null;
  limit: number | null;
  onLoad: boolean;
};

/**
 * Read and normalize the client debug configuration from URL and storage.
 */
export function getClientImageDebugConfig(): ClientImageDebugConfig {
  const enabled = isClientImageDebugEnabled();
  let filter: string | null = null;
  let limit: number | null = null;
  let onLoad = true;

  if (typeof window !== 'undefined') {
    try {
      const qs = new URL(window.location.href).searchParams;
      filter = qs.get('imgFilter') || null;
      const qLimit = qs.get('imgLimit');
      if (qLimit != null) limit = Number(qLimit);
      const qOn = qs.get('imgOnLoad');
      if (qOn === '0' || qOn === 'false') onLoad = false;

      const lsFilter = window.localStorage.getItem('debug:images:filter');
      if (lsFilter) filter = lsFilter;
      const lsLimit = window.localStorage.getItem('debug:images:limit');
      if (lsLimit && !Number.isNaN(Number(lsLimit))) limit = Number(lsLimit);
      const lsOn = window.localStorage.getItem('debug:images:onload');
      if (lsOn === '0' || lsOn === 'false') onLoad = false;
    } catch {
      // ignore
    }
  }

  // Reasonable defaults in dev: no filter, low limit to avoid flooding.
  if (process.env.NODE_ENV !== 'production') {
    if (limit == null) limit = 3;
  }

  return { enabled, filter, limit, onLoad };
}
