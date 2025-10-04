'use client';

import { stripStega } from 'datocms-visual-editing';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { ComponentPropsWithoutRef, ElementType } from 'react';

type StegaTextProps<E extends ElementType> = {
  value: string;
  as?: E;
} & Omit<ComponentPropsWithoutRef<E>, 'children'>;

export default function StegaText<E extends ElementType = 'span'>({
  value,
  as,
  ...rest
}: StegaTextProps<E>) {
  const Component = (as ?? 'span') as ElementType;
  const searchParams = useSearchParams();
  const editToggle = searchParams?.get('edit') ?? null;
  const visualEditingActive = editToggle === '1';
  const [displayValue, setDisplayValue] = useState(() =>
    visualEditingActive ? value : stripStega(value),
  );

  useEffect(() => {
    setDisplayValue(visualEditingActive ? value : stripStega(value));
  }, [value, visualEditingActive]);

  return <Component {...rest}>{displayValue}</Component>;
}
