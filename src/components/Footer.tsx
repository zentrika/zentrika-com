import Image from 'next/image';
import Link from 'next/link';

import logo from '@/design-system/logo/zentrika-logo-horizontal.svg';
import type { Company, PageIndexItem, Product } from '@/lib/api';
import { SLOGAN } from '@/lib/site';

export default function Footer({ pages, products, company }: { pages: PageIndexItem[]; products: Product[]; company: Company | null }) {
  const legal = pages.filter((p) => p.kind === 'legal');
  const sitePages = pages.filter((p) => p.kind === 'page' && p.slug !== 'home');
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Image src={logo} alt="ZENTRIKA" height={24} />
          <p className="muted">{company?.slogan ?? SLOGAN}</p>
          {company?.contact_email ? (
            <a href={`mailto:${company.contact_email}`} className="footer-mail">
              {company.contact_email}
            </a>
          ) : null}
        </div>
        <div>
          <p className="footer-title">Productos</p>
          <ul>
            {products.map((p) => (
              <li key={p.slug}>
                <Link href={`/productos/${p.slug}`}>{p.name}</Link>
              </li>
            ))}
            <li>
              <Link href="/productos">Ver todos</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="footer-title">ZENTRIKA</p>
          <ul>
            {sitePages.map((p) => (
              <li key={p.slug}>
                <Link href={`/${p.slug}`}>{p.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        {legal.length ? (
          <div>
            <p className="footer-title">Legal</p>
            <ul>
              {legal.map((p) => (
                <li key={p.slug}>
                  <Link href={`/${p.slug}`}>{p.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      <div className="container footer-bottom">
        <span>© {year} ZENTRIKA</span>
        <span>Hecho en Colombia</span>
      </div>
    </footer>
  );
}
