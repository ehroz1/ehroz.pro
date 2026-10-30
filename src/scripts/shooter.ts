/* Мини-игра: космический корабль стреляет по элементам сайта.
   Управление: стрелки / WASD — полёт, пробел — огонь, Esc — выход.
   На тач-экранах корабль следует за пальцем и стреляет сам. */

let running = false;

const TARGETS = 'h1,h2,h3,h4,p,li,a,button,img,svg,kbd,figure,blockquote,.dock-item,[data-icon]';

type Target = { el: HTMLElement; hp: number };
type Bullet = { x: number; y: number; vy: number };
type Particle = { x: number; y: number; vx: number; vy: number; life: number; c: string; s: number };

export function startShooter(lang: 'ru' | 'en') {
  if (running) return;
  running = true;
  const t = lang === 'en'
    ? { score: 'Score', help: '←↑↓→ / WASD — fly · Space — fire · Esc — exit', done: 'Site destroyed! Esc to restore' }
    : { score: 'Счёт', help: '←↑↓→ / WASD — полёт · Пробел — огонь · Esc — выход', done: 'Сайт уничтожен! Esc — восстановить' };

  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#7c93ff';
  const dpr = Math.min(2, devicePixelRatio || 1);
  const cv = document.createElement('canvas');
  cv.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;z-index:1000;touch-action:none;cursor:none';
  const hud = document.createElement('div');
  hud.style.cssText = `position:fixed;left:50%;top:12px;transform:translateX(-50%);z-index:1001;padding:8px 14px;border-radius:10px;background:rgba(10,10,14,.75);color:#fff;font:600 12px/1.4 ui-monospace,monospace;text-align:center;pointer-events:none;backdrop-filter:blur(6px)`;
  const close = document.createElement('button');
  close.textContent = '✕';
  close.setAttribute('aria-label', 'Exit');
  close.style.cssText = 'position:fixed;right:12px;top:12px;z-index:1002;width:36px;height:36px;border-radius:50%;border:0;background:rgba(10,10,14,.75);color:#fff;font-size:16px;cursor:pointer';
  document.body.append(cv, hud, close);
  const ctx = cv.getContext('2d')!;
  let W = 0, H = 0;
  const resize = () => {
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  addEventListener('resize', resize);

  // Цели: «листовые» видимые элементы, без самой игры
  const killed: { el: HTMLElement; v: string }[] = [];
  const isLeafish = (el: HTMLElement) => !el.querySelector(TARGETS) || el.matches('a,button,li,.dock-item');
  let targets: Target[] = [];
  const collect = () => {
    const seen = new Set<HTMLElement>();
    targets = Array.from(document.querySelectorAll<HTMLElement>(TARGETS))
      .filter((el) => {
        if (el === close || el.closest('canvas') || el.style.visibility === 'hidden') return false;
        const r = el.getBoundingClientRect();
        if (r.width < 6 || r.height < 6) return false;
        return isLeafish(el);
      })
      .filter((el) => {
        // не брать вложенное, если родитель уже цель (a внутри li и т.д.)
        for (let p = el.parentElement; p; p = p.parentElement) if (seen.has(p)) return false;
        seen.add(el);
        return true;
      })
      .map((el) => ({ el, hp: Math.min(4, 1 + Math.floor((el.offsetWidth * el.offsetHeight) / 40000)) }));
  };
  collect();
  const total = targets.length;

  const ship = { x: W / 2, y: H - 90, vx: 0, vy: 0 };
  const keys = new Set<string>();
  let bullets: Bullet[] = [];
  let parts: Particle[] = [];
  let stars = Array.from({ length: 60 }, () => ({ x: Math.random() * W, y: Math.random() * H, s: Math.random() * 2 + 0.5 }));
  let score = 0, cool = 0, touch: { x: number; y: number } | null = null, shake = 0;

  const onKey = (e: KeyboardEvent) => {
    const k = e.key.toLowerCase();
    if (k === 'escape') return stop();
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'w', 'a', 's', 'd'].includes(k)) {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === 'keydown') keys.add(k); else keys.delete(k);
    }
  };
  const onPtr = (e: PointerEvent) => {
    if (e.type === 'pointerup' || e.type === 'pointercancel') { touch = null; keys.delete(' '); return; }
    if (e.type === 'pointerdown' || e.buttons) { touch = { x: e.clientX, y: e.clientY - 40 }; keys.add(' '); }
  };
  addEventListener('keydown', onKey, true);
  addEventListener('keyup', onKey, true);
  cv.addEventListener('pointerdown', onPtr);
  cv.addEventListener('pointermove', onPtr);
  cv.addEventListener('pointerup', onPtr);
  cv.addEventListener('pointercancel', onPtr);
  close.addEventListener('click', () => stop());
  const onScroll = () => collect();
  addEventListener('scroll', onScroll, { passive: true });

  const boom = (x: number, y: number, n: number, c: string) => {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = Math.random() * 5 + 1;
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, c, s: Math.random() * 3 + 1.5 });
    }
  };

  const destroy = (tg: Target, r: DOMRect) => {
    const el = tg.el;
    killed.push({ el, v: el.style.visibility });
    // осколки элемента
    const cols = ['#fff', accent, '#ffb84d', '#ff5d5d'];
    for (let i = 0; i < 26; i++) {
      parts.push({
        x: r.left + Math.random() * r.width, y: r.top + Math.random() * r.height,
        vx: (Math.random() - 0.5) * 7, vy: (Math.random() - 0.8) * 6, life: 1,
        c: cols[i % cols.length], s: Math.random() * 4 + 2,
      });
    }
    el.style.visibility = 'hidden';
    score += 10 * tg.hp + 5;
    shake = 8;
    targets = targets.filter((x) => x !== tg);
  };

  let raf = 0;
  const loop = () => {
    // управление
    const acc = 0.9;
    if (touch) {
      ship.vx = (touch.x - ship.x) * 0.2;
      ship.vy = (touch.y - ship.y) * 0.2;
    } else {
      if (keys.has('arrowleft') || keys.has('a')) ship.vx -= acc;
      if (keys.has('arrowright') || keys.has('d')) ship.vx += acc;
      if (keys.has('arrowup') || keys.has('w')) ship.vy -= acc;
      if (keys.has('arrowdown') || keys.has('s')) ship.vy += acc;
      ship.vx *= 0.88; ship.vy *= 0.88;
    }
    ship.x = Math.max(20, Math.min(W - 20, ship.x + ship.vx));
    ship.y = Math.max(30, Math.min(H - 30, ship.y + ship.vy));
    if (cool > 0) cool--;
    if (keys.has(' ') && cool === 0) {
      bullets.push({ x: ship.x - 9, y: ship.y - 10, vy: -13 }, { x: ship.x + 9, y: ship.y - 10, vy: -13 });
      cool = 7;
    }
    // выхлоп
    parts.push({ x: ship.x + (Math.random() - 0.5) * 8, y: ship.y + 20, vx: (Math.random() - 0.5) * 1.2, vy: 3 + Math.random() * 2, life: 0.6, c: '#ffb84d', s: 2.5 });

    // пули и попадания
    const rects = targets.map((tg) => tg.el.getBoundingClientRect());
    bullets = bullets.filter((b) => {
      b.y += b.vy;
      if (b.y < -20) return false;
      for (let i = 0; i < targets.length; i++) {
        const r = rects[i];
        if (b.x >= r.left && b.x <= r.right && b.y >= r.top && b.y <= r.bottom) {
          const tg = targets[i];
          tg.hp--;
          boom(b.x, b.y, 6, accent);
          if (tg.hp <= 0) destroy(tg, r);
          else {
            tg.el.animate([{ transform: 'translateX(-3px)' }, { transform: 'translateX(3px)' }, { transform: 'none' }], { duration: 120 });
          }
          return false;
        }
      }
      return true;
    });

    // отрисовка
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    if (shake > 0) { ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake); shake *= 0.85; if (shake < 0.5) shake = 0; }
    ctx.fillStyle = 'rgba(10,10,20,.18)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(255,255,255,.7)';
    for (const s of stars) {
      s.y += s.s * 0.8;
      if (s.y > H) { s.y = 0; s.x = Math.random() * W; }
      ctx.fillRect(s.x, s.y, s.s, s.s);
    }
    ctx.fillStyle = '#fff';
    ctx.shadowColor = accent; ctx.shadowBlur = 10;
    for (const b of bullets) ctx.fillRect(b.x - 1.5, b.y - 8, 3, 14);
    ctx.shadowBlur = 0;
    parts = parts.filter((p) => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.life -= 0.025;
      if (p.life <= 0) return false;
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.c;
      ctx.fillRect(p.x, p.y, p.s, p.s);
      return true;
    });
    ctx.globalAlpha = 1;
    // корабль
    ctx.translate(ship.x, ship.y);
    ctx.rotate(Math.max(-0.4, Math.min(0.4, ship.vx * 0.05)));
    ctx.shadowColor = accent; ctx.shadowBlur = 16;
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.moveTo(0, -24); ctx.lineTo(16, 16); ctx.lineTo(6, 10); ctx.lineTo(0, 18); ctx.lineTo(-6, 10); ctx.lineTo(-16, 16);
    ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(0, -4, 4, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    hud.innerHTML = `${t.score}: ${score} · ${killed.length}/${total}<br><span style="opacity:.7;font-weight:400">${killed.length >= total && total ? t.done : t.help}</span>`;
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  function stop() {
    cancelAnimationFrame(raf);
    removeEventListener('keydown', onKey, true);
    removeEventListener('keyup', onKey, true);
    removeEventListener('resize', resize);
    removeEventListener('scroll', onScroll);
    cv.remove(); hud.remove(); close.remove();
    for (const k of killed) {
      k.el.style.visibility = k.v;
      k.el.animate([{ opacity: 0, transform: 'scale(.8)' }, { opacity: 1, transform: 'none' }], { duration: 400, easing: 'ease-out' });
    }
    running = false;
  }
}
