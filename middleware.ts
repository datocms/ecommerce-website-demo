import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { type NextRequest, NextResponse } from 'next/server';
import getAvailableLocales, { getFallbackLocale } from './app/i18n/settings';
import type { SiteLocale } from './graphql/types/graphql';

const VISUAL_EDITING_HEADER = 'x-datocms-visual-editing';

function normalizeVisualEditingToggle(raw: string | null): string | null {
  if (!raw) return null;

  const normalized = raw.toLowerCase();

  if (['1', 'true', 'on'].includes(normalized)) {
    return '1';
  }

  if (['0', 'false', 'off'].includes(normalized)) {
    return '0';
  }

  return null;
}

async function getLocale(
  request: Request,
  locales: SiteLocale[],
): Promise<string> {
  const fallbackLng = await getFallbackLocale();
  const headers = new Headers(request.headers);
  const acceptLanguage = headers.get('accept-language');
  if (acceptLanguage) {
    headers.set('accept-language', acceptLanguage.replaceAll('_', '-'));
  }

  const reformattedLocales = locales.map((locale) => locale.replaceAll('_', '-'));
  const headersObject = Object.fromEntries(headers.entries());
  const languages = new Negotiator({ headers: headersObject }).languages(reformattedLocales);

  return match(languages, locales, fallbackLng);
}

export async function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname;
  const locales = await getAvailableLocales();

  const pathnameIsMissingLocale = locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  //go to home in browser language if pathname & locale is missing
  if (pathname === '/') {
    const locale = await getLocale(request, locales);
    const redirectUrl = new URL(`/${locale}/home`, request.url);
    redirectUrl.search = request.nextUrl.search;
    return NextResponse.redirect(redirectUrl);
  }

  //go to pathname in browser language if locale is missing but pathname is set
  if (pathnameIsMissingLocale) {
    const locale = await getLocale(request, locales);

    // e.g. incoming request is /products
    // The new URL is now /en/products
    const redirectUrl = new URL(`/${locale}/${pathname}`, request.url);
    redirectUrl.search = request.nextUrl.search;

    return NextResponse.redirect(redirectUrl);
  }

  const editToggle = normalizeVisualEditingToggle(
    request.nextUrl.searchParams.get('edit'),
  );

  if (editToggle) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(VISUAL_EDITING_HEADER, editToggle);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.*\\.|_next|api\\/).*)'],
};
