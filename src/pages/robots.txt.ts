import type { APIRoute } from 'astro';
import { PRODUCTION_ORIGIN } from '../i18n';

// На боевом домене — всё открыто + карта сайта. На зеркалах (GitHub Pages, превью) — закрыто целиком.
export const GET: APIRoute = ({ site }) => {
  const body =
    site?.origin === PRODUCTION_ORIGIN
      ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap-index.xml', site).href}\n`
      : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
