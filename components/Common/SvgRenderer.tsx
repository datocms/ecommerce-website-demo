'use client';

import { useEffect, useState } from 'react';

type Props = {
  url: string;
};

// Inlines a CMS-hosted SVG icon so it inherits currentColor; the parent link carries the name
export default function SvgRenderer({ url }: Props) {
  const [svgContent, setSvgContent] = useState('');

  useEffect(() => {
    let ignore = false;

    const fetchSvg = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) return;
        const svg = await response.text();
        if (!ignore) {
          setSvgContent(svg);
        }
      } catch (error) {
        console.error('Error fetching SVG:', error);
      }
    };

    fetchSvg();

    return () => {
      ignore = true;
    };
  }, [url]);

  return (
    <span
      aria-hidden="true"
      className="inline-flex [&_svg]:size-5 [&_svg]:fill-current"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
