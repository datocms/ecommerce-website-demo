'use client';

import { useEffect, useState } from 'react';

type Props = {
  url: string;
};

/** Inlines a CMS-hosted SVG icon so it inherits currentColor; the parent link carries the
 * accessible name. */
export default function SvgRenderer({ url }: Props) {
  const [svgContent, setSvgContent] = useState('');

  useEffect(() => {
    const fetchSvg = async () => {
      try {
        const response = await fetch(url);
        setSvgContent(await response.text());
      } catch (error) {
        console.error('Error fetching SVG:', error);
      }
    };

    fetchSvg();
  }, [url]);

  return (
    <span
      aria-hidden="true"
      className="inline-flex [&_svg]:size-5 [&_svg]:fill-current"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
