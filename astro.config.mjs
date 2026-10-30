import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { apps, homeUpdated } from './src/content/apps.ts';
import csp from './src/lib/csp.ts';

// SITE_URL / SITE_BASE задаются при сборке для GitHub Pages (ehroz1.github.io/ehroz.pro).
// На Vercel и Cloudflare Pages с доменом ehroz.pro ничего задавать не нужно.
const site = process.env.SITE_URL || 'https://ehroz.pro';
const base = process.env.SITE_BASE || '/';

export default defineConfig({
  site,
  base,
  // Все адреса страниц — со слешем в конце (/morfus/). Vercel редиректит /morfus → /morfus/ (vercel.json).
  trailingSlash: 'always',
  // Пробелы между строчными элементами в сценах значимы («JPG 88%»), поэтому HTML не сжимаем.
  compressHTML: false,
  build: { format: 'directory', inlineStylesheets: 'always' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  integrations: [
    // В sitemap — только канонические страницы со статусом 200 (404 и служебные исключены).
    // Пересобирается при каждой сборке: добавили/удалили приложение — sitemap обновится сам.
    sitemap({
      i18n: { defaultLocale: 'ru', locales: { ru: 'ru', en: 'en' } },
      filter: (page) => !page.includes('/404'),
      serialize(item) {
        const path = new URL(item.url).pathname.slice(base.replace(/\/$/, '').length);
        const slug = path.replace(/^\/(en\/)?/, '').replace(/\/$/, '');
        const app = apps.find((a) => a.slug === slug);
        // lastmod — дата изменения содержимого (поле updated в apps.ts), а не дата сборки.
        item.lastmod = new Date(app ? app.updated : homeUpdated()).toISOString();
        const ru = item.links?.find((l) => l.lang === 'ru');
        if (ru) item.links = [...item.links.filter((l) => l.lang !== 'x-default'), { lang: 'x-default', url: ru.url }];
        if (app) item.img = [{ url: new URL(`${base.replace(/\/$/, '')}/icons/${app.slug}-512.png`, site).href }];
        return item;
      },
    }),
    csp(),
  ],
  vite: { plugins: [tailwindcss()] },
});
