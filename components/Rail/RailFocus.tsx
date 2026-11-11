'use client';

import { useRevealFocus } from './useRevealFocus';

type Props = {
  railId: string;
};

// For a rail without RailControls (which does the same)
export default function RailFocus({ railId }: Props) {
  useRevealFocus(railId);
  return null;
}
