import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section">
      <div className="container container-narrow">
        <p className="eyebrow">Error 404</p>
        <h1 className="section-title">No encontramos esta página</h1>
        <p className="section-sub">Puede que se haya movido o que aún no esté publicada.</p>
        <p style={{ marginTop: 24 }}>
          <Link href="/" className="btn btn-primary">
            Volver al inicio
          </Link>
        </p>
      </div>
    </section>
  );
}
