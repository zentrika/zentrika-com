export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://127.0.0.1:3100').replace(/\/$/, '');
export const BRAND = 'ZENTRIKA';
export const SLOGAN = 'Ingeniería que transforma ideas.';
export const LOCALE = 'es-CO';

/** Enlaces del CMS: rutas internas, https:// o mailto: (validados también en ZentrikaOS). */
export function isExternal(href: string): boolean {
  return href.startsWith('https://') || href.startsWith('mailto:');
}
