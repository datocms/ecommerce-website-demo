// Tells light product colors apart, so their swatches can be outlined on the white page.

type RGB = [number, number, number];

const WHITE: RGB = [255, 255, 255];

// WCAG asks for 3:1 between a graphic and its background
const MIN_CONTRAST = 3;

// sRGB channel (0-255) -> linear light, per WCAG relative luminance
const toLinear = (channel: number) => {
  const s = channel / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

const luminance = ([r, g, b]: RGB) =>
  0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

// WCAG 2.x contrast ratio between two colors
const contrast = (a: RGB, b: RGB) => {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

// '#F0EBE7' | 'f0ebe7' | '#fff' -> [240, 235, 231]; null when unparsable
const hexToRgb = (hex: string): RGB | null => {
  const [, digits] =
    hex
      .trim()
      .replace(/^#/, '')
      .match(/^([0-9a-f]{3}|[0-9a-f]{6})$/i) ?? [];
  if (!digits) return null;
  const sixDigits = digits.length === 3 ? digits.replace(/./g, '$&$&') : digits;
  const value = Number.parseInt(sixDigits, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
};

/** Whether a hex color is too light to stand out on white. Unparsable colors count as dark. */
export function isLightColor(hex: string) {
  const rgb = hexToRgb(hex);
  return rgb !== null && contrast(rgb, WHITE) < MIN_CONTRAST;
}
