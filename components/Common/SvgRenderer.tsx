'use client';

/**
 * Fetches and renders an SVG from a same-origin URL into the
 * DOM. Intended for small icon sprites hosted in the project. Avoids <img> so
 * the SVG inherits currentColor styles.
 */
import type { URL } from 'node:url';
import { useEffect, useState } from 'react';

export type Props = {
  /** URL of the SVG to fetch (string or WHATWG URL). */
  url: string | URL;
};

/** Inline an external SVG by fetching and injecting content. */
const SvgRenderer = ({ url }: Props) => {
  const [svgContent, setSvgContent] = useState('');

  useEffect(() => {
    const fetchSvg = async () => {
      try {
        const response = await fetch(url);
        const svgText = await response.text();
        setSvgContent(svgText);
      } catch (_error) {
        setSvgContent('');
      }
    };

    fetchSvg();
  }, [url]);

  return (
    <div
      className="fill-current [&>*]:text-gray-400"
      /* biome-ignore lint/security/noDangerouslySetInnerHtml: rendering trusted SVG content from same-origin */
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

export default SvgRenderer;
