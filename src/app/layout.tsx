import '@fontsource-variable/inter';
import '@fontsource-variable/manrope';
import '@/design-system/tokens/tokens.css';
import './globals.css';

import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import favicon from '@/design-system/logo/zentrika-favicon.svg';
import CampaignBanner from '@/components/CampaignBanner';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { getCampaigns, getCompany, getPageIndex, getProducts } from '@/lib/api';
import { BRAND, SITE_URL, SLOGAN } from '@/lib/site';

// Render en el servidor por petición; los datos vienen de la caché de datos (etiquetas + revalidación),
// así el build no depende de que la API esté disponible y lo publicado aparece en cuanto se invalida.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${BRAND} — ${SLOGAN}`, template: `%s` },
  description: 'ZENTRIKA diseña y construye software con rigor técnico y visión de producto.',
  applicationName: BRAND,
  icons: { icon: favicon.src },
  openGraph: { type: 'website', siteName: BRAND, locale: 'es_CO' },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = { themeColor: '#080F1A', colorScheme: 'dark' };

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [pages, products, company, campaigns] = await Promise.all([getPageIndex(), getProducts(), getCompany(), getCampaigns()]);
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BRAND,
    slogan: company?.slogan ?? SLOGAN,
    url: SITE_URL,
    logo: `${SITE_URL}${favicon.src}`,
    ...(company?.contact_email ? { email: company.contact_email } : {}),
    areaServed: 'CO',
  };

  return (
    <html lang="es-CO">
      <body>
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        <CampaignBanner campaign={campaigns[0]} />
        <Header pages={pages} />
        <main id="contenido">{children}</main>
        <Footer pages={pages} products={products} company={company} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd).replace(/</g, '\\u003c') }} />
      </body>
    </html>
  );
}
