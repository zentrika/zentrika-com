'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';

type Kind = 'contacto' | 'demo' | 'cotizacion';
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8100';

const KINDS: { value: Kind; label: string }[] = [
  { value: 'contacto', label: 'Información general' },
  { value: 'demo', label: 'Demostración de un producto' },
  { value: 'cotizacion', label: 'Cotización de un proyecto' },
];

export default function ContactForm({
  defaultKind = 'contacto',
  productSlug,
  productName,
  lockKind = false,
}: {
  defaultKind?: Kind;
  productSlug?: string;
  productName?: string;
  lockKind?: boolean;
}) {
  const [kind, setKind] = useState<Kind>(defaultKind);
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const renderedAt = useRef<number>(0);

  useEffect(() => {
    renderedAt.current = Date.now();
    if (!lockKind) {
      const tipo = new URLSearchParams(window.location.search).get('tipo');
      if (tipo === 'demo' || tipo === 'cotizacion' || tipo === 'contacto') setKind(tipo);
    }
  }, [lockKind]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState('sending');
    setError(null);
    try {
      const res = await fetch(`${API}/api/public/v1/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind,
          name: fd.get('name'),
          email: fd.get('email'),
          phone: fd.get('phone') || '',
          company: fd.get('company') || '',
          message: fd.get('message'),
          product_slug: productSlug ?? null,
          source_path: window.location.pathname.slice(0, 200),
          consent: fd.get('consent') === 'on',
          website: fd.get('website') || '',
          rendered_at: renderedAt.current,
        }),
      });
      if (res.status === 202) {
        setState('sent');
        return;
      }
      const body = await res.json().catch(() => null);
      setError(
        res.status === 429
          ? 'Recibimos varias solicitudes desde tu conexión. Inténtalo más tarde.'
          : typeof body?.detail === 'string'
            ? body.detail
            : 'Revisa los datos del formulario.',
      );
      setState('error');
    } catch {
      setError('No pudimos enviar tu solicitud. Revisa tu conexión e inténtalo de nuevo.');
      setState('error');
    }
  }

  if (state === 'sent') {
    return (
      <div className="form-success" role="status">
        <strong>¡Gracias!</strong>
        <p>Recibimos tu solicitud{productName ? ` sobre ${productName}` : ''}. Te responderemos personalmente al correo que nos indicaste.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate={false}>
      {error ? (
        <div className="form-error" role="alert">
          {error}
        </div>
      ) : null}
      {!lockKind ? (
        <label className="field">
          <span>¿En qué podemos ayudarte?</span>
          <select name="kind" value={kind} onChange={(e) => setKind(e.target.value as Kind)}>
            {KINDS.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <div className="form-row">
        <label className="field">
          <span>Nombre *</span>
          <input name="name" required minLength={2} maxLength={120} autoComplete="name" />
        </label>
        <label className="field">
          <span>Correo *</span>
          <input name="email" type="email" required maxLength={255} autoComplete="email" />
        </label>
      </div>
      <div className="form-row">
        <label className="field">
          <span>Empresa</span>
          <input name="company" maxLength={150} autoComplete="organization" />
        </label>
        <label className="field">
          <span>Teléfono</span>
          <input name="phone" type="tel" maxLength={30} pattern="[0-9+()\-\s]*" autoComplete="tel" />
        </label>
      </div>
      <label className="field">
        <span>Mensaje *</span>
        <textarea name="message" required minLength={10} maxLength={4000} rows={5} placeholder={productName ? `Cuéntanos sobre tu equipo y qué te gustaría ver de ${productName}.` : 'Cuéntanos qué necesitas.'} />
      </label>
      {/* Campo trampa para bots: oculto para personas y tecnologías de asistencia */}
      <div className="hp" aria-hidden="true">
        <label>
          Sitio web
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="consent">
        <input type="checkbox" name="consent" required />
        <span>
          Autorizo a ZENTRIKA a tratar mis datos personales para responder esta solicitud, según el <Link href="/legal/privacidad">aviso de privacidad</Link> (Ley 1581 de 2012).
        </span>
      </label>
      <button className="btn btn-primary" type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'Enviando…' : kind === 'demo' ? 'Solicitar demostración' : kind === 'cotizacion' ? 'Solicitar cotización' : 'Enviar mensaje'}
      </button>
    </form>
  );
}
