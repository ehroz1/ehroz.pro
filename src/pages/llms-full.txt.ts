import type { APIRoute } from 'astro';
import { apps } from '../content/apps';
import type { Lang } from '../content/apps';
import { PLATFORM, STATUS, path, pick, tr } from '../i18n';

/** /llms-full.txt — полный текст страниц приложений (RU и EN) в Markdown для нейросетей. */
export const GET: APIRoute = ({ site }) => {
  const u = (p: string) => new URL(p, site).href;
  const block = (lang: Lang) =>
    apps.map((a) => [
      `## ${a.name} — ${pick(lang, a.short)}`,
      '',
      `URL: ${u(path(lang, a.slug))}`,
      `${lang === 'ru' ? 'Платформы' : 'Platforms'}: ${a.platforms.map((p) => pick(lang, PLATFORM[p])).join(', ')} · ${lang === 'ru' ? 'Статус' : 'Status'}: ${pick(lang, STATUS[a.status])}${a.version ? ` · ${tr(lang, 'page.version')}: ${a.version}` : ''} · ${lang === 'ru' ? 'Обновлено' : 'Updated'}: ${a.updated}`,
      '',
      pick(lang, a.tagline),
      '',
      pick(lang, a.about),
      '',
      `### ${tr(lang, 'page.for')}`,
      '',
      pick(lang, a.audience),
      '',
      `### ${tr(lang, 'page.features')}`,
      '',
      ...a.features.map((f) => `- **${pick(lang, f.title)}.** ${pick(lang, f.text)}`),
      '',
      `### ${tr(lang, 'page.how')}`,
      '',
      ...a.steps.map((s, i) => `${i + 1}. ${pick(lang, s)}`),
      '',
      `### ${tr(lang, 'page.faq')}`,
      '',
      ...a.faq.flatMap((q) => [`**${pick(lang, q.q)}**`, '', pick(lang, q.a), '']),
      `### ${tr(lang, 'page.req')}`,
      '',
      ...a.requirements.map((r) => `- ${pick(lang, r)}`),
      '',
      ...a.links.map((l) => `- ${pick(lang, l.label)}: ${l.href}`),
      '',
    ].join('\n')).join('\n');
  const body = `# Ehroz — apps and tools (ehroz.pro)\n\nAuthor: Ehroz (Эхроз), designer & developer, Astana, Kazakhstan.\n\n# English\n\n${block('en')}\n# Русский\n\n${block('ru')}`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
