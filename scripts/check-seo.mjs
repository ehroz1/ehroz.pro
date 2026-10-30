// Проверка собранного сайта (dist/) перед публикацией: npm run build && npm run check:seo
// Ищет битые внутренние ссылки, адреса не по формату, страницы без canonical/title/description/OG,
// повторы title и description, ошибки в порядке заголовков, страницы-сироты и слишком глубокие страницы,
// сверяет sitemap со списком индексируемых страниц и проверяет, что 404 закрыта от индексации.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = 'dist';
const ORIGIN = 'https://ehroz.pro';
const base = (process.env.SITE_BASE || '/').replace(/\/$/, '');
const errors = [];
const MAX_DEPTH = 3; // кликов от главной до любой важной страницы
const mirror = process.env.SITE_URL && process.env.SITE_URL !== ORIGIN;
const titles = new Map();
const descriptions = new Map();
const graph = new Map(); // страница → внутренние ссылки
const indexable = new Set();

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

  const out = new Set();
  graph.set(url, out);
  for (const [, raw] of html.matchAll(/\s(?:href|src)="([^"]*)"/g)) {
    const u = raw.split('#')[0].split('?')[0];
    if (u.startsWith('/') && !u.split('/').pop().includes('.')) out.add(u.slice(base.length) || '/');
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
  } else if (mirror) {
    if (!robots.includes('noindex')) err('зеркало должно быть noindex');
  } else {
    if (!canonical) err('нет canonical');
    else if (canonical !== ORIGIN + url) err(`canonical ${canonical} не совпадает с адресом страницы`);
    if (robots.includes('noindex')) err('страница закрыта noindex');
    indexable.add(url);
    if (!html.includes('hreflang="x-default"')) err('нет hreflang x-default');
  }
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  if (title.length < 10) err('нет title');
  else if ([...title].length > 65) err(`title длиннее 65 символов: ${title}`);
  if (desc.length < (is404 ? 20 : 50)) err('нет description или он слишком короткий');
  else if ([...desc].length > 165) err(`description длиннее 165 символов`);
  if (!is404) {
    if (titles.has(title)) err(`title повторяет ${titles.get(title)}`);
    if (descriptions.has(desc)) err(`description повторяет ${descriptions.get(desc)}`);
    titles.set(title, url);
    descriptions.set(desc, url);
  }
  for (const tag of ['og:title', 'og:description', 'og:image', 'og:image:alt', 'og:site_name', 'twitter:card', 'twitter:image']) {
    if (!new RegExp(`(property|name)="${tag}" content="[^"]+"`).test(html)) err(`нет ${tag}`);
  }
  if (!/<link rel="icon"/.test(html)) err('нет favicon');
  if (!/<html lang="(ru|en)"/.test(html)) err('нет lang у <html>');

  // JSON-LD: валидный JSON, один граф, у узлов @type, @id без повторов; FAQ и хлебные крошки — видны на странице.
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!is404 && ld.length !== 1) err(`блоков JSON-LD: ${ld.length} (нужен один граф)`);
  for (const [, raw] of ld) {
    let data;
    try { data = JSON.parse(raw); } catch (e) { err(`JSON-LD не парсится: ${e.message}`); continue; }
    if (data['@context'] !== 'https://schema.org') err('JSON-LD: нет @context https://schema.org');
    const nodes = data['@graph'] ?? [data];
    const ids = nodes.map((n) => n['@id']).filter(Boolean);
    if (new Set(ids).size !== ids.length) err('JSON-LD: повторяются @id');
    const known = new Set(ids);
    const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
    const norm = (t) => t.replace(/\s+/g, ' ').trim();
    for (const n of nodes) {
      if (!n['@type']) err('JSON-LD: узел без @type');
      for (const key of ['isPartOf', 'author', 'publisher', 'breadcrumb', 'about', 'mainEntity']) {
        const ref = n[key]?.['@id'];
        if (ref && !known.has(ref)) err(`JSON-LD: ${n['@type']}.${key} ссылается на отсутствующий ${ref}`);
      }
      if (/"(aggregateRating|review)":/.test(JSON.stringify(n))) err('JSON-LD: рейтинги/отзывы без реальных данных запрещены');
      if (n['@type'] === 'FAQPage') for (const q of n.mainEntity) {
        if (!text.includes(norm(q.name))) err(`JSON-LD FAQ: вопроса нет на странице: ${q.name}`);
      }
      if (n['@type'] === 'BreadcrumbList' && !html.includes('class="crumbs"')) err('JSON-LD: хлебные крошки не видны на странице');
      if (/Page$/.test(n['@type']) && n['@type'] !== 'FAQPage' && !n.dateModified) err(`JSON-LD: у ${n['@type']} нет dateModified`);
    }
  }

  // Заголовки: ровно один h1, он первый, уровни не перескакивают (h2 → h4).
  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1]);
  const h1 = levels.filter((l) => l === 1).length;
  if (h1 !== 1) err(`h1 на странице: ${h1}`);
  else if (levels[0] !== 1) err(`первый заголовок — h${levels[0]}, а не h1`);
  levels.forEach((l, i) => { if (i && l > levels[i - 1] + 1) err(`заголовки перескакивают: h${levels[i - 1]} → h${l}`); });
}

// Сироты и глубина: обход ссылок от главной.
const depth = new Map([['/', 0]]);
for (const queue = ['/']; queue.length; ) {
  const page = queue.shift();
  for (const next of graph.get(page) ?? []) {
    if (!depth.has(next)) { depth.set(next, depth.get(page) + 1); queue.push(next); }
  }
}
for (const page of indexable) {
  if (!depth.has(page)) errors.push(`${page}: страница-сирота — на неё нет ссылок с сайта`);
  else if (depth.get(page) > MAX_DEPTH) errors.push(`${page}: глубина ${depth.get(page)} клика от главной (больше ${MAX_DEPTH})`);
}

// Sitemap = ровно все индексируемые страницы, у каждой lastmod.
if (!mirror) {
  const xml = walk(ROOT).filter((f) => /sitemap-\d+\.xml$/.test(f)).map((f) => readFileSync(f, 'utf8')).join('');
  const inMap = new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(ORIGIN, '')));
  for (const p of indexable) if (!inMap.has(p)) errors.push(`sitemap: нет страницы ${p}`);
  for (const p of inMap) if (!indexable.has(p)) errors.push(`sitemap: лишний адрес ${p} (не индексируемая страница)`);
  const urls = (xml.match(/<url>/g) || []).length;
  if ((xml.match(/<lastmod>/g) || []).length !== urls) errors.push('sitemap: не у всех адресов есть lastmod');
  const robots = readFileSync(join(ROOT, 'robots.txt'), 'utf8');
  if (!robots.includes(`Sitemap: ${ORIGIN}/sitemap-index.xml`)) errors.push('robots.txt: нет адреса sitemap');
  if (/Disallow:\s*\/\s*$/m.test(robots)) errors.push('robots.txt закрывает весь сайт');
}

if (errors.length) {
  console.error(`SEO-проверка: ${errors.length} ошибок\n` + errors.map((e) => '  ✗ ' + e).join('\n'));
  process.exit(1);
}
console.log(`SEO-проверка: ${pages.length} страниц (${indexable.size} в индексе), макс. глубина ${Math.max(...depth.values())}, ошибок нет`);
