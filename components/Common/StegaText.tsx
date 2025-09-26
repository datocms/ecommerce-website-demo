'use client';

import { stripStega } from 'datocms-visual-editing';
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
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(stripStega(value));
  }, [value]);

  return <Component {...rest}>{displayValue}</Component>;
}

