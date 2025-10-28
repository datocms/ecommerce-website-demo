'use client';

/**
 * Injects a CSS custom property for the primary color at runtime.
 */
export type Props = {
  /** Red channel (0–255). */
  r: number;
  /** Green channel (0–255). */
  g: number;
  /** Blue channel (0–255). */
  b: number;
};

/** Apply a global `--color-primary` variable using RGB channels. */
const CustomColor = ({ r, g, b }: Props) => {
  return (
    <style global jsx>{`
      :root {
        --color-primary: ${r} ${g} ${b};
      }
    `}</style>
  );
};

export default CustomColor;
