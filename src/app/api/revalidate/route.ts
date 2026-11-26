import { createHmac, timingSafeEqual } from 'node:crypto';

import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

// ZentrikaOS llama a este endpoint al publicar contenido. El cuerpo va firmado con HMAC-SHA256.
const TAG = /^(pages|products|campaigns|company|page:[a-z0-9/-]{1,120}|product:[a-z0-9-]{1,80})$/;

export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return NextResponse.json({ detail: 'Revalidación no configurada.' }, { status: 404 });

  const body = await req.text();
  if (body.length > 4096) return NextResponse.json({ detail: 'Cuerpo demasiado grande.' }, { status: 413 });
  const sent = Buffer.from(req.headers.get('x-zentrika-signature') ?? '', 'utf8');
  const expected = Buffer.from(createHmac('sha256', secret).update(body).digest('hex'), 'utf8');
  if (sent.length !== expected.length || !timingSafeEqual(sent, expected)) {
    return NextResponse.json({ detail: 'Firma no válida.' }, { status: 401 });
  }

  let tags: unknown;
  try {
    tags = (JSON.parse(body) as { tags?: unknown }).tags;
  } catch {
    return NextResponse.json({ detail: 'JSON no válido.' }, { status: 400 });
  }
  if (!Array.isArray(tags) || tags.length > 20 || !tags.every((t) => typeof t === 'string' && TAG.test(t))) {
    return NextResponse.json({ detail: 'Etiquetas no válidas.' }, { status: 400 });
  }
  tags.forEach((t) => revalidateTag(t));
  return NextResponse.json({ revalidated: tags });
}
