// OG-картинки 1200×630: иконка, название, фраза — рендер SVG → PNG через resvg при сборке.
import { readFileSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';
import type { App, Lang } from '../content/apps';
import { apps } from '../content/apps';

// Сборка Astro переносит этот модуль в dist/, поэтому пути — от корня проекта.
const root = new URL(`file://${process.cwd()}/`);
const fontFiles = ['latin-700', 'cyrillic-700', 'latin-400', 'cyrillic-400'].map((f) => new URL(`assets-src/fonts/inter-${f}.ttf`, root).pathname);
const icon = (slug: string) => `data:image/png;base64,${readFileSync(new URL(`public/icons/${slug}-512.png`, root)).toString('base64')}`;
const esc = (s: string) => s.replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[m]!);

function wrap(text: string, max: number): string[] {
  const out: string[] = [];
  let line = '';
  for (const w of text.split(' ')) {
    if ((line + ' ' + w).trim().length > max && line) {
      out.push(line);
      line = w;
    } else line = (line + ' ' + w).trim();
  }
  if (line) out.push(line);
  return out;
}

const frame = (glow: [string, string, string], body: string) => `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="a" cx="0.15" cy="0.2" r="0.7"><stop offset="0" stop-color="${glow[0]}" stop-opacity=".85"/><stop offset="1" stop-color="${glow[0]}" stop-opacity="0"/></radialGradient>
    <radialGradient id="b" cx="0.9" cy="0.25" r="0.6"><stop offset="0" stop-color="${glow[1]}" stop-opacity=".7"/><stop offset="1" stop-color="${glow[1]}" stop-opacity="0"/></radialGradient>
    <radialGradient id="c" cx="0.55" cy="1.05" r="0.7"><stop offset="0" stop-color="${glow[2]}" stop-opacity=".75"/><stop offset="1" stop-color="${glow[2]}" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#08080b"/>
  <rect width="1200" height="630" fill="url(#a)"/>
  <rect width="1200" height="630" fill="url(#b)"/>
  <rect width="1200" height="630" fill="url(#c)"/>
  <rect width="1200" height="630" fill="#08080b" opacity=".35"/>
  ${body}
  <text x="80" y="574" font-family="Inter" font-weight="700" font-size="26" fill="#f5f5f7" opacity=".85">ehroz.pro</text>
</svg>`;

const render = (svg: string) =>
  new Resvg(svg, { font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Inter' }, fitTo: { mode: 'width', value: 1200 } }).render().asPng();

export function appOg(app: App, lang: Lang): Buffer {
  const lines = wrap(app.short[lang], 30);
  const status = { ready: { ru: 'Готово', en: 'Available' }, beta: { ru: 'Скоро релиз', en: 'Coming soon' }, dev: { ru: 'В разработке', en: 'In development' } }[app.status][lang];
  const plats = app.platforms.map((p) => ({ macos: 'macOS', windows: 'Windows', web: lang === 'ru' ? 'Веб' : 'Web' })[p]).join(' · ');
  const body = `
    <image x="40" y="105" width="420" height="420" xlink:href="${icon(app.slug)}"/>
    <text x="500" y="260" font-family="Inter" font-weight="700" font-size="${app.name.length > 7 ? 104 : 124}" letter-spacing="-5" fill="#f5f5f7">${esc(app.name)}</text>
    ${lines.map((l, i) => `<text x="504" y="${330 + i * 50}" font-family="Inter" font-weight="400" font-size="40" fill="#f5f5f7" opacity=".78">${esc(l)}</text>`).join('')}
    <text x="504" y="${330 + lines.length * 50 + 46}" font-family="Inter" font-weight="700" font-size="24" fill="#f5f5f7" opacity=".6">${esc(`${plats}  ·  ${status}${app.version ? `  ·  v${app.version}` : ''}`)}</text>`;
  return render(frame(app.glow, body));
}

export function homeOg(lang: Lang): Buffer {
  const icons = apps.map((a, i) => `<image x="${80 + i * 152}" y="330" width="150" height="150" xlink:href="${icon(a.slug)}"/>`).join('');
  const t2 = lang === 'ru' ? 'Небольшие инструменты, которые экономят время.' : 'Small tools that save time.';
  const lines = wrap(t2, 30);
  const body = `
    <text x="80" y="150" font-family="Inter" font-weight="700" font-size="92" letter-spacing="-4" fill="#f5f5f7">Ehroz.</text>
    ${lines.map((l, i) => `<text x="80" y="${222 + i * 60}" font-family="Inter" font-weight="700" font-size="54" letter-spacing="-2" fill="#f5f5f7" opacity="${i ? 0.55 : 0.9}">${esc(l)}</text>`).join('')}
    ${icons}`;
  return render(frame(['#5b4a9c', '#2b6f8c', '#9c4a6b'], body));
}
