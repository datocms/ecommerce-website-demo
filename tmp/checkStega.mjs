import { decodeStega, withContentLinkHeaders } from 'datocms-visual-editing';

// Load .env/.env.local (best-effort) when running directly via Node
import fs from 'node:fs';
import path from 'node:path';

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

loadDotEnv('.env');
loadDotEnv('.env.local');

const TOKEN = process.env.DATOCMS_READONLY_API_TOKEN;
const BASE = process.env.NEXT_PUBLIC_DATO_BASE_EDITING_URL;

if (!TOKEN || !BASE) {
  console.error(
    'Missing DATOCMS_READONLY_API_TOKEN or NEXT_PUBLIC_DATO_BASE_EDITING_URL',
  );
  process.exit(1);
}

const fetchDato = withContentLinkHeaders(fetch, BASE);

async function gql(query, variables = {}, { includeDrafts = true } = {}) {
  const res = await fetchDato('https://graphql.datocms.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${TOKEN}`,
      ...(includeDrafts ? { 'X-Include-Drafts': 'true' } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GraphQL error ${res.status}:\n${text}`);
  }

  const body = await res.json();
  if (body.errors) {
    throw new Error(JSON.stringify(body.errors, null, 2));
  }
  return body.data;
}

const QUERY = /* GraphQL */ `
  query StegaProbe($locale: SiteLocale) {
    allProducts(first: 1, locale: $locale) {
      id
      name
      _editingUrl
      productImages {
        id
        alt
        responsiveImage(imgixParams: { w: 400, h: 300, fit: crop }) {
          src
          alt
          width
          height
        }
      }
    }
    layout(locale: $locale) {
      _editingUrl
      logo { alt responsiveImage { alt src } }
      footerLogo { alt responsiveImage { alt src } }
      popup { _editingUrl popupImage { alt responsiveImage { alt src } } }
    }
  }
`;

const locale = 'en';

(async () => {
  const data = await gql(QUERY, { locale });
  const product = data.allProducts?.[0];
  if (!product) {
    console.log('No products returned.');
    return;
  }

  console.log('\nProduct:', product.name, product.id);
  for (const img of product.productImages ?? []) {
    const rawAltField = img.alt ?? '';
    const rawAltResponsive = img.responsiveImage?.alt ?? '';
    const decodedField = decodeStega(rawAltField);
    const decodedResponsive = decodeStega(rawAltResponsive);
    console.log('\nUpload id:', img.id);
    console.log('  productImages.alt length:', rawAltField.length);
    console.log('  responsiveImage.alt length:', rawAltResponsive.length);
    console.log(
      '  productImages.alt decoded:',
      decodedField ? JSON.stringify(decodedField) : null,
    );
    console.log(
      '  responsiveImage.alt decoded:',
      decodedResponsive ? JSON.stringify(decodedResponsive) : null,
    );
  }

  const l = data.layout;
  if (l) {
    const candidates = [
      ['logo', l.logo],
      ['footerLogo', l.footerLogo],
      ['popupImage', l.popup?.popupImage],
    ];
    for (const [label, n] of candidates) {
      if (!n) continue;
      const rawAltField = n.alt ?? '';
      const rawAltResponsive = n.responsiveImage?.alt ?? '';
      const decodedField = decodeStega(rawAltField);
      const decodedResponsive = decodeStega(rawAltResponsive);
      console.log(`\nLayout ${label}:`);
      console.log('  field alt length:', rawAltField.length);
      console.log('  responsive alt length:', rawAltResponsive.length);
      console.log(
        '  field alt decoded:',
        decodedField ? JSON.stringify(decodedField) : null,
      );
      console.log(
        '  responsive alt decoded:',
        decodedResponsive ? JSON.stringify(decodedResponsive) : null,
      );
    }
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
