// OG-картинки 1200×630 в стиле каталога: тёмный фон, линии сетки, ярлык номера цвета изделия,
// иконка на подложке, Medeo Sans / Mono, полоса иката. Рендер SVG → PNG через resvg при сборке.
import { readFileSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';
import type { App, Lang } from '../content/apps';
import { apps } from '../content/apps';

// Сборка Astro переносит этот модуль в dist/, поэтому пути — от корня проекта.
const root = new URL(`file://${process.cwd()}/`);
const fontFiles = ['medeo-sans-700', 'medeo-sans-400', 'medeo-mono-500'].map((f) => new URL(`assets-src/fonts/${f}.ttf`, root).pathname);
const icon = (slug: string) => `data:image/png;base64,${readFileSync(new URL(`public/icons/${slug}-512.png`, root)).toString('base64')}`;
const esc = (s: string) => s.replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[m]!);

const BG = '#0e0e0f';
const PLATE = '#1b1b1d';
const LINE = '#2a2a2d';
const TEXT = '#f2f0eb';
const MUTED = '#a3a09a';
const FAINT = '#8e8b85';

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

const mono = (x: number, y: number, s: string, fill = FAINT, anchor = 'start') =>
  `<text x="${x}" y="${y}" font-family="Medeo Mono" font-weight="500" font-size="15" letter-spacing="1.6" fill="${fill}" text-anchor="${anchor}">${esc(s.toUpperCase())}</text>`;

const frame = (body: string, ikatColor: string) => `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <pattern id="adras" width="28" height="14" patternUnits="userSpaceOnUse">
      <path fill="${ikatColor}" d="M12 0h4v2h2v2h2v2h2v2h-2v2h-2v2h-2v2h-4v-2h-2v-2h-2V8H6V6h2V4h2V2h2z"/>
    </pattern>
    <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="#ffffff" fill-opacity=".07"/></pattern>
  </defs>
  <rect width="1200" height="630" fill="${BG}"/>
  <path d="M0 64H1200M0 566H1200" stroke="${LINE}" stroke-width="1"/>
  ${body}
  <rect x="0" y="616" width="1200" height="14" fill="url(#adras)"/>
  ${mono(56, 42, 'ehroz.pro', TEXT)}
  ${mono(1144, 42, 'Ehroz · designer & developer', FAINT, 'end')}
</svg>`;

const render = (svg: string) =>
  new Resvg(svg, { font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Medeo Sans' }, fitTo: { mode: 'width', value: 1200 } }).render().asPng();

export function appOg(app: App, lang: Lang): Buffer {
  const i = apps.indexOf(app);
  const no = String(i + 1).padStart(2, '0');
  const lines = wrap(app.short[lang], 32);
  const status = { ready: { ru: 'Готово', en: 'Available' }, beta: { ru: 'Скоро релиз', en: 'Coming soon' }, dev: { ru: 'В разработке', en: 'In development' } }[app.status][lang];
  const plats = app.platforms.map((p) => ({ macos: 'macOS', windows: 'Windows', web: lang === 'ru' ? 'Веб' : 'Web' })[p]).join(' · ');
  const tint = app.tint.dark;
  const body = `
    <rect x="760" y="64" width="440" height="502" fill="${PLATE}"/>
    <rect x="760" y="64" width="440" height="502" fill="url(#dots)"/>
    <path d="M760 64V566" stroke="${LINE}"/>
    <path d="M780 84h14M780 84v14M1180 84h-14M1180 84v14M780 546h14M780 546v-14M1180 546h-14M1180 546v-14" stroke="${FAINT}"/>
    <image x="820" y="155" width="320" height="320" xlink:href="${icon(app.slug)}"/>
    <rect x="56" y="104" width="52" height="26" fill="${tint}"/>
    <text x="82" y="123" font-family="Medeo Mono" font-weight="500" font-size="16" fill="${BG}" text-anchor="middle">${no}</text>
    ${mono(124, 123, esc(app.kind[lang]))}
    <text x="52" y="268" font-family="Medeo Sans" font-weight="700" font-size="${app.name.length > 7 ? 118 : 138}" letter-spacing="-6" fill="${TEXT}">${esc(app.name)}</text>
    ${lines.map((l, k) => `<text x="56" y="${340 + k * 46}" font-family="Medeo Sans" font-weight="400" font-size="36" fill="${MUTED}">${esc(l)}</text>`).join('')}
    ${mono(56, 530, `${plats}   ·   ${status}${app.version ? `   ·   v${app.version}` : ''}`, TEXT)}`;
  return render(frame(body, tint));
}

export function homeOg(lang: Lang): Buffer {
  const cell = 106;
  const icons = apps
    .map((a, k) => {
      const x = 760 + (k % 4) * cell,
        y = 120 + Math.floor(k / 4) * 190;
      return `<rect x="${x + 4}" y="${y - 22}" width="26" height="16" fill="${a.tint.dark}"/><text x="${x + 17}" y="${y - 10}" font-family="Medeo Mono" font-weight="500" font-size="11" fill="${BG}" text-anchor="middle">${String(k + 1).padStart(2, '0')}</text>
        <image x="${x}" y="${y}" width="${cell - 6}" height="${cell - 6}" xlink:href="${icon(a.slug)}"/>
        <text x="${x + (cell - 6) / 2}" y="${y + cell + 10}" font-family="Medeo Sans" font-weight="700" font-size="15" fill="${TEXT}" text-anchor="middle">${esc(a.name)}</text>`;
    })
    .join('');
  const t2 = lang === 'ru' ? ['Небольшие', 'инструменты,'] : ['Small tools'];
  const t3 = lang === 'ru' ? ['которые экономят', 'время.'] : ['that save time.'];
  const body = `
    <path d="M736 64V566" stroke="${LINE}"/>
    ${mono(56, 104, lang === 'ru' ? '01 / Мастерская Ehroz' : '01 / Ehroz workshop')}
    <text x="50" y="222" font-family="Medeo Sans" font-weight="700" font-size="120" letter-spacing="-6" fill="${TEXT}">Ehroz.</text>
    ${[...t2.map((l) => [l, TEXT]), ...t3.map((l) => [l, '#7c93ff'])]
      .map(([l, c], k) => `<text x="54" y="${300 + k * 58}" font-family="Medeo Sans" font-weight="700" font-size="56" letter-spacing="-2.5" fill="${c}">${esc(l)}</text>`)
      .join('')}
    ${icons}`;
  return render(frame(body, '#7c93ff'));
}
