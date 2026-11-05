import { initScenes } from './scenes';
import './scenes-more';

const $ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(s));
const reduced = (matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'reduce');
const lang = document.documentElement.lang === 'en' ? 'en' : 'ru';

/* ── Тема ── */
type Pref = 'auto' | 'dark' | 'light';
function setTheme(p: Pref) {
  const d = document.documentElement;
  d.setAttribute('data-theme-pref', p);
  if (p === 'auto') d.removeAttribute('data-theme');
  else d.setAttribute('data-theme', p);
  try {
    localStorage.setItem('theme', p);
  } catch {}
}
const pref = (): Pref => (document.documentElement.getAttribute('data-theme-pref') as Pref) || 'auto';
setTheme(pref());
// По умолчанию тема как в системе; кнопка в меню меняет тёмную на светлую и обратно.
const isLight = () => pref() === 'light' || (pref() === 'auto' && matchMedia('(prefers-color-scheme: light)').matches);
$$('[data-theme-toggle]').forEach((b) => b.addEventListener('click', () => setTheme(isLight() ? 'dark' : 'light')));

// Ручной переключатель анимаций убран, работает только системная настройка «Уменьшить движение».
try { localStorage.removeItem('motion'); } catch {}

/* ── Часы: Астана, UTC+5 (без опоры на базу часовых поясов браузера — она могла устареть) ── */
const clocks = $$('[data-clock]');
function tick() {
  const now = new Date(Date.now() + 5 * 3600 * 1000);
  const loc = lang === 'ru' ? 'ru-RU' : 'en-US';
  const time = now.toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit', hour12: lang === 'en', timeZone: 'UTC' });
  const day = now.toLocaleDateString(loc, { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }).replace(/\.$/, '');
  clocks.forEach((c) => {
    c.textContent = c.hasAttribute('data-short') ? time : `${day}  ${time}`;
    c.setAttribute('datetime', now.toISOString().slice(0, 16).replace('T', ' '));
  });
}
if (clocks.length) {
  tick();
  setTimeout(() => {
    tick();
    setInterval(tick, 60000);
  }, 60000 - (Date.now() % 60000));
}

/* ── Control Center ── */
const cc = $('#cc');
const ccBtn = $('[data-open="cc"]');
function toggleCC(open = cc?.hidden) {
  if (!cc || !ccBtn) return;
  cc.hidden = !open;
  ccBtn.setAttribute('aria-expanded', String(!!open));
  if (open) (cc.querySelector('a, button') as HTMLElement | null)?.focus({ preventScroll: true });
}
ccBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleCC();
});
$$('[data-open-cc]').forEach((b) =>
  b.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCC(true);
  }),
);
document.addEventListener('click', (e) => {
  if (cc && !cc.hidden && !cc.contains(e.target as Node)) toggleCC(false);
});
$$('[data-copy]').forEach((b) =>
  b.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(b.dataset.copy!);
      const t = $('.cc-toast');
      if (t) {
        t.textContent = lang === 'ru' ? 'Скопировано' : 'Copied';
        t.classList.add('on');
        setTimeout(() => t.classList.remove('on'), 1400);
      }
    } catch {}
  }),
);

/* ── About Ehroz ── */
const about = $<HTMLDialogElement>('#about');
$$('[data-open="about"]').forEach((b) => b.addEventListener('click', () => about?.showModal()));
$('[data-close-about]')?.addEventListener('click', () => about?.close());
about?.addEventListener('click', (e) => {
  if (e.target === about) about.close();
});

// Escape закрывает панель контактов
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') toggleCC(false);
});

// Клик по иконке приложения — «прыжок», как при запуске
$$('.dock-item a[data-app-link]').forEach((a) =>
  a.addEventListener('click', () => {
    if (!reduced) a.parentElement?.classList.add('bounce');
  }),
);

/* ── View Transitions: иконка «перелетает» со страницы на страницу ── */
function markIcon(slug: string, el: HTMLElement | null) {
  $$('[style*="app-icon"]').forEach((n) => (n.style.viewTransitionName = ''));
  const target = el ?? $(`[data-vt-icon="${slug}"]`);
  if (target) target.style.viewTransitionName = 'app-icon';
}
document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[data-app-link]');
  if (!a) return;
  const icon = a.querySelector<HTMLElement>('img[data-icon]');
  markIcon(a.dataset.appLink!, icon);
});
// Возврат на главную: иконка из героя прилетает в карточку
window.addEventListener('pagereveal', (e: Event) => {
  const ev = e as Event & { viewTransition?: { skipTransition(): void } };
  if (!ev.viewTransition) return;
  const nav = (window as unknown as { navigation?: { activation?: { from?: { url?: string } } } }).navigation;
  const from = nav?.activation?.from?.url;
  if (!from) return;
  const m = new URL(from).pathname.match(/\/([a-z0-9-]+)\/?$/);
  const slug = m?.[1];
  if (!slug || slug === 'en') return;
  const card = $(`[data-vt-icon="${slug}"]`);
  if (card && !document.documentElement.dataset.slug) card.style.viewTransitionName = 'app-icon';
  else if (card && document.documentElement.dataset.slug !== slug) card.style.viewTransitionName = '';
});

/* ── Пасхалка: Konami-код, двойной щелчок по логотипу или кнопка в подвале → космический шутер ── */
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let kpos = 0;
document.addEventListener('keydown', (e) => {
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  kpos = k === KONAMI[kpos] ? kpos + 1 : k === KONAMI[0] ? 1 : 0;
  if (kpos === KONAMI.length) {
    kpos = 0;
    startGame();
  }
});
$('[data-logo]')?.addEventListener('dblclick', (e) => {
  e.preventDefault();
  startGame();
});
// Кнопка в подвале работает только на тач-экранах; на компьютере — Konami-код
const touchOnly = matchMedia('(hover: none), (pointer: coarse)');
$$<HTMLButtonElement>('[data-game-start]').forEach((b) => {
  const sync = () => (b.tabIndex = touchOnly.matches ? 0 : -1);
  sync();
  touchOnly.addEventListener('change', sync);
  b.addEventListener('click', () => touchOnly.matches && startGame());
});
function startGame() {
  import('./shooter').then((m) => m.startShooter(lang));
}

/* ── Сцены ── */
initScenes();
