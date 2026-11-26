import type { Metadata } from 'next';

import { ProductCard } from '@/components/Sections';
import { getProducts } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Productos — ZENTRIKA',
  description: 'Productos de software desarrollados y operados por ZENTRIKA.',
  alternates: { canonical: '/productos' },
};

export default async function Products() {
  const products = await getProducts();
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Productos</p>
          <h1 className="section-title">Nuestro ecosistema</h1>
          <p className="section-sub">Productos propios, construidos y operados por ZENTRIKA.</p>
        </div>
      </section>
      <section className="section section-tight">
        <div className="container">
          {products.length ? (
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard key={p.slug} p={p} />
              ))}
            </div>
          ) : (
            <p className="muted">Pronto publicaremos nuestros productos.</p>
          )}
        </div>
      </section>
    </>
  );
}
