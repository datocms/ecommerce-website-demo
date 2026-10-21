'use client';

type Props = {
  r: number;
  g: number;
  b: number;
};

// Sets --color-primary from Layout.mainColor. global.css uses it only through
// --color-accent-wash, to tint text selection. A plain <style>, so it ships in the server HTML.
export default function CustomColor({ r, g, b }: Props) {
  return <style>{`:root{--color-primary:rgb(${r} ${g} ${b})}`}</style>;
}
