// Проверка собранного сайта (dist/) перед публикацией: npm run build && npm run check:seo
// Ищет битые внутренние ссылки, адреса не по формату, страницы без canonical/title/description,
// лишние или пропавшие h1 и проверяет, что 404 закрыта от индексации.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = 'dist';
const ORIGIN = 'https://ehroz.pro';
const base = (process.env.SITE_BASE || '/').replace(/\/$/, '');
const errors = [];

const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const pages = walk(ROOT).filter((f) => f.endsWith('.html'));
const urlOf = (file) => '/' + relative(ROOT, file).split(sep).join('/').replace(/index\.html$/, '').replace(/\.html$/, '');
const exists = (p) => {
  const t = join(ROOT, decodeURIComponent(p.slice(base.length)));
  return (existsSync(t) && statSync(t).isFile()) || existsSync(join(t, 'index.html'));
};

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const url = urlOf(file);
  const is404 = url === '/404';
  const err = (m) => errors.push(`${url}: ${m}`);

  for (const [, raw] of html.matchAll(/\s(?:href|src)="([^"]*)"/g)) {
    const u = raw.split('#')[0].split('?')[0];
    if (!u || /^(https?:|mailto:|tel:|data:|\/\/)/.test(u)) continue;
    if (!u.startsWith('/')) { err(`относительная ссылка ${raw}`); continue; }
    if (!exists(u)) err(`битая ссылка ${raw}`);
    // Правила формата — только для страниц, не для файлов (шрифты, скрипты, картинки).
    if (u.split('/').pop().includes('.')) continue;
    if (!u.endsWith('/')) err(`ссылка без слеша в конце ${raw}`);
    if (u !== u.toLowerCase() || /[\s_]/.test(u)) err(`адрес не в нижнем регистре или с пробелом/подчёркиванием ${raw}`);
  }

  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const robots = html.match(/<meta name="robots" content="([^"]+)"/)?.[1] ?? '';
  if (is404) {
    if (!robots.includes('noindex')) err('404 должна быть noindex');
    if (canonical) err('у 404 не должно быть canonical');
  } else if (process.env.SITE_URL && process.env.SITE_URL !== ORIGIN) {
    if (!robots.includes('noindex')) err('зеркало должно быть noindex');
  } else {
    if (!canonical) err('нет canonical');
    else if (canonical !== ORIGIN + url) err(`canonical ${canonical} не совпадает с адресом страницы`);
    if (robots.includes('noindex')) err('страница закрыта noindex');
  }
  if (!/<title>[^<]{10,}<\/title>/.test(html)) err('нет title');
  if (!/<meta name="description" content="[^"]{30,}"/.test(html)) err('нет description');
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) err(`h1 на странице: ${h1}`);
}

if (errors.length) {
  console.error(`SEO-проверка: ${errors.length} ошибок\n` + errors.map((e) => '  ✗ ' + e).join('\n'));
  process.exit(1);
}
console.log(`SEO-проверка: ${pages.length} страниц, ошибок нет`);
