'use client';

import { useEffect, useState } from 'react';

type Props = {
  url: string;
  className?: string;
};

// CMS social icons are filled currentColor glyphs. The parent link carries the aria-label.
const SvgRenderer = ({ url, className }: Props) => {
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
      className={['inline-flex [&_svg]:size-5 [&_svg]:fill-current', className]
        .filter(Boolean)
        .join(' ')}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

export default SvgRenderer;
