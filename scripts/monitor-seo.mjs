// Мониторинг индексации живого сайта. Раз в неделю запускается в GitHub Actions
// (.github/workflows/seo-monitor.yml); при ошибке GitHub пришлёт письмо владельцу репозитория.
// Вручную: node scripts/monitor-seo.mjs   (SITE=http://localhost:4321 — проверить локальный preview)
// Что проверяет: robots.txt, sitemap, что число страниц в sitemap не упало, что каждая страница
// отдаёт 200 без редиректа, не закрыта noindex и ссылается canonical сама на себя; редиректы http/www.
const ORIGIN = 'https://ehroz.pro';
const SITE = (process.env.SITE || ORIGIN).replace(/\/$/, '');
const MIN_URLS = Number(process.env.MIN_URLS || 20); // сейчас 24; резкое падение — тревога
const live = SITE === ORIGIN;
const errors = [];
const local = (u) => u.replace(ORIGIN, SITE);

async function get(u, opts = {}) {
  try {
    return await fetch(u, { redirect: 'manual', headers: { 'User-Agent': 'ehroz-seo-monitor' }, ...opts });
  } catch (e) {
    errors.push(`${u}: не открывается (${e.message})`);
    return null;
  }
}

const robots = await get(`${SITE}/robots.txt`);
const robotsTxt = robots?.ok ? await robots.text() : '';
if (!robots?.ok) errors.push(`robots.txt: статус ${robots?.status}`);
if (/^Disallow:\s*\/\s*$/m.test(robotsTxt)) errors.push('robots.txt закрывает весь сайт');
if (!robotsTxt.includes(`Sitemap: ${ORIGIN}/sitemap-index.xml`)) errors.push('robots.txt: нет адреса sitemap');

const urls = [];
const index = await get(`${SITE}/sitemap-index.xml`);
if (!index?.ok) errors.push(`sitemap-index.xml: статус ${index?.status}`);
else {
  for (const [, map] of (await index.text()).matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const r = await get(local(map));
    if (!r?.ok) { errors.push(`${map}: статус ${r?.status}`); continue; }
    for (const [, loc] of (await r.text()).matchAll(/<loc>([^<]+)<\/loc>/g)) urls.push(loc);
  }
}
if (urls.length < MIN_URLS) errors.push(`в sitemap ${urls.length} адресов — меньше порога ${MIN_URLS}`);

for (const url of urls) {
  const r = await get(local(url));
  if (!r) continue;
  if (r.status !== 200) { errors.push(`${url}: статус ${r.status}${r.headers.get('location') ? ' → ' + r.headers.get('location') : ''}`); continue; }
  const html = await r.text();
  if (/noindex/i.test(r.headers.get('x-robots-tag') || '')) errors.push(`${url}: заголовок X-Robots-Tag: noindex`);
  if (/<meta name="robots" content="[^"]*noindex/.test(html)) errors.push(`${url}: meta robots noindex`);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (canonical !== url) errors.push(`${url}: canonical ${canonical ?? 'отсутствует'}`);
}

const nf = await get(`${SITE}/seo-monitor-missing-page/`);
if (nf && nf.status !== 404) errors.push(`несуществующая страница отдаёт ${nf.status} вместо 404`);

if (live) {
  for (const [from, to] of [
    ['http://ehroz.pro/', 'https://ehroz.pro/'],
    ['https://www.ehroz.pro/', 'https://ehroz.pro/'],
    ['https://ehroz.pro/morfus', 'https://ehroz.pro/morfus/'],
  ]) {
    const r = await get(from);
    const loc = r?.headers.get('location');
    if (!r || ![301, 308].includes(r.status) || new URL(loc, from).href !== to) errors.push(`редирект ${from}: ${r?.status} → ${loc} (ждём 301/308 → ${to})`);
  }
}

if (errors.length) {
  console.error(`SEO-мониторинг ${SITE}: ${errors.length} проблем\n` + errors.map((e) => '  ✗ ' + e).join('\n'));
  process.exit(1);
}
console.log(`SEO-мониторинг ${SITE}: ${urls.length} страниц в sitemap, всё в порядке`);
