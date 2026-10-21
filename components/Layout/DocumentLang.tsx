'use client';

import { useEffect } from 'react';

type Props = {
  lang: string;
};

// The root layout renders <html> above the [lng] segment, so the page language is set from here
export default function DocumentLang({ lang }: Props) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}
