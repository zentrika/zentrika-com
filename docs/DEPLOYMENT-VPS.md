# Despliegue en el VPS de ZENTRIKA

Zentrika.com corre en su propio contenedor Next.js y no necesita una base de datos.
El servidor obtiene contenido de la API pública de ZentrikaOS por la red aislada
zentrika_apps. El puerto del sitio queda ligado a 127.0.0.1:3100 para el Nginx del VPS.

## Preparación

1. Desplegar primero ZentrikaOS y conectar ambos proyectos a la red Docker externa
   zentrika_apps.
2. Copiar deploy/env.zentrika-com.production.example a .env.production. El valor de
   REVALIDATE_SECRET debe coincidir exactamente con WEB_REVALIDATE_SECRET de ZentrikaOS.
3. NEXT_PUBLIC_SITE_URL y NEXT_PUBLIC_API_URL se insertan en el build; reconstruir la imagen
   después de cambiar esos valores.
4. En DNS, conservar el A existente de zentrika.tech y el CNAME de www. Añadir api como
   registro A hacia el VPS.

## Arranque

Desde /opt/zentrika/projects/corporate/Zentrika.com, ejecutar:

docker compose --env-file .env.production -f docker-compose.vps.yml config --quiet
docker compose --env-file .env.production -f docker-compose.vps.yml up -d --build
docker compose --env-file .env.production -f docker-compose.vps.yml ps
curl -fsS -I http://127.0.0.1:3100/

Después de habilitar HTTPS en Nginx, comprobar zentrika.tech, www.zentrika.tech,
api.zentrika.tech y el formulario público. Publicar una página CMS de prueba para
comprobar la notificación HMAC y la invalidación inmediata de caché.

La imagen se construye desde este repositorio y usa la copia versionada del sistema de
diseño. La fuente canónica continúa en ZentrikaOS/design-system; ejecutar el chequeo de
sincronización antes de desplegar cambios de marca.
