'use client';

import type { URL } from 'node:url';
import { useEffect, useState } from 'react';

type Props = {
  url: string | URL;
};

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
