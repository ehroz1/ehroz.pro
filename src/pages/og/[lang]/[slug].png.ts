import type { APIRoute, GetStaticPaths } from 'astro';
import { apps, type Lang } from '../../../content/apps';
import { appOg, homeOg } from '../../../lib/og';

export const getStaticPaths: GetStaticPaths = () =>
  (['ru', 'en'] as Lang[]).flatMap((lang) => [{ params: { lang, slug: 'home' } }, ...apps.map((a) => ({ params: { lang, slug: a.slug } }))]);

export const GET: APIRoute = ({ params }) => {
  const lang = params.lang as Lang;
  const app = apps.find((a) => a.slug === params.slug);
  const png = app ? appOg(app, lang) : homeOg(lang);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
