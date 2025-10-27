/**
 * Minimal tag→query index for DatoCMS Cache Tags.
 *
 * What this does
 * - Persists a mapping from CDA cache tag → array of Next.js `queryId` tags.
 * - Lets the revalidation route translate Dato tags into concrete Next cache tags to revalidate.
 *
 * Trade‑offs
 * - This demo writes a JSON file under `.next/cache/dato-cache-tags.json`.
 *   In production, prefer a shared store (Redis, Vercel KV/Postgres/Turso), so
 *   all instances share the same view. You can override the path with
 *   `DATOCMS_CACHE_TAGS_PATH`, but a DB is recommended in real apps.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

type TagToQueryIds = Record<string, string[]>;

function getStorePath() {
  const p =
    process.env.DATOCMS_CACHE_TAGS_PATH ||
    path.join(process.cwd(), '.next', 'cache', 'dato-cache-tags.json');
  return p;
}

async function ensureDir(filePath: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function readStore(): Promise<TagToQueryIds> {
  try {
    const p = getStorePath();
    const raw = await fs.readFile(p, 'utf8');
    return JSON.parse(raw) as TagToQueryIds;
  } catch {
    return {};
  }
}

async function writeStore(store: TagToQueryIds) {
  const p = getStorePath();
  await ensureDir(p);
  const tmp = `${p}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(store), 'utf8');
  await fs.rename(tmp, p);
}

function addToArrayUnique(arr: string[], value: string, max = 500) {
  if (!arr.includes(value)) arr.push(value);
  // prevent unbounded growth in demos
  if (arr.length > max) arr.splice(0, arr.length - max);
}

export async function recordCacheTagsForQuery(
  queryId: string,
  rawHeader: string | null,
) {
  if (!rawHeader) return;
  // CDA header uses space-separated tags per docs
  const tags = rawHeader
    .split(/[\s,]+/)
    .map((t) => t.trim())
    .filter(Boolean);
  if (tags.length === 0) return;

  const store = await readStore();
  for (const tag of tags) {
    let list = store[tag];
    if (!Array.isArray(list)) list = [];
    addToArrayUnique(list, queryId);
    store[tag] = list;
  }
  await writeStore(store);
}

export async function findQueryIdsForTags(tags: string[]): Promise<string[]> {
  if (tags.length === 0) return [];
  const store = await readStore();
  const out = new Set<string>();
  for (const tag of tags) {
    const list = store[tag];
    if (Array.isArray(list)) {
      for (const q of list) out.add(q);
    }
  }
  return Array.from(out);
}
