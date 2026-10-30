/**
 * Content Security Policy. После сборки в каждую HTML-страницу встраивается <meta http-equiv="Content-Security-Policy">
 * с SHA-256 хешами её inline-скриптов: выполнится только наш код, внедрённый скрипт браузер заблокирует (защита от XSS).
 * Директивы, которые не работают в meta (frame-ancestors), отдаются заголовком из vercel.json / public/_headers.
 * Домены GA4 и Метрики добавляются, только если их ID заданы в src/analytics.config.ts.
 */
import type { AstroIntegration } from 'astro';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ANALYTICS } from '../analytics.config';

const GA = ANALYTICS.ga4
  ? {
      script: ['https://www.googletagmanager.com'],
      connect: ['https://*.google-analytics.com', 'https://*.analytics.google.com', 'https://www.googletagmanager.com'],
      img: ['https://*.google-analytics.com', 'https://www.googletagmanager.com'],
      frame: [] as string[],
    }
  : null;
const YM = ANALYTICS.metrika
  ? {
      script: ['https://mc.yandex.ru', 'https://yastatic.net'],
      connect: ['https://mc.yandex.ru', 'https://mc.yandex.com'],
      img: ['https://mc.yandex.ru', 'https://mc.yandex.com'],
      frame: ['https://mc.yandex.ru', 'https://mc.yandex.com'],
    }
  : null;
// Панель комментариев Vercel на превью-деплоях.
const VERCEL = { script: ['https://vercel.live'], connect: ['https://vercel.live', 'wss://ws-us3.pusher.com'], img: ['https://vercel.live', 'https://vercel.com'], frame: ['https://vercel.live'] };
const extra = [GA, YM, VERCEL].filter(Boolean) as (typeof VERCEL)[];
const all = (k: keyof typeof VERCEL) => extra.flatMap((e) => e[k]);

export function policy(hashes: string[]) {
  return [
    "default-src 'self'",
    `script-src 'self' ${hashes.map((h) => `'sha256-${h}'`).join(' ')} ${all('script').join(' ')}`.replace(/\s+/g, ' ').trim(),
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: ${all('img').join(' ')}`.trim(),
    "font-src 'self'",
    `connect-src 'self' ${all('connect').join(' ')}`.trim(),
    `frame-src ${all('frame').join(' ') || "'none'"}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
}

const INLINE = /<script(?![^>]*\ssrc=)(?![^>]*type="application\/(?:ld\+)?json")[^>]*>([\s\S]*?)<\/script>/g;

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

export default function csp(): AstroIntegration {
  return {
    name: 'ehroz-csp',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const files = walk(fileURLToPath(dir)).filter((f) => f.endsWith('.html'));
        for (const file of files) {
          const html = readFileSync(file, 'utf8');
          const hashes = [...new Set([...html.matchAll(INLINE)].map((m) => createHash('sha256').update(m[1]).digest('base64')))];
          const meta = `<meta http-equiv="Content-Security-Policy" content="${policy(hashes)}">`;
          writeFileSync(file, html.replace(/<meta charset="utf-8">/i, (m) => `${m}\n    ${meta}`));
        }
        logger.info(`CSP добавлена в ${files.length} страниц`);
      },
    },
  };
}
