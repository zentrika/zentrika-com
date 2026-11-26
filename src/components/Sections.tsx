import Link from 'next/link';
import type { ReactNode } from 'react';

import { getProducts, PRODUCT_STATUS, type Product, type SectionData } from '@/lib/api';

import ContactForm from './ContactForm';
import Icon from './Icon';
import SmartLink from './SmartLink';

/** Resalta la palabra indicada del título (si aparece) con el acento de marca. */
function Highlighted({ text, word }: { text: string; word?: string }) {
  if (!word) return <>{text}</>;
  const i = text.toLowerCase().indexOf(word.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className="accent">{text.slice(i, i + word.length)}</span>
      {text.slice(i + word.length)}
    </>
  );
}

function Head({ eyebrow, title, subtitle, as = 'h2' }: { eyebrow?: string; title?: string; subtitle?: string; as?: 'h1' | 'h2' }) {
  const H = as;
  return (
    <div className="section-head">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      {title ? <H className="section-title">{title}</H> : null}
      {subtitle ? <p className="section-sub">{subtitle}</p> : null}
    </div>
  );
}

/** Subconjunto mínimo de Markdown, renderizado sin HTML: «## título», «- lista» y párrafos. */
export function RichText({ body }: { body: string }) {
  const blocks = body.replace(/\r\n/g, '\n').split(/\n{2,}/);
  const out: ReactNode[] = [];
  blocks.forEach((block, bi) => {
    const lines = block.split('\n').filter((l) => l.trim());
    if (!lines.length) return;
    if (lines.every((l) => l.trim().startsWith('- '))) {
      out.push(
        <ul key={bi}>
          {lines.map((l, li) => (
            <li key={li}>{l.trim().slice(2)}</li>
          ))}
        </ul>,
      );
      return;
    }
    lines.forEach((l, li) => {
      const t = l.trim();
      if (t.startsWith('## ')) out.push(<h2 key={`${bi}-${li}`}>{t.slice(3)}</h2>);
      else if (t.startsWith('- ')) out.push(<ul key={`${bi}-${li}`}><li>{t.slice(2)}</li></ul>);
      else out.push(<p key={`${bi}-${li}`}>{t}</p>);
    });
  });
  return <div className="prose">{out}</div>;
}

export function ProductCard({ p }: { p: Product }) {
  return (
    <Link href={`/productos/${p.slug}`} className="product-card">
      <div className="product-card-top">
        <span className="product-orb" style={p.accent_color ? { ['--orb' as string]: p.accent_color } : undefined} aria-hidden="true" />
        <span className="badge">{PRODUCT_STATUS[p.status]}</span>
      </div>
      <h3 className="product-name">
        {p.name} <span className="product-endorse">{p.endorsement}</span>
      </h3>
      {p.tagline ? <p className="product-tagline">{p.tagline}</p> : null}
      <p className="muted">{p.summary}</p>
      <span className="product-more">
        Conocer {p.name} <Icon name="arrow" size={16} />
      </span>
    </Link>
  );
}

async function Showcase({ data }: { data: Extract<SectionData, { type: 'product_showcase' }>['data'] }) {
  const all = await getProducts();
  const products = data.product_slugs.length ? all.filter((p) => data.product_slugs.includes(p.slug)) : all;
  if (!products.length) return null;
  return (
    <section className="section">
      <div className="container">
        <Head eyebrow={data.eyebrow} title={data.title} subtitle={data.subtitle} />
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Sections({ sections, firstIsH1 = true }: { sections: SectionData[]; firstIsH1?: boolean }) {
  return (
    <>
      {sections.map((s, i) => {
        const key = `${s.type}-${i}`;
        switch (s.type) {
          case 'hero':
            return (
              <section key={key} className={`hero ${i === 0 ? 'hero-main' : ''}`}>
                <div className="hero-ribbons" aria-hidden="true">
                  <span />
                  <span />
                </div>
                <div className="container hero-inner">
                  {s.data.eyebrow ? <p className="eyebrow">{s.data.eyebrow}</p> : null}
                  {i === 0 && firstIsH1 ? (
                    <h1 className="hero-title">
                      <Highlighted text={s.data.title} word={s.data.highlight} />
                    </h1>
                  ) : (
                    <h2 className="hero-title">
                      <Highlighted text={s.data.title} word={s.data.highlight} />
                    </h2>
                  )}
                  {s.data.subtitle ? <p className="hero-sub">{s.data.subtitle}</p> : null}
                  {s.data.primary_cta || s.data.secondary_cta ? (
                    <div className="hero-actions">
                      {s.data.primary_cta ? (
                        <SmartLink href={s.data.primary_cta.href} className="btn btn-primary">
                          {s.data.primary_cta.label}
                        </SmartLink>
                      ) : null}
                      {s.data.secondary_cta ? (
                        <SmartLink href={s.data.secondary_cta.href} className="btn btn-ghost">
                          {s.data.secondary_cta.label}
                        </SmartLink>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </section>
            );
          case 'features':
            return (
              <section key={key} className="section">
                <div className="container">
                  <Head eyebrow={s.data.eyebrow} title={s.data.title} subtitle={s.data.subtitle} />
                  <div className="feature-grid">
                    {s.data.items.map((it, j) => (
                      <div key={j} className="feature">
                        <span className="feature-icon">
                          <Icon name={it.icon} />
                        </span>
                        <h3>{it.title}</h3>
                        {it.description ? <p className="muted">{it.description}</p> : null}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          case 'product_showcase':
            return <Showcase key={key} data={s.data} />;
          case 'cta':
            return (
              <section key={key} className="section">
                <div className="container">
                  <div className="cta-band">
                    <div>
                      <h2 className="section-title">{s.data.title}</h2>
                      {s.data.subtitle ? <p className="section-sub">{s.data.subtitle}</p> : null}
                    </div>
                    <SmartLink href={s.data.cta.href} className="btn btn-primary">
                      {s.data.cta.label}
                    </SmartLink>
                  </div>
                </div>
              </section>
            );
          case 'rich_text':
            return (
              <section key={key} className="section section-tight">
                <div className="container container-narrow">
                  {s.data.title ? <h2 className="section-title">{s.data.title}</h2> : null}
                  <RichText body={s.data.body} />
                </div>
              </section>
            );
          case 'contact_form':
            return (
              <section key={key} className="section section-tight">
                <div className="container container-narrow">
                  <Head title={s.data.title} subtitle={s.data.subtitle} />
                  <div className="form-card">
                    <ContactForm defaultKind={s.data.default_kind} />
                  </div>
                </div>
              </section>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
