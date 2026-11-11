import Link from 'next/link';
import type { ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & {
  /** null when the CMS link has no target (see linkHref) */
  href: string | null;
};

// A CMS link whose target may be missing: without an href, its content renders as plain text
// with the same classes
export default function OptionalLink({
  href,
  className,
  children,
  ...rest
}: Props) {
  if (!href) {
    return <span className={className}>{children}</span>;
  }

  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  );
}
