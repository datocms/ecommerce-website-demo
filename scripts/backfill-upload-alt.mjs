#!/usr/bin/env node
// Backfill empty Upload.alt values so DatoCMS can append stega payloads.
// Requires a Management API token: DATOCMS_MANAGEMENT_TOKEN (Full-access).

import fs from 'node:fs';
import path from 'node:path';
import { buildClient } from '@datocms/cma-client-node';

function loadDotEnv(filename) {
  try {
    const p = path.resolve(process.cwd(), filename);
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf8');
      for (const line of content.split(/\r?\n/)) {
        const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
        if (m) {
          const key = m[1];
          let value = m[2];
          if (value?.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          }
          if (!(key in process.env)) {
            process.env[key] = value;
          }
        }
      }
    }
  } catch {}
}

loadDotEnv('.env.local');
loadDotEnv('.env');

const token =
  process.env.DATOCMS_MANAGEMENT_TOKEN ||
  process.env.DATOCMS_FULLACCESS_API_TOKEN;

if (!token) {
  console.error(
    'Missing DATOCMS_MANAGEMENT_TOKEN (or DATOCMS_FULLACCESS_API_TOKEN). Set it in your env and retry.',
  );
  process.exit(1);
}

const DRY_RUN = /^1|true$/i.test(process.env.DRY_RUN || '');
const LIMIT = process.env.LIMIT
  ? Number.parseInt(process.env.LIMIT, 10)
  : undefined;

function filenameWithoutExt(urlOrFilename) {
  try {
    // Try to parse as URL; fallback to raw string
    const u = new URL(urlOrFilename);
    const base = u.pathname.split('/').pop() || urlOrFilename;
    return base.replace(/\.[a-zA-Z0-9]+$/, '');
  } catch {
    return (urlOrFilename || '').replace(/\.[a-zA-Z0-9]+$/, '');
  }
}

async function main() {
  const client = buildClient({ apiToken: token });
  const site = await client.site.find();
  console.log(`Connected to project: ${site.name}`);

  let page = 0;
  const perPage = 50;
  let processed = 0;
  let patched = 0;

  while (true) {
    page += 1;
    const uploads = await client.uploads.list({ page, perPage });
    if (!uploads || uploads.length === 0) break;

    for (const up of uploads) {
      if (LIMIT && processed >= LIMIT) {
        console.log(`Limit reached (${LIMIT}). Stopping.`);
        return;
      }
      processed += 1;

      const meta = up.default_field_metadata || {};
      const enMeta = meta.en || {
        alt: null,
        title: null,
        custom_data: {},
        focal_point: null,
      };
      const rawAlt = (enMeta.alt || '').trim();
      if (rawAlt.length > 0) continue; // already filled for en

      const proposed = filenameWithoutExt(
        up.filename || up.url || up.basename || 'image',
      );
      console.log(
        `• ${up.id} ${up.filename} -> alt: "${proposed}"${
          DRY_RUN ? ' (dry-run)' : ''
        }`,
      );

      if (!DRY_RUN) {
        const next = {
          ...up,
          default_field_metadata: {
            ...meta,
            en: { ...enMeta, alt: proposed },
          },
        };
        await client.uploads.update(up.id, {
          default_field_metadata: next.default_field_metadata,
        });
        patched += 1;
      }
    }
  }

  console.log(`Scanned ${processed} uploads; ${patched} updated.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
