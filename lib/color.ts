// WCAG contrast helpers, used to outline product color swatches that are too light on white.

export type RGB = [number, number, number];

export const WHITE: RGB = [255, 255, 255];

// sRGB channel (0-255) -> linear light, per WCAG relative luminance
const toLinear = (c: number) => {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

const luminance = ([r, g, b]: RGB) =>
  0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

/** WCAG 2.x contrast ratio between two colors */
export const contrast = (a: RGB, b: RGB) => {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

/** '#F0EBE7' | 'f0ebe7' | '#fff' -> [240, 235, 231]; null when unparsable */
export const hexToRgb = (hex: string): RGB | null => {
  const m = hex
    .trim()
    .replace(/^#/, '')
    .match(/^([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  const h =
    m[1].length === 3
      ? m[1]
          .split('')
          .map((c) => c + c)
          .join('')
      : m[1];
  return [0, 2, 4].map((i) => Number.parseInt(h.slice(i, i + 2), 16)) as RGB;
};
