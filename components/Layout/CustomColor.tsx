'use client';

type Props = {
  r: number;
  g: number;
  b: number;
};

// Sets --color-primary from Layout.accentColor. It only feeds --color-accent-wash (tokens.css),
// which tints text selection. A plain <style>, so it ships in the server HTML.
export default function CustomColor({ r, g, b }: Props) {
  return <style>{`:root{--color-primary:rgb(${r} ${g} ${b})}`}</style>;
}
