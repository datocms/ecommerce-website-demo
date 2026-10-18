'use client';

type Props = {
  r: number;
  g: number;
  b: number;
};

// Writes the CMS accent. global.css mixes it into --color-accent-wash, which only <mark> uses:
// the rest of the site is ink and white. A plain <style> is server-rendered (styled-jsx would
// only inject it after hydration).
const CustomColor = ({ r, g, b }: Props) => (
  <style>{`:root{--color-primary:rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)})}`}</style>
);

export default CustomColor;
