// Next.js 16 Proxy (formerly middleware.ts): redirects URLs without a locale prefix to the
// visitor's preferred locale, and a bare locale to its home page.

import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { type NextRequest, NextResponse } from 'next/server';
import { getAvailableLocales, type SiteLocale } from '@/lib/i18n';

// Next.js ignores fetch caching inside Proxy, so keep the locales in memory
// for a minute instead of querying DatoCMS on every request.
const LOCALES_TTL_MS = 60_000;
let cachedLocales: { locales: SiteLocale[]; expiresAt: number } | undefined;

async function getCachedLocales(): Promise<SiteLocale[]> {
  if (!cachedLocales || cachedLocales.expiresAt < Date.now()) {
    try {
      cachedLocales = {
        locales: await getAvailableLocales(),
        expiresAt: Date.now() + LOCALES_TTL_MS,
      };
    } catch (error) {
      // Keep serving the last known locales while DatoCMS is unreachable
      if (!cachedLocales) throw error;
    }
  }
  return cachedLocales.locales;
}

function getPreferredLocale(request: Request, locales: SiteLocale[]): string {
  // The first locale in the project settings is the fallback
  const fallbackLng = locales[0];
  const headers = new Headers(request.headers);
  const acceptLanguage = headers.get('accept-language');
  if (acceptLanguage) {
    headers.set('accept-language', acceptLanguage.replaceAll('_', '-'));
  }

  const reformattedLocales = locales.map((locale) =>
    locale.replaceAll('_', '-'),
  );
  const headersObject = Object.fromEntries(headers.entries());
  const languages = new Negotiator({ headers: headersObject }).languages(
    reformattedLocales,
  );

  return match(languages, locales, fallbackLng);
}

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locales = await getCachedLocales();

  // / -> /en/home, in the visitor's preferred locale
  if (pathname === '/') {
    const locale = getPreferredLocale(request, locales);
    return NextResponse.redirect(new URL(`/${locale}/home`, request.url));
  }

  // /en -> /en/home, keeping the query string: there is no page at a locale's root
  if (locales.some((locale) => pathname === `/${locale}`)) {
    const url = request.nextUrl.clone();
    url.pathname = `${pathname}/home`;
    return NextResponse.redirect(url);
  }

  const hasLocalePrefix = locales.some((locale) =>
    pathname.startsWith(`/${locale}/`),
  );

  // /products -> /en/products, keeping the query string
  if (!hasLocalePrefix) {
    const locale = getPreferredLocale(request, locales);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }
}

// Skip files with an extension, Next internals and /api routes
export const config = {
  matcher: ['/((?!.*\\.|_next|api\\/).*)'],
};
