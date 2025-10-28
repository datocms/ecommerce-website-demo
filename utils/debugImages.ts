/**
 * Debug helpers for DatoCMS responsive image URLs.
 *
 * - Client: call {@link logClientResponsiveImage} from the DatoImage component.
 * - Server: call {@link logServerResponsiveImages} on GraphQL responses to
 *   capture any `responsiveImage` objects returned by queries.
 */

export type ResponsiveImageLike = {
  src?: string | null;
  srcSet?: string | null;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
  title?: string | null;
};

function parseFirstSrcsetUrl(srcSet: string | null | undefined): string | null {
  if (!srcSet) return null;
  const first = srcSet.split(',')[0]?.trim();
  if (!first) return null;
  const urlPart = first.split(' ')[0];
  return urlPart || null;
}

function validateUrl(u: string | null | undefined) {
  if (!u) return { ok: false, reason: 'empty' } as const;
  try {
    const url = new URL(u);
    const host = url.hostname;
    const isDatoAssets = /datocms-assets\.com$/i.test(host);
    const isImgix = /imgix\.net$/i.test(host);
    return { ok: true as const, host, isDatoAssets, isImgix };
  } catch (e) {
    return { ok: false as const, reason: 'invalid', error: String(e) };
  }
}

/**
 * Emit a structured console log for a client-rendered responsive image.
 *
 * Includes sample `srcSet` URL, host checks, and any extra labels to make it
 * easy to filter logs in the browser console.
 *
 * @param where - Logical location label (e.g. component name)
 * @param data - Responsive image object returned by GraphQL
 * @param extra - Optional metadata to include in the log entry
 */
export function logClientResponsiveImage(
  where: string,
  data: ResponsiveImageLike,
  extra?: Record<string, unknown>,
) {
  if (typeof window === 'undefined') return;
  if (!shouldLogClient(where, data, extra)) return;
  const firstSrcset = parseFirstSrcsetUrl(data.srcSet ?? null);
  const srcInfo = validateUrl(data.src ?? null);
  const setInfo = validateUrl(firstSrcset);
  const payload = {
    type: 'datocms-img-debug',
    source: 'client',
    where,
    location: typeof window !== 'undefined' ? window.location.href : null,
    baseEditingUrl: process.env.NEXT_PUBLIC_DATO_BASE_EDITING_URL ?? null,
    responsiveImage: { ...data, srcSetSample: firstSrcset },
    checks: { src: srcInfo, srcSetFirst: setInfo },
    extra: extra ?? null,
    ts: Date.now(),
  };
  console.log(JSON.stringify(payload));
}

// Internal: decide if we should log this image on the client, with filtering
// and per-page limits.
import { getClientImageDebugConfig } from './debugFlags';

function shouldLogClient(
  where: string,
  data: ResponsiveImageLike,
  extra?: Record<string, unknown>,
): boolean {
  const cfg = getClientImageDebugConfig();
  if (!cfg.enabled) return false;

  // Respect per-page limit using a global counter.
  const w = window as unknown as { __DATOCMS_IMG_DEBUG_COUNT?: number };
  w.__DATOCMS_IMG_DEBUG_COUNT = (w.__DATOCMS_IMG_DEBUG_COUNT ?? 0) + 1;
  if (cfg.limit != null && w.__DATOCMS_IMG_DEBUG_COUNT > cfg.limit)
    return false;

  const filter = cfg.filter?.toLowerCase() ?? null;
  if (!filter) return true;

  const haystacks = [
    where,
    data.src ?? '',
    data.srcSet ?? '',
    data.alt ?? '',
    data.title ?? '',
    String(extra?.debugLabel ?? ''),
  ]
    .filter(Boolean)
    .map((s) => s.toLowerCase());

  return haystacks.some((s) => s.includes(filter));
}

/**
 * Scan an arbitrary GraphQL payload and log a sample of found
 * `responsiveImage` objects. Useful for verifying that URLs are well-formed in
 * server logs, and for spotting unexpected hosts.
 *
 * @param payload - Arbitrary GraphQL result payload
 * @param opts - Optional route label and flags to include in the log entry
 */
export function logServerResponsiveImages(
  payload: unknown,
  opts?: { route?: string; visualEditing?: boolean; draft?: boolean },
) {
  const results: Array<{ path: string; value: ResponsiveImageLike }> = [];

  const walk = (node: unknown, path: string) => {
    if (node && typeof node === 'object') {
      const maybe = node as Record<string, unknown>;
      if (
        'src' in maybe &&
        'srcSet' in maybe &&
        'width' in maybe &&
        'height' in maybe
      ) {
        const v = maybe as ResponsiveImageLike;
        results.push({ path, value: v });
      }
      for (const [k, v] of Object.entries(maybe)) {
        walk(v, `${path}.${k}`);
      }
    }
  };

  walk(payload, 'data');

  if (results.length === 0) return;

  const entries = results.slice(0, 10).map((r) => {
    const firstSrcset = parseFirstSrcsetUrl(r.value.srcSet ?? null);
    return {
      path: r.path,
      src: r.value.src ?? null,
      srcCheck: validateUrl(r.value.src ?? null),
      srcSetFirst: firstSrcset,
      srcSetCheck: validateUrl(firstSrcset),
      width: r.value.width ?? null,
      height: r.value.height ?? null,
      alt: r.value.alt ?? null,
    };
  });
  const out = {
    type: 'datocms-img-debug',
    source: 'server',
    route: opts?.route ?? null,
    flags: {
      visualEditing: opts?.visualEditing ?? null,
      draft: opts?.draft ?? null,
    },
    entries,
    ts: Date.now(),
  };
  console.log(JSON.stringify(out));
}

/**
 * Log a small sample of the document's `<img>` elements, optionally filtered
 * by substring match on the URL. Helpful to confirm real DOM state after
 * hydration and image loading.
 *
 * @param opts - Optional filter and limit; `filter` matches against URL.
 * @returns Nothing. Emits a JSON line to the console when images are found.
 */
export function logDocumentImagesSample(opts?: {
  filter?: string | null;
  limit?: number | null;
}) {
  if (typeof window === 'undefined') return;
  const filter = (opts?.filter ?? null)?.toLowerCase() ?? null;
  const limit = opts?.limit ?? 5;
  const imgs = Array.from(document.images) as HTMLImageElement[];
  const selected: HTMLImageElement[] = [];
  for (const img of imgs) {
    const url = img.currentSrc || img.src || '';
    if (filter && !url.toLowerCase().includes(filter)) continue;
    selected.push(img);
    if (limit != null && selected.length >= limit) break;
  }
  if (selected.length === 0) return;
  const entries = selected.map((img) => ({
    currentSrc: img.currentSrc,
    src: img.src,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
    check: validateUrl(img.currentSrc || img.src || null),
  }));
  const out = {
    type: 'datocms-img-debug',
    source: 'document',
    entries,
    ts: Date.now(),
  };
  console.log(JSON.stringify(out));
}
