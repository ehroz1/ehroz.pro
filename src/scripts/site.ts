import { initScenes } from './scenes';
import './scenes-more';

const $ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(s));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
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
  $$('[data-set-theme]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setTheme === p)));
}
const pref = (): Pref => (document.documentElement.getAttribute('data-theme-pref') as Pref) || 'auto';
setTheme(pref());
$$('[data-theme-toggle]').forEach((b) =>
  b.addEventListener('click', () => {
    const order: Pref[] = ['auto', 'dark', 'light'];
    setTheme(order[(order.indexOf(pref()) + 1) % 3]);
  }),
);
$$('[data-set-theme]').forEach((b) => b.addEventListener('click', () => setTheme(b.dataset.setTheme as Pref)));

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

/* ── Spotlight (⌘K / Ctrl+K) ── */
type Item = { type: 'app' | 'action'; title: string; sub: string; meta?: string; href?: string; icon?: string; ic?: string; action?: string; slug?: string; keys: string };
const spot = $<HTMLDialogElement>('#spotlight');
if (spot) {
  const data = JSON.parse($('#spot-data')!.textContent!) as { items: Item[]; labels: { apps: string; actions: string } };
  const input = $<HTMLInputElement>('input', spot)!;
  const list = $('#spot-list', spot)!;
  const empty = $('.spot-empty', spot)!;
  const icons = $<HTMLTemplateElement>('#spot-icons', spot)!.content;
  let shown: Item[] = [];
  let sel = 0;
  const norm = (s: string) => s.toLowerCase().replace(/ё/g, 'е');
  const render = () => {
    const q = norm(input.value.trim());
    const words = q.split(/\s+/).filter(Boolean);
    shown = data.items.filter((it) => {
      const hay = norm(`${it.title} ${it.sub} ${it.keys}`);
      return words.every((w) => hay.includes(w));
    });
    if (!q) shown = shown.filter((i) => i.type === 'app').concat(shown.filter((i) => i.type === 'action').slice(0, 2));
    sel = Math.min(sel, Math.max(0, shown.length - 1));
    list.innerHTML = '';
    let group = '';
    shown.forEach((it, i) => {
      const g = it.type === 'app' ? data.labels.apps : data.labels.actions;
      if (g !== group) {
        group = g;
        const h = document.createElement('li');
        h.className = 'spot-group';
        h.setAttribute('role', 'presentation');
        h.textContent = g;
        list.append(h);
      }
      const li = document.createElement('li');
      li.className = 'spot-item';
      li.id = `spot-${i}`;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(i === sel));
      const lead = it.icon
        ? Object.assign(document.createElement('img'), { src: it.icon, alt: '', width: 40, height: 40 })
        : (() => {
            const s = document.createElement('span');
            s.className = 'spot-ic';
            const src = icons.querySelector(`[data-ic="${it.ic}"]`);
            if (src) s.innerHTML = src.innerHTML;
            return s;
          })();
      const t = document.createElement('span');
      t.className = 'spot-t';
      t.innerHTML = '<b></b><small></small>';
      t.querySelector('b')!.textContent = it.title;
      t.querySelector('small')!.textContent = it.sub;
      li.append(lead, t);
      if (it.meta) {
        const m = document.createElement('span');
        m.className = 'spot-meta';
        m.textContent = it.meta;
        li.append(m);
      }
      li.addEventListener('pointermove', () => select(i));
      li.addEventListener('click', () => run(it));
      list.append(li);
    });
    empty.hidden = shown.length > 0;
    input.setAttribute('aria-activedescendant', shown.length ? `spot-${sel}` : '');
  };
  const select = (i: number) => {
    if (i === sel) return;
    sel = i;
    $$('.spot-item', list).forEach((el, j) => el.setAttribute('aria-selected', String(j === sel)));
    input.setAttribute('aria-activedescendant', `spot-${sel}`);
    $(`#spot-${sel}`, list)?.scrollIntoView({ block: 'nearest' });
  };
  const run = (it?: Item) => {
    if (!it) return;
    if (it.action === 'theme') {
      setTheme(document.documentElement.getAttribute('data-theme') === 'light' || (pref() === 'auto' && matchMedia('(prefers-color-scheme: light)').matches) ? 'dark' : 'light');
      spot.close();
      return;
    }
    if (!it.href) return;
    if (it.slug) markIcon(it.slug, null);
    spot.close();
    if (/^https?:|^mailto:/.test(it.href) && !it.href.startsWith(location.origin)) window.open(it.href, '_blank', 'noopener');
    else location.href = it.href;
  };
  const open = () => {
    if (spot.open) return spot.close();
    input.value = '';
    sel = 0;
    render();
    spot.showModal();
    input.focus();
  };
  input.addEventListener('input', () => {
    sel = 0;
    render();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      select((sel + 1) % Math.max(1, shown.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      select((sel - 1 + shown.length) % Math.max(1, shown.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(shown[sel]);
    }
  });
  spot.addEventListener('click', (e) => {
    if (e.target === spot) spot.close();
  });
  $$('[data-open="spotlight"]').forEach((b) => b.addEventListener('click', open));
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      open();
    } else if (e.key === '/' && !(e.target as HTMLElement).closest('input, textarea, [contenteditable]')) {
      e.preventDefault();
      open();
    } else if (e.key === 'Escape') {
      toggleCC(false);
    }
  });
}

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
$$('[data-game-start]').forEach((b) => b.addEventListener('click', () => startGame()));
function startGame() {
  import('./shooter').then((m) => m.startShooter(lang));
}

/* ── Сцены ── */
initScenes();
