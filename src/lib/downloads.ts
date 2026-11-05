import { apps } from '../content/apps';
import releases from '../content/releases.json';

/**
 * Прямые ссылки на файлы релизов.
 *
 * У Morfus и Morfu в имени файла есть версия (Morfus-1.4.2.zip), поэтому адрес вида
 * /releases/latest/download/<файл> собрать заранее нельзя. При сборке спрашиваем GitHub,
 * какой файл лежит в последнем релизе, и подставляем прямую ссылку — кнопка сразу скачивает файл.
 * Если API не ответил, берём ссылку из src/content/releases.json (обновляется вручную:
 * `node scripts/check-releases.mjs`). Если и там нет — остаётся ссылка на страницу релиза.
 * После нового релиза сайт пересобирается сам — workflow «Releases» вызывает Deploy Hook Vercel.
 *
 * Модуль меняет ссылки в `apps` при импорте: импортируйте его там, где ссылки выводятся.
 */
const token = process.env.GITHUB_TOKEN;

const known = releases as Record<string, { tag: string; assets: Record<string, string> }>;

async function latestAsset(repo: string, pattern: RegExp): Promise<string | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
      headers: { Accept: 'application/vnd.github+json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { assets?: { name: string; browser_download_url: string }[] };
    return data.assets?.find((a) => pattern.test(a.name))?.browser_download_url ?? null;
  } catch (e) {
    const fromFile = Object.entries(known[repo]?.assets ?? {}).find(([name]) => pattern.test(name))?.[1];
    console.warn(`[downloads] ${repo}: API GitHub не ответил (${(e as Error).message}), ${fromFile ? 'беру ссылку из releases.json' : 'оставляю ссылку на страницу релиза'}`);
    return fromFile ?? null;
  }
}

await Promise.all(
  apps.flatMap((app) =>
    app.links.map(async (link) => {
      if (!link.asset) return;
      const m = link.href.match(/github\.com\/([^/]+\/[^/]+)\/releases/);
      if (!m) return;
      const url = await latestAsset(m[1], link.asset);
      if (url) link.href = url;
    }),
  ),
);

export {};
