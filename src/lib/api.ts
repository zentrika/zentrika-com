// Cliente de la API pública de ZentrikaOS (solo lectura de contenido publicado).
// Los datos se guardan en la caché de datos de Next.js con etiquetas; ZentrikaOS las invalida
// al publicar (ver /api/revalidate) y, como respaldo, caducan cada REVALIDATE segundos.
import 'server-only';

const SERVER_API = process.env.ZENTRIKAOS_API_URL ?? 'http://127.0.0.1:8100';
const REVALIDATE = 300;

export const PUBLIC_API = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8100';

async function get<T>(path: string, tags: string[], init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${SERVER_API}/api/public/v1${path}`, {
      ...init,
      headers: { Accept: 'application/json' },
      next: init?.cache === 'no-store' ? undefined : { revalidate: REVALIDATE, tags },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`API ${res.status}`);
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[zentrikaos] ${path}:`, err instanceof Error ? err.message : err);
    return null;
  }
}

/** Convierte una ruta de medio de la API ("/api/public/v1/media/…") en URL absoluta para el navegador. */
export function mediaUrl(path: string | null | undefined): string | null {
  return path ? `${PUBLIC_API}${path}` : null;
}

// ── Tipos ────────────────────────────────────────────────────────────────────
export interface Link {
  label: string;
  href: string;
}
export type SectionData =
  | { type: 'hero'; data: { eyebrow?: string; title: string; highlight?: string; subtitle?: string; primary_cta?: Link | null; secondary_cta?: Link | null } }
  | { type: 'features'; data: { eyebrow?: string; title: string; subtitle?: string; items: { title: string; description: string; icon: string }[] } }
  | { type: 'product_showcase'; data: { eyebrow?: string; title: string; subtitle?: string; product_slugs: string[] } }
  | { type: 'cta'; data: { title: string; subtitle?: string; cta: Link } }
  | { type: 'rich_text'; data: { title?: string; body: string } }
  | { type: 'contact_form'; data: { title: string; subtitle?: string; default_kind: LeadKind } };

export interface CmsPage {
  slug: string;
  title: string;
  kind: 'page' | 'legal';
  seo: { title: string; description: string; image: string | null };
  sections: SectionData[];
  preview: boolean;
}
export interface PageIndexItem {
  slug: string;
  title: string;
  kind: 'page' | 'legal';
  updated_at: string | null;
}
export interface Product {
  slug: string;
  name: string;
  endorsement: string;
  tagline: string;
  summary: string;
  description: string;
  status: 'idea' | 'en_desarrollo' | 'pre_lanzamiento' | 'disponible' | 'retirado';
  demo_enabled: boolean;
  website_url: string | null;
  accent_color: string | null;
  logo_url: string | null;
  features: { title: string; description: string }[];
  versions: { version: string; released_on: string | null; notes: string }[];
}
export interface Company {
  brand_name: string;
  slogan: string;
  locale: string;
  contact_email: string | null;
}
export interface Campaign {
  headline: string;
  body: string;
  cta_label: string;
  cta_href: string;
  banner_url: string | null;
}
export type LeadKind = 'contacto' | 'demo' | 'cotizacion';

export const PRODUCT_STATUS: Record<Product['status'], string> = {
  idea: 'Idea',
  en_desarrollo: 'En desarrollo',
  pre_lanzamiento: 'Próximamente',
  disponible: 'Disponible',
  retirado: 'Retirado',
};

// ── Consultas ────────────────────────────────────────────────────────────────
export const getCompany = () => get<Company>('/company', ['company']);
export const getPageIndex = async () => (await get<PageIndexItem[]>('/pages', ['pages'])) ?? [];
export const getPage = (slug: string) => get<CmsPage>(`/pages/${slug}`, ['pages', `page:${slug}`]);
export const getPreview = (slug: string, token: string) =>
  get<CmsPage>(`/pages/${slug}?preview=${encodeURIComponent(token)}`, [], { cache: 'no-store' });
export const getProducts = async () => (await get<Product[]>('/products', ['products'])) ?? [];
export const getProduct = (slug: string) => get<Product>(`/products/${slug}`, ['products', `product:${slug}`]);
export const getCampaigns = async () => (await get<Campaign[]>('/brand/campaigns/active', ['campaigns'])) ?? [];
