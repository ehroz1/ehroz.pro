import { startWallpaper } from './wallpaper';
import { initScenes } from './scenes';
import './scenes-more';

const $ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(s));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
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

/* ── Dock: увеличение как в macOS ── */
const dock = $('[data-dock]');
if (dock && finePointer && !reduced) {
  const items = $$('.dock-item', dock);
  const MAX = 0.75; // +75% у иконки под курсором
  const RANGE = 150; // px — насколько далеко «дотягивается» эффект
  let raf = 0;
  let px = -1;
  const apply = () => {
    raf = 0;
    items.forEach((it) => {
      const r = it.getBoundingClientRect();
      const c = r.left + r.width / 2;
      const d = px < 0 ? Infinity : Math.abs(px - c);
      const s = d > RANGE ? 1 : 1 + MAX * Math.cos(((d / RANGE) * Math.PI) / 2) ** 2;
      it.style.setProperty('--s', s.toFixed(3));
    });
  };
  dock.addEventListener('pointerenter', () => dock.classList.add('live'));
  dock.addEventListener('pointermove', (e) => {
    px = e.clientX;
    if (!raf) raf = requestAnimationFrame(apply);
  });
  dock.addEventListener('pointerleave', () => {
    px = -1;
    dock.classList.remove('live');
    apply();
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

/* ── Появление при прокрутке ── */
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    }),
  { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
);
$$('.reveal').forEach((el) => io.observe(el));

/* ── Наклон карточек-окон за курсором + блик ── */
if (finePointer && !reduced) {
  $$('[data-tilt]').forEach((el) => {
    let raf = 0;
    let tx = 0,
      ty = 0;
    const set = () => {
      raf = 0;
      el.style.setProperty('--rx', `${(-ty * 5).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${(tx * 6).toFixed(2)}deg`);
      el.style.setProperty('--gx', `${((tx + 1) * 50).toFixed(1)}%`);
      el.style.setProperty('--gy', `${((ty + 1) * 50).toFixed(1)}%`);
    };
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      el.classList.add('tilting');
      if (!raf) raf = requestAnimationFrame(set);
    });
    el.addEventListener('pointerleave', () => {
      tx = ty = 0;
      el.classList.remove('tilting');
      set();
    });
  });

  /* Магнитные кнопки */
  $$('.magnetic').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });

  /* Курсор-кольцо: растёт над интерактивом */
  const cur = $('.cursor');
  if (cur) {
    let x = -100,
      y = -100,
      cx = -100,
      cy = -100,
      raf = 0;
    const loop = () => {
      cx += (x - cx) * 0.25;
      cy += (y - cy) * 0.25;
      cur.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.3 ? requestAnimationFrame(loop) : 0;
    };
    addEventListener(
      'pointermove',
      (e) => {
        if (e.pointerType !== 'mouse') return;
        x = e.clientX;
        y = e.clientY;
        cur.classList.add('on');
        const t = e.target as HTMLElement;
        cur.classList.toggle('hover', !!t.closest('a, button, summary, [role="option"], input, label'));
        if (!raf) raf = requestAnimationFrame(loop);
      },
      { passive: true },
    );
    document.addEventListener('pointerleave', () => cur.classList.remove('on'));
    addEventListener('pointerdown', () => cur.classList.add('down'));
    addEventListener('pointerup', () => cur.classList.remove('down'));
  }
}

/* ── Пасхалка: Konami-код или двойной щелчок по логотипу → дождь из иконок ── */
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let kpos = 0;
document.addEventListener('keydown', (e) => {
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  kpos = k === KONAMI[kpos] ? kpos + 1 : k === KONAMI[0] ? 1 : 0;
  if (kpos === KONAMI.length) {
    kpos = 0;
    party();
  }
});
$('[data-logo]')?.addEventListener('dblclick', (e) => {
  e.preventDefault();
  party();
});
let partying = false;
function party() {
  if (partying) return;
  partying = true;
  const srcs = $$<HTMLImageElement>('.dock img[data-icon]').map((i) => i.currentSrc || i.src);
  if (!srcs.length) return;
  const layer = document.createElement('div');
  layer.setAttribute('aria-hidden', 'true');
  layer.style.cssText = 'position:fixed;inset:0;z-index:90;pointer-events:none;overflow:hidden';
  document.body.append(layer);
  $$('.dock-item').forEach((it, i) => setTimeout(() => {
    it.classList.remove('bounce');
    void it.offsetWidth;
    it.classList.add('bounce');
  }, i * 60));
  document.querySelector('.mb-logo .mark')?.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(720deg)' }], { duration: 1400, easing: 'cubic-bezier(.2,1.3,.4,1)' });
  const N = reduced ? 0 : 42;
  const W = innerWidth,
    H = innerHeight;
  type P = { el: HTMLImageElement; x: number; y: number; vx: number; vy: number; r: number; vr: number; s: number };
  const ps: P[] = [];
  for (let i = 0; i < N; i++) {
    const el = document.createElement('img');
    el.src = srcs[i % srcs.length];
    const s = 44 + Math.random() * 46;
    el.width = el.height = s;
    el.style.cssText = `position:absolute;left:0;top:0;width:${s}px;height:${s}px;will-change:transform`;
    layer.append(el);
    ps.push({ el, x: Math.random() * W, y: -s - Math.random() * H * 0.8, vx: (Math.random() - 0.5) * 2, vy: Math.random() * 2, r: Math.random() * 360, vr: (Math.random() - 0.5) * 8, s });
  }
  const t0 = performance.now();
  const step = (now: number) => {
    for (const p of ps) {
      p.vy += 0.35;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      if (p.y > H - p.s - 6 && p.vy > 0) {
        p.y = H - p.s - 6;
        p.vy *= -0.45;
        p.vx *= 0.9;
        p.vr *= 0.8;
      }
      p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.r}deg)`;
    }
    const age = now - t0;
    if (age > 3600) layer.style.opacity = String(Math.max(0, 1 - (age - 3600) / 700));
    if (age < 4300) requestAnimationFrame(step);
    else {
      layer.remove();
      partying = false;
    }
  };
  requestAnimationFrame(step);
}

/* ── Обои и сцены — после первой отрисовки ── */
const idle = (fn: () => void) => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 1200 }) : setTimeout(fn, 200));
// Обои стартуют чуть позже первой отрисовки — компиляция шейдера не мешает загрузке страницы.
const later = () => setTimeout(() => idle(startWallpaper), 900);
if (document.readyState === 'complete') later();
else addEventListener('load', later, { once: true });
initScenes();
