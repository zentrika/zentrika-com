import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Sections from '@/components/Sections';
import { getPreview } from '@/lib/api';

export const metadata: Metadata = { title: 'Vista previa — ZENTRIKA', robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ slug?: string; token?: string }> };

/** Vista previa de un borrador del CMS. El token lo firma ZentrikaOS y caduca a los 30 minutos. */
export default async function Preview({ searchParams }: Props) {
  const { slug, token } = await searchParams;
  if (!slug || !token || !/^[a-z0-9/-]{1,120}$/.test(slug)) notFound();
  const page = await getPreview(slug, token);
  if (!page) {
    return (
      <section className="section">
        <div className="container container-narrow">
          <h1 className="section-title">Vista previa no disponible</h1>
          <p className="muted">El enlace no es válido o caducó. Genera uno nuevo desde ZentrikaOS.</p>
        </div>
      </section>
    );
  }
  return (
    <>
      <div className="preview-bar" role="status">
        Vista previa del borrador de «{page.title}» · no es visible para el público
      </div>
      <Sections sections={page.sections} firstIsH1={page.kind !== 'legal'} />
    </>
  );
}
