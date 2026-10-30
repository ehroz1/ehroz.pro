/**
 * GA4 + Яндекс Метрика только после согласия. До «Разрешить» не грузится ничего и не ставится ни одной cookie.
 * События (одинаковые имена в GA4 и целями в Метрике):
 *   download_click, open_app_click, contact_click, order_click — конверсии (скачать, открыть веб-версию,
 *   написать, заказать сайт);
 *   outbound_click — уход на внешний сайт; internal_click — переход по сайту (откуда и куда);
 *   scroll_depth (25/50/75/90), read_complete — дочитывание;
 *   search — запросы в поиске (⌘K); language_switch; page_not_found; js_error.
 */
type W = Window & { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void; ym?: ((...a: unknown[]) => void) & { a?: unknown[]; l?: number } };
const w = window as W;
const root = document.getElementById('consent');
const ga4 = root?.dataset.ga4 || '';
const metrika = Number(root?.dataset.metrika || 0);
const KEY = 'consent.analytics';

const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
const save = (v: string) => { try { localStorage.setItem(KEY, v); } catch {} };

let started = false;
const queue: [string, Record<string, unknown>][] = [];

function load(src: string) {
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  document.head.append(s);
}

function start() {
  if (started) return;
  started = true;
  if (ga4) {
    w.dataLayer = w.dataLayer || [];
    w.gtag = function () { w.dataLayer!.push(arguments); };
    w.gtag('js', new Date());
    w.gtag('config', ga4);
    load(`https://www.googletagmanager.com/gtag/js?id=${ga4}`);
  }
  if (metrika) {
    w.ym = w.ym || Object.assign(function (...a: unknown[]) { (w.ym!.a = w.ym!.a || []).push(a); }, { l: Date.now() });
    w.ym(metrika, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: false });
    load('https://mc.yandex.ru/metrika/tag.js');
  }
  queue.splice(0).forEach(([n, p]) => track(n, p));
}

export function track(name: string, params: Record<string, unknown> = {}) {
  if (!started) { if (queue.length < 50) queue.push([name, params]); return; }
  w.gtag?.('event', name, params);
  if (metrika) w.ym?.(metrika, 'reachGoal', name, params);
}

// ── Согласие ──────────────────────────────────────────────
function decide(v: 'granted' | 'denied') {
  save(v);
  root?.setAttribute('hidden', '');
  if (v === 'granted') start();
  else if (started) location.reload(); // отозвали согласие — перезагрузка выгружает счётчики
}
root?.querySelector('[data-consent="yes"]')?.addEventListener('click', () => decide('granted'));
root?.querySelector('[data-consent="no"]')?.addEventListener('click', () => decide('denied'));
document.addEventListener('click', (e) => {
  if ((e.target as Element).closest('[data-consent-open]')) { e.preventDefault(); root?.removeAttribute('hidden'); }
});
const state = read();
if (state === 'granted') start();
else if (state !== 'denied') root?.removeAttribute('hidden');

// ── Клики ────────────────────────────────────────────────
const slug = document.documentElement.dataset.slug || 'home';
document.addEventListener('click', (e) => {
  const a = (e.target as Element).closest('a[href]') as HTMLAnchorElement | null;
  if (!a) return;
  const href = a.href;
  const label = (a.textContent || '').trim().slice(0, 80);
  if (href.startsWith('mailto:') || href.includes('t.me/')) return track('contact_click', { channel: href.startsWith('mailto:') ? 'email' : 'telegram', page: slug });
  const url = new URL(href, location.href);
  if (url.origin === location.origin) {
    if (a.hasAttribute('data-lang-switch')) return track('language_switch', { to: url.pathname });
    if (url.pathname !== location.pathname) track('internal_click', { from: location.pathname, to: url.pathname, label });
    return;
  }
  const kind = a.dataset.kind;
  if (kind === 'download' || kind === 'releases') track('download_click', { app: slug, url: href, label });
  else if (kind === 'open') track('open_app_click', { app: slug, url: href });
  else if (href.includes('dsgn.ehroz')) track('order_click', { page: slug });
  track('outbound_click', { url: href, domain: url.hostname, page: slug });
});

// ── Глубина прокрутки и дочитывание ──────────────────────
const marks = [25, 50, 75, 90];
const seen = new Set<number>();
const t0 = Date.now();
addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  if (max <= 0) return;
  const pct = (scrollY / max) * 100;
  for (const m of marks) if (pct >= m && !seen.has(m)) {
    seen.add(m);
    track('scroll_depth', { percent: m, page: slug });
    if (m === 90 && Date.now() - t0 > 15000) track('read_complete', { page: slug });
  }
}, { passive: true });

// ── Поиск (⌘K) ──────────────────────────────────────────
const input = document.querySelector<HTMLInputElement>('#spotlight input');
let timer = 0;
input?.addEventListener('input', () => {
  clearTimeout(timer);
  timer = window.setTimeout(() => {
    const q = input.value.trim();
    if (q.length > 1) track('search', { search_term: q.slice(0, 100), results: document.querySelectorAll('#spot-list [role="option"]').length });
  }, 1200);
});

// ── Ошибки ──────────────────────────────────────────────
if (document.querySelector('[data-spy="404"]')) track('page_not_found', { path: location.pathname, referrer: document.referrer });
let errors = 0;
const onError = (message: string) => { if (errors++ < 5) track('js_error', { message: message.slice(0, 150), page: location.pathname }); };
addEventListener('error', (e) => onError(e.message || 'resource'));
addEventListener('unhandledrejection', (e) => onError(String(e.reason)));
