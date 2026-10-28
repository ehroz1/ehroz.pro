import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// SITE_URL / SITE_BASE задаются при сборке для GitHub Pages (ehroz1.github.io/ehroz.pro).
// На Vercel и Cloudflare Pages с доменом ehroz.pro ничего задавать не нужно.
const site = process.env.SITE_URL || 'https://ehroz.pro';
const base = process.env.SITE_BASE || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  // Пробелы между строчными элементами в сценах значимы («JPG 88%»), поэтому HTML не сжимаем.
  compressHTML: false,
  build: { format: 'directory', inlineStylesheets: 'always' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'ru', locales: { ru: 'ru-RU', en: 'en-US' } },
      filter: (page) => !page.includes('/404') && !page.includes('/lab/'),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
