import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import ContactForm from '@/components/ContactForm';
import Icon from '@/components/Icon';
import { getProduct, PRODUCT_STATUS } from '@/lib/api';
import { BRAND, SITE_URL } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  if (!p) return { title: 'Producto no encontrado — ZENTRIKA' };
  const title = `${p.name} — ${p.endorsement}${p.tagline ? ` · ${p.tagline}` : ''}`;
  return { title, description: p.summary, alternates: { canonical: `/productos/${p.slug}` }, openGraph: { title, description: p.summary } };
}

export default async function ProductPage({ params }: Props) {
  const p = await getProduct((await params).slug);
  if (!p) notFound();

  // Sin precios ni valoraciones: aún no están definidos públicamente.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: p.name,
    description: p.summary,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: `${SITE_URL}/productos/${p.slug}`,
    publisher: { '@type': 'Organization', name: BRAND, url: SITE_URL },
    featureList: p.features.map((f) => f.title),
  };

  return (
    <>
      <section className="hero product-hero">
        <div className="hero-ribbons" aria-hidden="true">
          <span />
          <span />
        </div>
        <div className="container hero-inner">
          <p className="eyebrow">
            <Link href="/productos">Productos</Link> · <span className="badge">{PRODUCT_STATUS[p.status]}</span>
          </p>
          <h1 className="hero-title">
            {p.name} <span className="product-endorse-lg">— {p.endorsement}</span>
          </h1>
          {p.tagline ? <p className="product-tagline-lg accent">{p.tagline}</p> : null}
          <p className="hero-sub">{p.summary}</p>
          <div className="hero-actions">
            {p.demo_enabled ? (
              <a href="#demo" className="btn btn-primary">
                Solicitar demostración
              </a>
            ) : null}
            {p.website_url ? (
              <a href={p.website_url} className="btn btn-ghost" rel="noopener noreferrer" target="_blank">
                Ir a {p.name}
              </a>
            ) : null}
          </div>
        </div>
      </section>

      {p.description ? (
        <section className="section section-tight">
          <div className="container container-narrow">
            <p className="lead">{p.description}</p>
          </div>
        </section>
      ) : null}

      {p.features.length ? (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Funcionalidades</p>
              <h2 className="section-title">Todo lo que tu equipo necesita para avanzar</h2>
            </div>
            <div className="feature-grid">
              {p.features.map((f) => (
                <div key={f.title} className="feature">
                  <span className="feature-icon">
                    <Icon name="check" />
                  </span>
                  <h3>{f.title}</h3>
                  {f.description ? <p className="muted">{f.description}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {p.demo_enabled ? (
        <section className="section" id="demo">
          <div className="container container-narrow">
            <div className="section-head">
              <p className="eyebrow">Demostración</p>
              <h2 className="section-title">Conoce {p.name} en acción</h2>
              <p className="section-sub">Déjanos tus datos y coordinaremos contigo una demostración personalizada.</p>
            </div>
            <div className="form-card">
              <ContactForm defaultKind="demo" lockKind productSlug={p.slug} productName={p.name} />
            </div>
          </div>
        </section>
      ) : null}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    </>
  );
}
