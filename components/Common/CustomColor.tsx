'use client';

import { contrast, INK, type RGB, WHITE } from '@/utils/color';

type Props = {
  r: number;
  g: number;
  b: number;
};

const css = ([r, g, b]: RGB) =>
  `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)})`;

// Writes the CMS accent. global.css derives --color-accent-wash from it (<mark>, ::selection);
// the graphic variant (6px dots) is darkened toward ink until it reaches 3:1.
const CustomColor = ({ r, g, b }: Props) => {
  const accent: RGB = [r, g, b];
  let graphic: RGB = accent;
  for (let t = 0.05; t <= 1 && contrast(graphic, WHITE) < 3; t += 0.05) {
    graphic = [
      r + (INK[0] - r) * t,
      g + (INK[1] - g) * t,
      b + (INK[2] - b) * t,
    ];
  }
  // A plain <style> is server-rendered (styled-jsx would only inject it after hydration)
  return (
    <style>{`:root{--color-primary:${css(accent)};--color-primary-graphic:${css(graphic)}}`}</style>
  );
};

export default CustomColor;
