import { cache } from 'react';

// not-found.tsx receives no params, so the root layout leaves the locale here for it. cache()
// scopes the box to one request.
const requestLocale = cache((): { current?: string } => ({}));

export const setRequestLocale = (locale: string) => {
  requestLocale().current = locale;
};

export const getRequestLocale = () => requestLocale().current;
