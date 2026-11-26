# Zentrika.com

Portal público corporativo de **ZENTRIKA**: *Ingeniería que transforma ideas.*

* **Stack:** Next.js 15 (App Router) y TypeScript, sin dependencias de UI de terceros.
* **Contenido:** llega de la **API pública de ZentrikaOS** (`/api/public/v1`): páginas del CMS, productos, campañas y datos de empresa. Este proyecto **no** tiene base de datos, lógica de RR. HH., nómina ni datos privados.
* **Diseño:** copia versionada del design system en `src/design-system/` (no se edita aquí; ver su README).

## Rutas

| Ruta | Origen |
|---|---|
| `/` | Página `home` del CMS |
| `/productos`, `/productos/[slug]` | Productos publicados, con formulario de demostración |
| `/[...slug]` | Páginas del CMS (`/servicios`, `/empresa`, `/contacto`, `/legal/privacidad`…). Solo las publicadas; el resto da 404. |
| `/preview?slug=…&token=…` | Vista previa de borradores con token firmado por ZentrikaOS (30 min, `noindex`) |
| `/api/revalidate` | Webhook firmado (HMAC-SHA256) con el que ZentrikaOS invalida la caché al publicar |
| `/sitemap.xml`, `/robots.txt` | SEO, generados con el contenido publicado |

La navegación muestra solo las páginas publicadas. Los formularios envían las solicitudes directamente a ZentrikaOS (`POST /api/public/v1/leads`), con:
* consentimiento expreso de tratamiento de datos (Ley 1581 de 2012);
* campo trampa contra bots;
* control del tiempo de llenado;
* límites de envíos por IP y por correo.

## Caché

Las páginas se renderizan en el servidor en cada petición, pero los datos de la API se guardan en la caché de datos de Next.js con etiquetas (`pages`, `page:<slug>`, `products`…):
* Al publicar en ZentrikaOS, se invalidan al instante mediante `/api/revalidate`.
* Como respaldo, caducan cada 5 minutos.
* El build no necesita la API.

## Desarrollo

```bash
cp .env.example .env.local
```

```bash
npm install && npm run dev
```

Queda en http://127.0.0.1:3100. Requiere ZentrikaOS corriendo en `:8100`.

## Docker

```bash
docker compose up -d --build
```

Corre en http://127.0.0.1:3100 y lee las variables de `.env`. El contenedor llega a la API de ZentrikaOS por `host.docker.internal:8100`. Los dos proyectos son independientes: cada uno tiene su propio Compose.

Para el VPS de ZENTRIKA, consulta [docs/DEPLOYMENT-VPS.md](docs/DEPLOYMENT-VPS.md) y
usa docker-compose.vps.yml. Ese despliegue consume la API de ZentrikaOS por una red Docker
privada compartida y no crea una base de datos.

## Comprobaciones

```bash
npm run typecheck
```

```bash
npm run build
```

```bash
npm run check:design-system
```

El último verifica que la copia del design system esté al día.

## Seguridad

* CSP restrictiva, sin recursos de terceros: solo `self` y el origen de la API para imágenes y formularios. Incluye `frame-ancestors 'none'`, `nosniff`, `Referrer-Policy` y `Permissions-Policy`.
* El contenido del CMS se renderiza **sin HTML**: texto plano más un subconjunto mínimo de Markdown.
* Mejora prevista: CSP con *nonce* por petición, para eliminar `'unsafe-inline'` en los scripts.
