import { apps } from '../content/apps';

/**
 * Прямые ссылки на файлы релизов.
 *
 * У Morfus и Morfu в имени файла есть версия (Morfus-1.4.2.zip), поэтому адрес вида
 * /releases/latest/download/<файл> собрать заранее нельзя. При сборке спрашиваем GitHub,
 * какой файл лежит в последнем релизе, и подставляем прямую ссылку — кнопка сразу скачивает файл.
 * Если GitHub не ответил, остаётся ссылка на страницу релиза (сборка не падает).
 *
 * Модуль меняет ссылки в `apps` при импорте: импортируйте его там, где ссылки выводятся.
 */
const token = process.env.GITHUB_TOKEN;

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
    console.warn(`[downloads] ${repo}: не удалось получить последний релиз (${(e as Error).message}), оставляю ссылку на страницу релиза`);
    return null;
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
