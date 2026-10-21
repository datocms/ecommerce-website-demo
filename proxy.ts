import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { type NextRequest, NextResponse } from 'next/server';
import { getAvailableLocales, type SiteLocale } from '@/lib/i18n';

// Next.js ignores fetch caching inside Proxy, so keep the locales in memory
// for a minute instead of querying DatoCMS on every request.
const LOCALES_TTL_MS = 60_000;
let cachedLocales: { locales: SiteLocale[]; expiresAt: number } | undefined;

async function getLocales(): Promise<SiteLocale[]> {
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

function getLocale(request: Request, locales: SiteLocale[]): string {
  const fallbackLng = locales[0]; //using the first ordered locale as fallback
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
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname;
  const locales = await getLocales();

  const pathnameIsMissingLocale = locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  //go to home in browser language if pathname & locale is missing
  if (pathname === '/') {
    const locale = getLocale(request, locales);
    return NextResponse.redirect(new URL(`/${locale}/home`, request.url));
  }

  //go to pathname in browser language if locale is missing but pathname is set
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request, locales);

    // e.g. incoming request is /products
    // The new URL is now /en/products, keeping any search params
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/((?!.*\\.|_next|api\\/).*)'],
};
