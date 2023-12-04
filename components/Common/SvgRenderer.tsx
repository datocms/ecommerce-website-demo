'use client';

import React, { useEffect, useState } from 'react';
import { URL } from 'url';

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
      } catch (error) {
        console.error('Error fetching SVG:', error);
      }
    };

    fetchSvg();
  }, [url]);

  return (
    <div
      className="fill-current [&>*]:text-gray-400"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

export default SvgRenderer;
