/* ── Движение при прокрутке — по образцу getartcraft.com ──
   1. Плавная прокрутка колесом (Lenis, lerp 0.12), якоря тоже плавные.
   2. Раздел «чертится»: линия .sec-bar вытягивается слева направо (0,7 с), подпись полосы всплывает,
      крестики на стыках с рельсами появляются по очереди.
   3. Блоки всплывают на 28 px из размытия 8 px (0,9 с), когда их верх доходит до 85–88 % высоты окна.
      В сетках задержка зависит от места в строке (до 0,18 с) — карточки идут волной слева направо.
      Первый экран проявляется сразу при загрузке, по очереди через 0,08 с.
   4. Полоса раздела прилипает под строкой меню, пока раздел на экране.

   Разметка: [data-reveal] — блок, [data-reveal-group] — сетка, внутри которой блоки идут волной.
   Если в секции нет ни одного [data-reveal], блоки размечаются сами: дети секции, а у списков и сеток
   (ul, ol, dl, .bleed) — их элементы.
   При «уменьшить движение» (система или панель «Связаться» → Анимации) ничего этого нет: страница
   сразу видна целиком, прокрутка обычная. Скрытие до появления включает класс html.rv из Layout.astro. */
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const html = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches || html.dataset.motion === 'reduce';

let lenis: Lenis | null = null;
/** Прокрутка к месту: плавно через Lenis, если он включён. */
export function smoothScrollTo(top: number) {
  if (lenis) lenis.scrollTo(top);
  else scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
}

function initLenis() {
  lenis = new Lenis({
    lerp: 0.12,
    anchors: true,
    // списки и панели со своей прокруткой крутятся сами
    allowNestedScroll: true,
    // открытые окна (Spotlight, «Об этом Mac») — страница под ними стоит на месте
    prevent: (node) => node instanceof HTMLDialogElement && node.open,
  });
  const raf = (t: number) => {
    lenis?.raf(t);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}

const RISE = 900; // мс, как в CSS (.rv-in)

/** Показать блок: с задержкой delay (с), без анимации — если instant. */
function show(el: HTMLElement, delay = 0, instant = false) {
  if (el.dataset.rvDone) return;
  el.dataset.rvDone = '1';
  if (instant) {
    clear(el);
    return;
  }
  el.style.setProperty('--rv-d', `${delay}s`);
  el.classList.add('rv-in');
  // как clearProps у GSAP: после появления снимаем всё, чтобы работали собственные переходы блока
  setTimeout(() => clear(el), RISE + delay * 1000 + 60);
}
function clear(el: HTMLElement) {
  el.classList.remove('rv-in');
  el.removeAttribute('data-reveal');
  el.style.removeProperty('--rv-d');
}

/** Линия, подпись и крестики полосы раздела. */
function draw(bar: HTMLElement, instant = false) {
  if (bar.classList.contains('drawn')) return;
  if (!instant) {
    bar.classList.add('drawing');
    setTimeout(() => bar.classList.remove('drawing'), 1100);
  }
  bar.classList.add('drawn');
}

/** Разметка по умолчанию для секций без [data-reveal]. */
const GROUP = 'ul, ol, dl, .bleed, [data-reveal-group]';
function autoTag(sec: HTMLElement) {
  if (sec.querySelector('[data-reveal]')) return;
  for (const child of Array.from(sec.children) as HTMLElement[]) {
    if (child.matches('.sec-bar, .sr-only, script, style')) continue;
    if (child.matches(GROUP) && child.children.length) {
      child.setAttribute('data-reveal-group', '');
      for (const item of Array.from(child.children)) item.setAttribute('data-reveal', '');
    } else {
      child.setAttribute('data-reveal', '');
    }
  }
}

/** Сработать, когда верх элемента дошёл до доли высоты окна (start: "top 85%"). Уже пролистанное — сразу. */
function onReach(els: HTMLElement[], at: number, cb: (el: HTMLElement, passed: boolean) => void) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const passed = !e.isIntersecting && e.boundingClientRect.bottom < 0;
        if (!e.isIntersecting && !passed) continue;
        io.unobserve(e.target);
        cb(e.target as HTMLElement, passed);
      }
    },
    { rootMargin: `0px 0px -${Math.round((1 - at) * 100)}% 0px` },
  );
  els.forEach((el) => io.observe(el));
}

function initReveal() {
  const sections = Array.from(document.querySelectorAll<HTMLElement>('main section'));
  sections.forEach(autoTag);
  const hero = sections[0];

  // Первый экран — сразу, по очереди
  if (hero) {
    const bar = hero.querySelector<HTMLElement>(':scope > .sec-bar');
    if (bar) draw(bar);
    let i = 0;
    hero.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      const group = el.parentElement?.closest<HTMLElement>('[data-reveal-group]');
      // сетка в первом экране — волной, после текста
      if (group && hero.contains(group) && group.dataset.revealGroup === 'wave') show(el, 0.24 + waveDelay(el, group));
      else show(el, 0.15 + 0.08 * i++);
    });
  }

  // Полосы разделов: линия, подпись, крестики — когда раздел дошёл до 88 % окна
  const bars = sections
    .filter((s) => s !== hero)
    .map((s) => s.querySelector<HTMLElement>(':scope > .sec-bar'))
    .filter(Boolean) as HTMLElement[];
  onReach(bars, 0.88, (bar, passed) => draw(bar, passed));

  // Блоки вне сеток — на 85 %, в сетках — на 88 % с задержкой по месту в строке
  const items = Array.from(document.querySelectorAll<HTMLElement>('main [data-reveal]')).filter((el) => !el.dataset.rvDone);
  const solo = items.filter((el) => !el.parentElement?.closest('[data-reveal-group]'));
  const grouped = items.filter((el) => !solo.includes(el));
  onReach(solo, 0.85, (el, passed) => show(el, 0, passed));
  onReach(grouped, 0.88, (el, passed) => {
    const group = el.parentElement!.closest<HTMLElement>('[data-reveal-group]')!;
    show(el, waveDelay(el, group), passed);
  });

  // Возврат со страницы изделия: иконка перелетает в карточку — карточка должна быть видна сразу
  addEventListener('pagereveal', (e: Event) => {
    if (!(e as Event & { viewTransition?: unknown }).viewTransition) return;
    const icon = document.querySelector<HTMLElement>('[style*="app-icon"]');
    let el = icon?.closest<HTMLElement>('[data-reveal]');
    while (el) {
      show(el, 0, true);
      el = el.parentElement?.closest<HTMLElement>('[data-reveal]');
    }
  });

  html.setAttribute('data-rv-ready', '');
}

function waveDelay(el: HTMLElement, group: HTMLElement) {
  const g = group.getBoundingClientRect();
  return g.width > 0 ? ((el.getBoundingClientRect().left - g.left) / g.width) * 0.18 : 0;
}

/** Прилипшая полоса раздела получает нижнюю линию. */
function initStuck() {
  const bars = Array.from(document.querySelectorAll<HTMLElement>('main section > .sec-bar'));
  if (!bars.length) return;
  let raf = 0;
  const check = () => {
    raf = 0;
    const top = parseFloat(getComputedStyle(html).getPropertyValue('--menubar')) || 40;
    for (const b of bars) {
      const r = b.getBoundingClientRect();
      const sec = b.parentElement!.getBoundingClientRect();
      b.classList.toggle('stuck', r.top <= top + 0.5 && sec.top < top - 0.5 && sec.bottom > r.bottom);
    }
  };
  addEventListener('scroll', () => (raf ||= requestAnimationFrame(check)), { passive: true });
  addEventListener('resize', check);
  check();
}

export function initMotion() {
  initStuck();
  if (reduced) {
    html.classList.remove('rv');
    return;
  }
  initLenis();
  if (html.classList.contains('rv')) initReveal();
}
