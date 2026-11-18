import { stripStega } from '@datocms/content-link/stega';
import type { CSSProperties } from 'react';

// Advance widths of the title face, in em, erring wide so a word always fits
const GLYPH_WIDTHS: [RegExp, number][] = [
  [/[.,'’iíìïjlI]/, 0.25],
  [/[frtJ1-]/, 0.39],
  [/[mwMW]/, 0.9],
  [/\p{Lu}/u, 0.66],
];
const glyphWidthEm = (char: string) =>
  GLYPH_WIDTHS.find(([re]) => re.test(char))?.[1] ?? 0.57;

/** The widest unbreakable part of a title, in em */
const widestWord = (title: string) =>
  Math.max(
    0,
    ...title
      .split(/\s+|(?<=-)/)
      .map((word) =>
        [...word].reduce((sum, char) => sum + glyphWidthEm(char), 0),
      ),
  );

/**
 * Shrinks a title whose longest word (a German compound, say) would overflow its column, so words
 * never break. The column needs container-type: inline-size.
 */
export function fitTitleStyle(title: string): CSSProperties | undefined {
  // Draft titles carry invisible Content Link stega characters, which must not count as glyphs
  const width = widestWord(stripStega(title));
  return width
    ? { fontSize: `min(1em, ${(100 / width).toFixed(2)}cqi)` }
    : undefined;
}
