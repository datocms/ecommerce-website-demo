'use client';

/**
 * @fileoverview Tiny helper/component that scrolls the document to top on
 * mount. Useful after client-side navigation when the page should reset.
 */
import { useEffect } from 'react';

export default function ScrollUp() {
  useEffect(() => window.document.scrollingElement?.scrollTo(0, 0), []);

  return null;
}
