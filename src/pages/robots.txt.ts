import type { APIRoute } from 'astro';
import { PRODUCTION_ORIGIN } from '../i18n';

/**
 * Поисковые и AI-поисковые роботы — открыты (чтобы сайт находили и цитировали ChatGPT Search, Perplexity,
 * Google AI Overviews, Copilot, Gemini, Claude, Яндекс с Алисой).
 * Обучение моделей на текстах сайта — отдельная настройка: поставьте false, чтобы запретить GPTBot,
 * Google-Extended, ClaudeBot, CCBot и др. На видимость в поиске это не влияет.
 */
const ALLOW_AI_TRAINING = true;

/** Роботы поиска и ответов AI-ассистентов: находят страницы и ссылаются на них. */
const SEARCH_BOTS = [
  'Googlebot', 'Bingbot', 'YandexBot', 'DuckDuckBot', 'Applebot',
  'OAI-SearchBot', 'ChatGPT-User', // поиск ChatGPT и переходы по ссылкам из чата
  'PerplexityBot', 'Perplexity-User',
  'Claude-SearchBot', 'Claude-User',
  'YandexAdditional', // нейро-ответы Яндекса
];
/** Роботы, собирающие тексты для обучения моделей. */
const TRAINING_BOTS = ['GPTBot', 'Google-Extended', 'Applebot-Extended', 'ClaudeBot', 'CCBot', 'Meta-ExternalAgent', 'Bytespider'];

export const GET: APIRoute = ({ site }) => {
  if (site?.origin !== PRODUCTION_ORIGIN) {
    // Зеркала (GitHub Pages, превью) закрыты целиком, чтобы не было дублей.
    return text('User-agent: *\nDisallow: /\n');
  }
  const group = (bots: string[], rule: string) => bots.map((b) => `User-agent: ${b}`).join('\n') + `\n${rule}\n`;
  const body = [
    '# ehroz.pro — открыт для поиска, в том числе AI-поиска.',
    group(SEARCH_BOTS, 'Allow: /'),
    group(TRAINING_BOTS, ALLOW_AI_TRAINING ? 'Allow: /' : 'Disallow: /'),
    'User-agent: *\nAllow: /\n',
    `Sitemap: ${new URL('/sitemap-index.xml', site).href}`,
    '',
  ].join('\n');
  return text(body);
};

const text = (body: string) => new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
