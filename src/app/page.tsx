import type { Metadata } from 'next';

import Sections from '@/components/Sections';
import { getPage } from '@/lib/api';
import { BRAND, SLOGAN } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('home');
  return {
    title: page?.seo.title ?? `${BRAND} — ${SLOGAN}`,
    description: page?.seo.description,
    alternates: { canonical: '/' },
    openGraph: { title: page?.seo.title, description: page?.seo.description },
  };
}

export default async function Home() {
  const page = await getPage('home');
  if (!page) {
    // Sin contenido publicado (o API no disponible): portada mínima de marca, sin inventar contenido.
    return (
      <section className="hero hero-main">
        <div className="container hero-inner">
          <p className="eyebrow">ZENTRIKA</p>
          <h1 className="hero-title">
            Ingeniería que <span className="accent">transforma</span> ideas.
          </h1>
        </div>
      </section>
    );
  }
  return <Sections sections={page.sections} />;
}
