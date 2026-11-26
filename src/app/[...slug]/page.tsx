import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Sections from '@/components/Sections';
import { getPage } from '@/lib/api';

type Props = { params: Promise<{ slug: string[] }> };

// Páginas gestionadas desde el CMS de ZentrikaOS: /servicios, /empresa, /contacto, /legal/privacidad…
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)?$/;

function slugOf(parts: string[]): string | null {
  const slug = parts.join('/');
  return SLUG.test(slug) && slug !== 'home' ? slug : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = slugOf((await params).slug);
  const page = slug ? await getPage(slug) : null;
  if (!page) return { title: 'Página no encontrada — ZENTRIKA' };
  return {
    title: page.seo.title,
    description: page.seo.description,
    alternates: { canonical: `/${page.slug}` },
    openGraph: { title: page.seo.title, description: page.seo.description, ...(page.seo.image ? { images: [page.seo.image] } : {}) },
  };
}

export default async function CmsPage({ params }: Props) {
  const slug = slugOf((await params).slug);
  const page = slug ? await getPage(slug) : null;
  if (!page) notFound();

  if (page.kind === 'legal') {
    return (
      <>
        <section className="page-hero">
          <div className="container container-narrow">
            <p className="eyebrow">Legal</p>
            <h1 className="section-title">{page.title}</h1>
          </div>
        </section>
        <Sections sections={page.sections} firstIsH1={false} />
      </>
    );
  }
  return <Sections sections={page.sections} />;
}
