// Движок сцен: масштабирование под контейнер, пауза вне экрана и сценарии (timeline) по id.
// Сценарий — async-функция, которая ждёт через wait(); при уходе сцены с экрана wait бросает Stop.
// При «уменьшить движение» сценарий выполняется один раз без пауз — остаётся конечный кадр.

class Stop extends Error {}
type Ctx = {
  root: HTMLElement;
  wait: (ms: number) => Promise<void>;
  $: (name: string) => HTMLElement;
  $$: (sel: string) => HTMLElement[];
  move: (x: number, y: number, el?: HTMLElement) => void;
  reduced: boolean;
};
type Script = (c: Ctx) => Promise<void>;

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Сценарии ── */
const ringPos = (ring: HTMLElement, i: number) => {
  const l = ring.querySelector<HTMLElement>(`.label[data-i="${i}"]`)!;
  return [ring.offsetLeft + parseFloat(l.style.left), ring.offsetTop + parseFloat(l.style.top)] as const;
};
const setHot = (ring: HTMLElement, i: number) => {
  ring.querySelectorAll('[data-i]').forEach((n) => n.classList.toggle('hot', Number((n as HTMLElement).dataset.i) === i));
};

const scripts: Record<string, Script> = {
  async 'morfus-ring'(c) {
    const ring = c.root.querySelector<HTMLElement>('[data-ring]')!;
    const pill = ring.querySelector<HTMLElement>('[data-pill]')!;
    const pills = JSON.parse(c.root.querySelector('[data-pills]')!.textContent!) as string[];
    const cur = c.$('cursor'), ghost = c.$('ghost'), file = c.$('file'), key = c.$('k0');
    // исходное состояние
    ring.classList.remove('shown', 'closing');
    setHot(ring, -1);
    pill.innerHTML = pills[0];
    ghost.classList.remove('on');
    file.classList.remove('lifted');
    cur.classList.remove('grabbing');
    key.classList.remove('down');
    c.move(560, 470);
    c.move(110, 400, ghost);
    await c.wait(500);
    c.move(118, 398);
    await c.wait(1000);
    cur.classList.add('grabbing');
    ghost.classList.add('on');
    file.classList.add('lifted');
    await c.wait(250);
    c.move(400, 232);
    c.move(392, 226, ghost);
    await c.wait(1100);
    key.classList.add('down');
    await c.wait(120);
    ring.classList.add('shown');
    await c.wait(700);
    for (const i of [1, 2, 3, 1]) {
      const [x, y] = ringPos(ring, i);
      c.move(x + 6, y + 8);
      c.move(x - 2, y + 2, ghost);
      await c.wait(520);
      setHot(ring, i);
      pill.innerHTML = pills[i];
      await c.wait(900);
    }
    await c.wait(600);
    ring.classList.add('closing');
    key.classList.remove('down');
    ghost.classList.remove('on');
    cur.classList.remove('grabbing');
    file.classList.remove('lifted');
    await c.wait(1200);
  },

  async 'morfus-modes'(c) {
    const rings = [0, 1, 2].map((i) => c.root.querySelector<HTMLElement>(`.m${i}`)!);
    const keys = [0, 1, 2].map((i) => c.$(`k${i}`));
    const hotSeq = [[1, 4, 1], [5, 1, 5], [0, 1, 0]];
    for (let m = 0; m < 3; m++) {
      rings.forEach((r) => r.classList.remove('shown', 'closing'));
      keys.forEach((k, i) => k.classList.toggle('down', i === m));
      rings[m].classList.add('shown');
      for (const h of hotSeq[m]) {
        setHot(rings[m], h);
        await c.wait(900);
      }
      rings[m].classList.add('closing');
      await c.wait(c.reduced ? 0 : 260);
      if (c.reduced && m === 2) rings[m].classList.remove('closing');
    }
  },

  async 'morfus-result'(c) {
    const ring = c.root.querySelector<HTMLElement>('[data-ring]')!;
    const pill = ring.querySelector<HTMLElement>('[data-pill]')!;
    const bar = ring.querySelector<SVGCircleElement>('.bar')!;
    const out = c.$('out'), hud = c.$('hud'), hb = c.$('hudbar'), hp = c.$('hudpct');
    const ru = document.documentElement.lang !== 'en';
    const initial = pill.dataset.initial ?? (pill.dataset.initial = pill.innerHTML);
    ring.classList.remove('busy', 'done', 'closing');
    ring.classList.add('shown');
    pill.innerHTML = initial;
    bar.style.strokeDashoffset = '100';
    out.classList.remove('show');
    hud.classList.remove('on');
    hb.style.width = '0';
    hp.textContent = '0%';
    c.move(452, 150);
    await c.wait(900);
    ring.classList.add('busy');
    await c.wait(60);
    bar.style.strokeDashoffset = '0';
    await c.wait(1000);
    ring.classList.remove('busy');
    ring.classList.add('done');
    pill.innerHTML = ru
      ? '<span class="p-name">IMG_4021.webp</span><span class="p-ok">4,2 МБ → 1,1 МБ · −74%</span>'
      : '<span class="p-name">IMG_4021.webp</span><span class="p-ok">4.2 MB → 1.1 MB · −74%</span>';
    await c.wait(1500);
    ring.classList.add('closing');
    out.classList.add('show');
    await c.wait(700);
    hud.classList.add('on');
    for (let p = 0; p <= 100; p += c.reduced ? 100 : 4) {
      hb.style.width = `${p}%`;
      hp.textContent = `${p}%`;
      await c.wait(120);
    }
    await c.wait(1600);
  },

  async 'morfus-settings'(c) {
    const rows = c.$$('[data-row]');
    const order = [0, 1, 2, 3, 4];
    const place = () => order.forEach((r, pos) => rows[r].style.setProperty('--y', `${pos * 62}px`));
    place();
    await c.wait(1200);
    // WebP перетаскивается наверх
    rows[2].classList.add('lift');
    await c.wait(300);
    order.splice(order.indexOf(2), 1);
    order.splice(0, 0, 2);
    place();
    await c.wait(700);
    rows[2].classList.remove('lift');
    await c.wait(1800);
    // и обратно
    rows[2].classList.add('lift');
    await c.wait(300);
    order.splice(0, 1);
    order.splice(2, 0, 2);
    place();
    await c.wait(700);
    rows[2].classList.remove('lift');
    await c.wait(1400);
  },

  async 'morfus-cli'(c) {
    const body = c.$('body');
    const lines = JSON.parse(c.root.querySelector('[data-lines]')!.textContent!) as [string, string, string?][];
    body.innerHTML = '';
    const esc = (s: string) => s.replace(/[&<>]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[m]!);
    let html = '';
    for (const [, cmd, comment] of lines) {
      const head = `<span class="pr">❯</span> `;
      for (let i = 1; i <= cmd.length; i += c.reduced ? cmd.length : 2) {
        body.innerHTML = `${html}${head}${esc(cmd.slice(0, i))}<span class="caret"></span>`;
        await c.wait(28);
      }
      html += `${head}${esc(cmd)}${comment ? `  <span class="cm">${esc(comment)}</span>` : ''}\n`;
      body.innerHTML = `${html}<span class="caret"></span>`;
      await c.wait(500);
    }
    await c.wait(2400);
  },
};

export function register(id: string, fn: Script) {
  scripts[id] = fn;
}

/* ── Запуск ── */
export function initScenes() {
  const scenes = Array.from(document.querySelectorAll<HTMLElement>('[data-scene]'));
  if (!scenes.length) return;

  const ro = new ResizeObserver((entries) => {
    for (const en of entries) {
      const el = en.target as HTMLElement;
      const cs = getComputedStyle(el);
      const w = Number(cs.getPropertyValue('--w')) || 800;
      const h = Number(cs.getPropertyValue('--h')) || 560;
      const { width, height } = en.contentRect;
      const fit = !!el.closest('[data-fit]');
      // .fit — вписать целиком и отцентровать (когда у контейнера своя высота)
      const k = fit ? Math.min(width / w, height / h) : width / w;
      el.style.setProperty('--k', String(k));
      el.style.setProperty('--ox', String(fit ? (width - w * k) / 2 : 0));
      el.style.setProperty('--oy', String(fit ? (height - h * k) / 2 : 0));
    }
  });

  const running = new Map<HTMLElement, { stop: () => void }>();
  const start = (root: HTMLElement) => {
    if (running.has(root)) return;
    const fn = scripts[root.dataset.scene!];
    root.classList.add('playing');
    if (!fn) return;
    let alive = true;
    const timers = new Set<number>();
    const ctx: Ctx = {
      root,
      reduced,
      wait: (ms) =>
        new Promise((res, rej) => {
          if (!alive) return rej(new Stop());
          if (reduced) return res();
          const t = window.setTimeout(() => {
            timers.delete(t);
            alive ? res() : rej(new Stop());
          }, ms);
          timers.add(t);
        }),
      $: (name) => root.querySelector<HTMLElement>(`[data-el="${name}"]`)!,
      $$: (sel) => Array.from(root.querySelectorAll<HTMLElement>(sel)),
      move: (x, y, el) => {
        (el ?? root.querySelector<HTMLElement>('[data-el="cursor"]'))?.style.setProperty('translate', `${x}px ${y}px`);
      },
    };
    running.set(root, {
      stop: () => {
        alive = false;
        timers.forEach(clearTimeout);
      },
    });
    (async () => {
      try {
        if (reduced) await fn(ctx);
        else while (alive) await fn(ctx);
      } catch (e) {
        if (!(e instanceof Stop)) console.error(e);
      }
    })();
  };
  const stop = (root: HTMLElement) => {
    root.classList.remove('playing');
    if (reduced) return; // конечный кадр остаётся
    running.get(root)?.stop();
    running.delete(root);
  };

  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        const el = en.target as HTMLElement;
        if (en.isIntersecting && !document.hidden) start(el);
        else stop(el);
      }),
    { threshold: 0.25 },
  );
  scenes.forEach((s) => {
    ro.observe(s);
    io.observe(s);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) scenes.forEach(stop);
    else
      scenes.forEach((s) => {
        const r = s.getBoundingClientRect();
        if (r.bottom > 0 && r.top < innerHeight) start(s);
      });
  });
}
