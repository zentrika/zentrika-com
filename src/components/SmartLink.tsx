import NextLink from 'next/link';
import type { ReactNode } from 'react';

import { isExternal } from '@/lib/site';

export default function SmartLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  if (isExternal(href)) {
    return (
      <a href={href} className={className} rel="noopener noreferrer" target={href.startsWith('https://') ? '_blank' : undefined}>
        {children}
      </a>
    );
  }
  return (
    <NextLink href={href} className={className}>
      {children}
    </NextLink>
  );
}
