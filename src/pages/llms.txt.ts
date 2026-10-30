import type { APIRoute } from 'astro';
import { apps } from '../content/apps';
import { CONTACTS, PLATFORM, STATUS, path, pick } from '../i18n';

/**
 * /llms.txt — краткая карта сайта для нейросетей (формат llmstxt.org): кто автор, какие продукты,
 * ссылки на страницы. Собирается из apps.ts, поэтому всегда совпадает с сайтом.
 */
export const GET: APIRoute = ({ site }) => {
  const u = (p: string) => new URL(p, site).href;
  const c = CONTACTS;
  const lines = [
    '# Ehroz (ehroz.pro)',
    '',
    `> Ehroz (Эхроз) — designer and developer from Astana, Kazakhstan. ehroz.pro is the showcase of Ehroz’s small apps and tools for macOS, Windows and the web: converters, image compression, auto captions, transcription and image search. Russian is the main language (${u(path('ru'))}), English is at ${u(path('en'))}.`,
    '',
    `Contacts: Telegram @${c.telegram} (https://t.me/${c.telegram}), email ${c.email}, GitHub https://github.com/${c.github}. Full text of every app page: ${u('/llms-full.txt')}.`,
    '',
    '## Apps',
    '',
    ...apps.map((a) => `- [${a.name}](${u(path('en', a.slug))}): ${pick('en', a.short)}. ${a.platforms.map((p) => PLATFORM[p].en).join(', ')}; status: ${pick('en', STATUS[a.status])}${a.version ? `, version ${a.version}` : ''}. Russian: ${u(path('ru', a.slug))}`),
    '',
    '## About',
    '',
    `- [About Ehroz](${u(path('en', 'about'))}): who makes the apps and how.`,
    `- [Contacts](${u(path('en', 'contacts'))}): how to get in touch or order a website.`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
