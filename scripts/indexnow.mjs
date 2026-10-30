// IndexNow: сообщает Яндексу и Bing (и другим участникам протокола) о новых и изменённых страницах.
// Запускается после продакшн-деплоя (.github/workflows/indexnow.yml) или вручную:
//   node scripts/indexnow.mjs          — страницы с lastmod за последние 3 дня
//   node scripts/indexnow.mjs --all    — все страницы из sitemap
// Ключ — публичный по протоколу: файл public/<KEY>.txt лежит на сайте.
const ORIGIN = 'https://ehroz.pro';
const KEY = '5a72b9009b4053c1a7ca861d41a86cac';
const DAYS = 3;

const all = process.argv.includes('--all');
const get = async (u) => {
  const r = await fetch(u);
  if (!r.ok) throw new Error(`${u}: ${r.status}`);
  return r.text();
};
const index = await get(`${ORIGIN}/sitemap-index.xml`);
const maps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const since = Date.now() - DAYS * 864e5;
const urls = [];
for (const map of maps) {
  for (const [, block] of (await get(map)).matchAll(/<url>(.*?)<\/url>/gs)) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
    if (loc && (all || !lastmod || Date.parse(lastmod) >= since)) urls.push(loc);
  }
}
if (!urls.length) {
  console.log(`IndexNow: за ${DAYS} дн. изменений нет — отправлять нечего`);
  process.exit(0);
}
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(ORIGIN).host, key: KEY, keyLocation: `${ORIGIN}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: ${res.status} ${res.statusText}, отправлено адресов: ${urls.length}`);
urls.forEach((u) => console.log('  ' + u));
if (res.status >= 400) process.exit(1);
