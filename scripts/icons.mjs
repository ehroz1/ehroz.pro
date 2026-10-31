// Готовит иконки приложений для сайта: public/icons/<slug>-{160,320,640}.webp и <slug>-512.png.
// Исходники — assets-src/icons. Иконки без «макосовской» рамки (Picta, BLA-БЛА, radius)
// вписываются в скруглённый квадрат 824/1024 с тенью, как остальные.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

const SRC = new URL('../assets-src/icons/', import.meta.url);
const OUT = new URL('../public/icons/', import.meta.url);
await mkdir(OUT, { recursive: true });

const frame = (inner, bg = '#fff') => `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <filter id="sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000" flood-opacity=".28"/>
    </filter>
    <clipPath id="sq"><rect x="100" y="100" width="824" height="824" rx="186"/></clipPath>
  </defs>
  <rect x="100" y="100" width="824" height="824" rx="186" fill="${bg}" filter="url(#sh)"/>
  <g clip-path="url(#sq)">${inner}</g>
  <rect x="100.5" y="100.5" width="823" height="823" rx="185.5" fill="none" stroke="#fff" stroke-opacity=".18"/>
</svg>`;

const dataUri = async (file, mime) => `data:${mime};base64,${(await readFile(new URL(file, SRC))).toString('base64')}`;
const render = (svg) => new Resvg(svg, { fitTo: { mode: 'width', value: 1024 } }).render().asPng();

const sources = {
  morfus: await readFile(new URL('morfus.png', SRC)),
  morfu: await readFile(new URL('morfu.png', SRC)),
  pachaq: await readFile(new URL('pachaq.png', SRC)),
  sukhan: await sharp(await readFile(new URL('sukhan.png', SRC))).resize(1024, 1024).png().toBuffer(),
  picta: render(frame(`<image x="100" y="100" width="824" height="824" xlink:href="${await dataUri('picta-raw.png', 'image/png')}"/>`, '#0b0b0f')),
  'bla-bla': render(frame(`<image x="232" y="226" width="560" height="580" xlink:href="${await dataUri('bla-logo.svg', 'image/svg+xml')}"/>`, '#ffffff')),
  radius: await readFile(new URL('radius.png', SRC)).catch(() => null),
  padbridge: await readFile(new URL('padbridge.png', SRC)),
  'moss-pocket': await readFile(new URL('moss-pocket.png', SRC)),
  peecube: await readFile(new URL('peecube.png', SRC)),
  snowpuff: await readFile(new URL('snowpuff.png', SRC)),
  // ANY CAMERA: иконка расширения — квадрат во всю площадь, вписываем в рамку как остальные
  'any-camera': render(frame(`<image x="100" y="100" width="824" height="824" xlink:href="${await dataUri('any-camera.svg', 'image/svg+xml')}"/>`, '#5b3cf0')),
};

if (!sources.radius) {
  // radius: своей иконки в репозиториях нет — простой знак: силуэт, наполовину «вырезанный» на шахматке.
  const cells = [];
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) if ((x + y) % 2) cells.push(`<rect x="${100 + x * 51.5}" y="${100 + y * 51.5}" width="51.5" height="51.5"/>`);
  sources.radius = render(frame(`
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c2f36"/><stop offset="1" stop-color="#101114"/></linearGradient>
      <linearGradient id="s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#c9ccd6"/></linearGradient>
      <clipPath id="left"><rect x="100" y="100" width="412" height="824"/></clipPath>
      <clipPath id="fig"><circle cx="512" cy="410" r="112"/><path d="M296 924 C296 716 396 590 512 590 C628 590 728 716 728 924 Z"/></clipPath>
    </defs>
    <rect x="100" y="100" width="824" height="824" fill="url(#g)"/>
    <g clip-path="url(#left)"><rect x="100" y="100" width="824" height="824" fill="#e9eaee"/><g fill="#c4c7cf">${cells.join('')}</g></g>
    <g clip-path="url(#fig)"><rect x="100" y="100" width="824" height="824" fill="url(#s)"/></g>
    <line x1="512" y1="140" x2="512" y2="884" stroke="#fff" stroke-width="6" stroke-opacity=".9"/>
    <circle cx="512" cy="512" r="30" fill="#fff"/><path d="M500 498 l-12 14 l12 14 M524 498 l12 14 l-12 14" stroke="#101114" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  `, '#101114'));
}

for (const [slug, buf] of Object.entries(sources)) {
  for (const w of [160, 320, 640]) {
    await sharp(buf).resize(w, w).webp({ quality: 88, effort: 6 }).toFile(new URL(`${slug}-${w}.webp`, OUT).pathname);
  }
  await sharp(buf).resize(512, 512).png({ compressionLevel: 9 }).toFile(new URL(`${slug}-512.png`, OUT).pathname);
  console.log('icon', slug);
}

// ── Фавиконки: знак ehroz.pro (кольцо из шести долек, одна «горячая») ──
function sectors(n, cx, cy, rOut, rIn, gap, start) {
  const rad = (d) => ((d - 90) * Math.PI) / 180;
  const pt = (r, d) => [cx + r * Math.cos(rad(d)), cy + r * Math.sin(rad(d))].map((v) => v.toFixed(2)).join(' ');
  const step = 360 / n;
  return Array.from({ length: n }, (_, i) => {
    const a0 = start + i * step - step / 2, a1 = a0 + step;
    const go = ((gap / 2 / rOut) * 180) / Math.PI, gi = ((gap / 2 / rIn) * 180) / Math.PI;
    return `M${pt(rOut, a0 + go)} A${rOut} ${rOut} 0 0 1 ${pt(rOut, a1 - go)} L${pt(rIn, a1 - gi)} A${rIn} ${rIn} 0 0 0 ${pt(rIn, a0 + gi)} Z`;
  });
}
const sec = sectors(6, 32, 32, 22, 10, 3.2, 30);
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="#111114"/>${sec
  .map((d, i) => `<path d="${d}" fill="#f5f5f7" stroke="#f5f5f7" stroke-width="2.4" stroke-linejoin="round" opacity="${i === 0 ? 1 : 0.4}"/>`)
  .join('')}</svg>`;
const PUB = new URL('../public/', import.meta.url);
await writeFile(new URL('favicon.svg', PUB), favicon);
const fav = new Resvg(favicon, { fitTo: { mode: 'width', value: 180 } }).render().asPng();
await sharp(fav).resize(32, 32).png().toFile(new URL('favicon-32.png', PUB).pathname);
await sharp(fav).resize(180, 180).png().toFile(new URL('apple-touch-icon.png', PUB).pathname);
console.log('favicon');
