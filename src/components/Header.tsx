import Image from 'next/image';
import Link from 'next/link';

import logo from '@/design-system/logo/zentrika-logo-horizontal.svg';
import type { PageIndexItem } from '@/lib/api';

import MobileMenu from './MobileMenu';

// Orden preferido de las páginas del CMS en la navegación; solo aparecen si están publicadas.
const ORDER = ['servicios', 'empresa'];

export default function Header({ pages }: { pages: PageIndexItem[] }) {
  const published = new Set(pages.map((p) => p.slug));
  const links = [
    { href: '/productos', label: 'Productos' },
    ...ORDER.filter((s) => published.has(s)).map((s) => ({ href: `/${s}`, label: pages.find((p) => p.slug === s)!.title })),
  ];
  const contact = published.has('contacto');

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="ZENTRIKA — inicio">
          <Image src={logo} alt="ZENTRIKA" height={26} priority />
        </Link>
        <nav className="nav" aria-label="Principal">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link">
              {l.label}
            </Link>
          ))}
          {contact ? (
            <Link href="/contacto" className="btn btn-primary btn-sm">
              Contacto
            </Link>
          ) : null}
        </nav>
        <MobileMenu links={contact ? [...links, { href: '/contacto', label: 'Contacto' }] : links} />
      </div>
    </header>
  );
}
