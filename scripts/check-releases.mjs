// Проверяет последние релизы приложений на GitHub и записывает их в JSON-файл
// (по умолчанию src/content/releases.json, путь можно задать в RELEASES_FILE).
// Запускается по расписанию (.github/workflows/releases.yml): если вышла новая версия, файл меняется,
// и workflow вызывает Deploy Hook Vercel — сайт пересобирается с новыми прямыми ссылками на скачивание.
// Репозитории берутся из ссылок вида github.com/<owner>/<repo>/releases в src/content/apps.ts.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const APPS = 'src/content/apps.ts';
const OUT = process.env.RELEASES_FILE || 'src/content/releases.json';
const token = process.env.GITHUB_TOKEN;

const repos = [...new Set([...readFileSync(APPS, 'utf8').matchAll(/github\.com\/([\w.-]+\/[\w.-]+)\/releases/g)].map((m) => m[1]))].sort();
const prev = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {};
const next = {};

for (const repo of repos) {
  const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
    headers: { Accept: 'application/vnd.github+json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (res.status === 404) { console.log(`${repo}: релизов нет`); continue; }
  if (!res.ok) {
    // Временная ошибка GitHub — оставляем старые данные, чтобы не было ложной пересборки.
    console.warn(`${repo}: HTTP ${res.status}, оставляю прежние данные`);
    if (prev[repo]) next[repo] = prev[repo];
    continue;
  }
  const d = await res.json();
  next[repo] = {
    tag: d.tag_name,
    assets: Object.fromEntries((d.assets ?? []).map((a) => [a.name, a.browser_download_url])),
  };
  console.log(`${repo}: ${d.tag_name}${prev[repo]?.tag && prev[repo].tag !== d.tag_name ? ` (было ${prev[repo].tag})` : ''}`);
}

const text = JSON.stringify(next, null, 2) + '\n';
if (!existsSync(OUT) || readFileSync(OUT, 'utf8') !== text) {
  writeFileSync(OUT, text);
  console.log('releases.json обновлён');
} else {
  console.log('Новых релизов нет');
}
