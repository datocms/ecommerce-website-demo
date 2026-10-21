'use client';

import { useEffect } from 'react';

// The root layout renders <html> above the [lng] segment, so the page language is set from here
export default function DocumentLang({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}
