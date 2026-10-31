// Сценарии сцен Morfu, Pachaq, Sukhan, radius, BLA-БЛА, Picta, PadBridge, Moss Pocket, Peecube, ANY CAMERA и Snowpuff.
import { register } from './scenes';

const ru = () => document.documentElement.lang !== 'en';
const num = (v: number, d = 1) => (ru() ? v.toFixed(d).replace('.', ',') : v.toFixed(d));

/* ── Morfu ── */
register('morfu-menubar', async (c) => {
  const cur = c.$('cursor'), ghost = c.$('ghost'), file = c.$('file'), out = c.$('out');
  const panel = c.$('panel'), icon = c.$('micon'), prog = c.$('prog'), pct = c.$('pct'), sub = c.$('rowsub'), row = c.$('row');
  const subInit = sub.dataset.init ?? (sub.dataset.init = sub.textContent!);
  panel.classList.remove('on');
  icon.classList.remove('hot');
  ghost.classList.remove('on', 'small');
  file.classList.remove('lifted');
  out.classList.remove('show');
  row.classList.remove('away');
  cur.classList.remove('grabbing');
  prog.style.width = '0';
  pct.textContent = '';
  sub.textContent = subInit;
  c.move(300, 470);
  c.move(140, 370, ghost);
  await c.wait(400);
  c.move(160, 392);
  await c.wait(1000);
  cur.classList.add('grabbing');
  ghost.classList.add('on');
  file.classList.add('lifted');
  await c.wait(200);
  c.move(626, 12);
  c.move(606, 0, ghost);
  ghost.classList.add('small');
  await c.wait(1000);
  icon.classList.add('hot');
  await c.wait(300);
  ghost.classList.remove('on');
  cur.classList.remove('grabbing');
  file.classList.remove('lifted');
  icon.classList.remove('hot');
  panel.classList.add('on');
  c.move(560, 200);
  for (let p = 0; p <= 100; p += c.reduced ? 100 : 5) {
    prog.style.width = `${p}%`;
    pct.textContent = `${p}%`;
    await c.wait(90);
  }
  sub.textContent = ru() ? '12,4 МБ → 3,1 МБ · −75%' : '12.4 MB → 3.1 MB · −75%';
  pct.textContent = '✓';
  await c.wait(900);
  // вытаскиваем готовый файл на рабочий стол
  c.move(520, 86);
  await c.wait(800);
  cur.classList.add('grabbing');
  row.classList.add('away');
  ghost.classList.remove('small');
  c.move(506, 66, ghost);
  await c.wait(60);
  ghost.classList.add('on');
  c.move(200, 210);
  c.move(186, 190, ghost);
  await c.wait(1000);
  ghost.classList.remove('on');
  cur.classList.remove('grabbing');
  out.classList.add('show');
  panel.classList.remove('on');
  await c.wait(1800);
});

register('morfu-savings', async (c) => {
  const counters = c.$$('[data-count]');
  counters.forEach((b) => (b.textContent = `0 ${b.dataset.unit}`));
  await c.wait(900);
  const steps = 30;
  for (let i = 1; i <= steps; i++) {
    counters.forEach((b) => {
      const v = (Number(b.dataset.count) * i) / steps;
      b.textContent = `${num(v)} ${b.dataset.unit}`;
    });
    await c.wait(35);
  }
  await c.wait(4000);
  // перезапуск анимации строк
  c.$$('[data-done-row]').forEach((r) => {
    r.style.animation = 'none';
    void r.offsetWidth;
    r.style.animation = '';
  });
});

register('morfu-notch', async (c) => {
  const notch = c.$('notch'), ring = c.$('ring'), res = c.$('islres'), sub = c.$('islsub');
  const cur = c.$('cursor'), ghost = c.$('ghost'), file = c.$('file');
  notch.classList.remove('wide', 'open');
  res.classList.remove('on');
  ring.style.strokeDashoffset = '100';
  sub.textContent = ru() ? 'Сжатие PDF…' : 'Compressing PDF…';
  ghost.classList.remove('on', 'small');
  file.classList.remove('lifted');
  cur.classList.remove('grabbing');
  c.move(600, 470);
  c.move(370, 390, ghost);
  await c.wait(400);
  c.move(392, 412);
  await c.wait(1000);
  cur.classList.add('grabbing');
  ghost.classList.add('on');
  file.classList.add('lifted');
  await c.wait(200);
  c.move(400, 120);
  c.move(370, 100, ghost);
  await c.wait(900);
  notch.classList.add('wide');
  c.move(400, 40);
  c.move(370, 20, ghost);
  ghost.classList.add('small');
  await c.wait(700);
  notch.classList.add('open');
  ghost.classList.remove('on');
  cur.classList.remove('grabbing');
  file.classList.remove('lifted');
  c.move(560, 300);
  for (let p = 0; p <= 100; p += c.reduced ? 100 : 5) {
    ring.style.strokeDashoffset = String(100 - p);
    await c.wait(80);
  }
  sub.textContent = ru() ? '18,4 МБ → 7,0 МБ' : '18.4 MB → 7.0 MB';
  res.classList.add('on');
  await c.wait(2200);
  notch.classList.remove('open', 'wide');
  await c.wait(900);
});

register('morfu-trace', async (c) => {
  const vec = c.$('vec'), bw = c.$('bw'), col = c.$('col');
  const s = [0, 1, 2].map((i) => c.$(`s${i}`));
  const set = (v: number[]) => s.forEach((el, i) => el.style.setProperty('--v', `${v[i]}%`));
  vec.classList.remove('col');
  bw.classList.add('on');
  col.classList.remove('on');
  set([30, 60, 45]);
  await c.wait(1200);
  set([30, 82, 70]);
  await c.wait(1400);
  bw.classList.remove('on');
  col.classList.add('on');
  vec.classList.add('col');
  set([70, 82, 70]);
  await c.wait(1600);
  set([55, 50, 85]);
  await c.wait(1600);
});

/* ── Pachaq ── */
register('pachaq-drop', async (c) => {
  const drop = c.$('drop'), list = c.$('list'), empty = c.$('empty'), seg = c.$$('[data-fmt]');
  const files = c.$$('[data-fly]');
  const rows = c.$$('[data-prow]');
  const progress = c.$('progress');
  rows.forEach((r) => r.classList.remove('in'));
  empty.hidden = false;
  list.classList.remove('has');
  files.forEach((f) => f.classList.remove('go', 'gone'));
  progress.style.width = '0';
  seg.forEach((b, i) => b.classList.toggle('on', i === 0));
  await c.wait(800);
  files.forEach((f) => f.classList.add('go'));
  await c.wait(700);
  drop.classList.add('over');
  await c.wait(500);
  drop.classList.remove('over');
  files.forEach((f) => f.classList.add('gone'));
  empty.hidden = true;
  list.classList.add('has');
  for (let i = 0; i < rows.length; i++) {
    progress.style.width = `${((i + 1) / rows.length) * 100}%`;
    rows[i].classList.add('in');
    await c.wait(380);
  }
  await c.wait(500);
  progress.style.width = '0';
  await c.wait(2400);
  // смена формата — как в верхней панели
  for (const i of [1, 2, 0]) {
    seg.forEach((b, j) => b.classList.toggle('on', j === i));
    await c.wait(700);
  }
  await c.wait(600);
});

register('pachaq-crop', async (c) => {
  const box = c.$('box'), size = c.$('size'), btns = c.$$('[data-ar]');
  const frames: [string, number, number, number, number, string][] = [
    ['1:1', 30, 8, 40, 84, '1080 × 1080'],
    ['4:5', 34, 4, 36, 92, '1080 × 1350'],
    ['16:9', 6, 18, 88, 62, '1920 × 1080'],
    ['9:16', 38, 4, 26, 92, '1080 × 1920'],
  ];
  for (const [ar, x, y, w, h, s] of frames) {
    btns.forEach((b) => b.classList.toggle('on', b.dataset.ar === ar));
    box.style.cssText = `left:${x}%;top:${y}%;width:${w}%;height:${h}%`;
    size.textContent = s;
    await c.wait(1700);
  }
});

register('pachaq-watch', async (c) => {
  const items = c.$$('[data-w]');
  const outs = c.$$('[data-wo]');
  items.forEach((i) => i.classList.remove('in'));
  outs.forEach((i) => i.classList.remove('in'));
  await c.wait(700);
  for (let i = 0; i < items.length; i++) {
    items[i].classList.add('in');
    await c.wait(700);
    outs[i].classList.add('in');
    await c.wait(900);
  }
  await c.wait(2200);
});

register('pachaq-context', async (c) => {
  const menu = c.$('menu'), sub = c.$('sub'), item = c.$('qa'), qaTarget = c.$('qatarget'), toast = c.$('toast'), sel = c.$('sel');
  menu.classList.remove('on');
  sub.classList.remove('on');
  item.classList.remove('hl');
  qaTarget.classList.remove('hl');
  toast.classList.remove('on');
  sel.classList.remove('on');
  c.move(520, 470);
  await c.wait(500);
  c.move(160, 170);
  await c.wait(1000);
  sel.classList.add('on');
  await c.wait(300);
  menu.classList.add('on');
  await c.wait(500);
  c.move(230, 318);
  await c.wait(900);
  item.classList.add('hl');
  sub.classList.add('on');
  await c.wait(500);
  c.move(440, 320);
  await c.wait(800);
  qaTarget.classList.add('hl');
  await c.wait(400);
  menu.classList.remove('on');
  sub.classList.remove('on');
  toast.classList.add('on');
  await c.wait(2600);
});

/* ── Sukhan ── */
register('sukhan-karaoke', async (c) => {
  const words = c.$$('[data-w]');
  const groups = c.$$('[data-g]');
  for (let g = 0; g < groups.length; g++) {
    groups.forEach((el, i) => el.classList.toggle('on', i === g));
    const ws = words.filter((w) => w.dataset.gi === String(g));
    for (const w of ws) {
      words.forEach((x) => x.classList.toggle('act', x === w));
      await c.wait(340);
    }
    await c.wait(220);
  }
  await c.wait(400);
});

register('sukhan-timeline', async (c) => {
  const head = c.$('head'), blk = c.$('drag'), time = c.$('time');
  head.style.transition = 'none';
  head.style.left = '0%';
  blk.classList.remove('lift');
  blk.style.translate = '0 0';
  void head.offsetWidth;
  head.style.transition = '';
  const total = 40;
  for (let i = 0; i <= total; i++) {
    head.style.left = `${(i / total) * 100}%`;
    const s = (i / total) * 12;
    time.textContent = `00:${String(Math.floor(s)).padStart(2, '0')}.${String(Math.floor((s % 1) * 100)).padStart(2, '0')}`;
    if (i === 14) blk.classList.add('lift');
    if (i === 16) blk.style.translate = '26px 0';
    if (i === 20) blk.classList.remove('lift');
    await c.wait(110);
  }
  await c.wait(900);
});

register('sukhan-formats', async (c) => {
  const frame = c.$('frame'), btns = c.$$('[data-ar]');
  for (const ar of ['9:16', '1:1', '4:5', '16:9']) {
    btns.forEach((b) => b.classList.toggle('on', b.dataset.ar === ar));
    frame.dataset.ar = ar;
    await c.wait(1800);
  }
});

register('sukhan-engine', async (c) => {
  const bars = c.$$('[data-bar]');
  bars.forEach((b) => b.style.setProperty('--p', '0'));
  await c.wait(400);
  bars.forEach((b) => b.style.setProperty('--p', b.dataset.bar!));
  await c.wait(5000);
});

/* ── radius ── */
register('radius-matte', async (c) => {
  const split = c.$('split');
  for (const v of [50, 80, 18, 50]) {
    split.style.setProperty('--x', `${v}%`);
    await c.wait(1500);
  }
});

register('radius-local', async (c) => {
  const steps = c.$$('[data-step]');
  for (let i = 0; i <= steps.length; i++) {
    steps.forEach((s, j) => s.classList.toggle('on', j < i));
    await c.wait(800);
  }
  await c.wait(1800);
});

/* ── BLA-БЛА ── */
register('bla-upload', async (c) => {
  const file = c.$('file'), chunks = c.$$('[data-chunk]'), status = c.$('status'), bar = c.$('bar');
  const st = JSON.parse(status.dataset.steps!) as string[];
  file.classList.remove('in');
  chunks.forEach((ch) => ch.classList.remove('on', 'done'));
  status.textContent = st[0];
  bar.style.width = '0';
  await c.wait(700);
  file.classList.add('in');
  await c.wait(900);
  status.textContent = st[1];
  for (let p = 0; p <= 100; p += c.reduced ? 100 : 5) {
    bar.style.width = `${p}%`;
    await c.wait(60);
  }
  status.textContent = st[2];
  for (const ch of chunks) {
    ch.classList.add('on');
    await c.wait(500);
  }
  for (const ch of chunks) {
    ch.classList.add('done');
    await c.wait(450);
  }
  status.textContent = st[3];
  await c.wait(2200);
});

register('bla-providers', async (c) => {
  const tabs = c.$$('[data-tab]'), cards = c.$$('[data-p]');
  for (const t of ['all', 'mix', 'kz', 'free', 'all']) {
    tabs.forEach((b) => b.classList.toggle('on', b.dataset.tab === t));
    cards.forEach((card) => card.classList.toggle('dim', t !== 'all' && !card.dataset.p!.split(' ').includes(t)));
    await c.wait(1500);
  }
});

register('bla-result', async (c) => {
  const lines = c.$$('[data-line]'), btns = c.$$('[data-dl]');
  lines.forEach((l) => l.classList.remove('in'));
  btns.forEach((b) => b.classList.remove('hl'));
  await c.wait(400);
  for (const l of lines) {
    l.classList.add('in');
    await c.wait(550);
  }
  await c.wait(400);
  for (const b of btns) {
    b.classList.add('hl');
    await c.wait(300);
    b.classList.remove('hl');
  }
  await c.wait(2000);
});

/* ── Picta ── */
register('picta-search', async (c) => {
  const input = c.$('q'), hint = c.$('hint'), tiles = c.$$('[data-tile]');
  const q = input.dataset.q!;
  input.textContent = '';
  hint.classList.remove('on');
  tiles.forEach((t) => t.classList.remove('in'));
  await c.wait(600);
  for (let i = 1; i <= q.length; i++) {
    input.textContent = q.slice(0, i);
    await c.wait(140);
  }
  await c.wait(300);
  hint.classList.add('on');
  for (const t of tiles) {
    t.classList.add('in');
    await c.wait(70);
  }
  await c.wait(3200);
});

register('picta-license', async (c) => {
  const tags = c.$$('[data-tag]'), modal = c.$('modal');
  modal.classList.remove('on');
  tags.forEach((t) => t.classList.remove('in'));
  await c.wait(500);
  modal.classList.add('on');
  await c.wait(500);
  for (const t of tags) {
    t.classList.add('in');
    await c.wait(320);
  }
  await c.wait(3200);
});

register('picta-icons', async (c) => {
  const grid = c.$('grid'), sw = c.$$('[data-sw]'), modeBtns = c.$$('[data-mode]'), panes = c.$$('[data-pane]');
  const show = (m: string) => {
    modeBtns.forEach((b) => b.classList.toggle('on', b.dataset.mode === m));
    panes.forEach((p) => p.classList.toggle('on', p.dataset.pane === m));
  };
  show('icons');
  for (const s of sw) {
    sw.forEach((x) => x.classList.toggle('on', x === s));
    grid.style.color = s.dataset.sw!;
    await c.wait(900);
  }
  show('colors');
  await c.wait(2800);
});

/* ── Новые изделия: PadBridge, Moss Pocket, Peecube, ANY CAMERA ── */
// Координаты элемента внутри сцены (в единицах дизайна, без масштаба)
const at = (root: HTMLElement, el: Element) => {
  const inner = root.querySelector<HTMLElement>('.scene-inner')!;
  const k = Number(root.style.getPropertyValue('--k')) || 1;
  const a = el.getBoundingClientRect(), b = inner.getBoundingClientRect();
  return { x: (a.left - b.left) / k, y: (a.top - b.top) / k, w: a.width / k, h: a.height / k };
};
const mid = (root: HTMLElement, el: Element) => {
  const r = at(root, el);
  return [r.x + r.w / 2, r.y + r.h / 2] as const;
};

register('padbridge-map', async (c) => {
  const order = ['south', 'east', 'west', 'north', 'l1', 'r1', 'ls', 'rs'];
  const pads = c.$$('.pd'), rows = c.$$('.pb-row');
  for (const k of order) {
    pads.forEach((p) => p.classList.toggle('hot', p.dataset.p === k));
    rows.forEach((r) => r.classList.toggle('hot', r.dataset.r === k));
    await c.wait(900);
  }
  pads.forEach((p) => p.classList.remove('hot'));
  rows.forEach((r) => r.classList.remove('hot'));
  await c.wait(600);
});

register('padbridge-newgame', async (c) => {
  const ng = c.root.querySelector<HTMLElement>('.ng')!;
  const opts = c.$$('.ng-opt'), det = c.$('det'), apply = c.$('apply'), toast = c.$('toast');
  const texts = JSON.parse(det.dataset.texts!) as string[];
  const sel = (i: number) => {
    opts.forEach((o, j) => o.classList.toggle('sel', i === j));
    det.textContent = texts[i];
  };
  ng.classList.remove('gone');
  toast.classList.remove('on');
  sel(0);
  await c.wait(1400);
  for (const i of [1, 2, 1, 0]) {
    sel(i);
    await c.wait(800);
  }
  await c.wait(500);
  apply.classList.add('down');
  await c.wait(160);
  apply.classList.remove('down');
  ng.classList.add('gone');
  toast.classList.add('on');
  await c.wait(2200);
  toast.classList.remove('on');
  await c.wait(400);
});

register('padbridge-learn', async (c) => {
  const keys = c.$$('.lr-k'), maps = c.$$('.lr-m'), done = c.$('done');
  keys.forEach((k) => (k.querySelector<HTMLElement>('i')!.style.width = '0'));
  maps.forEach((m) => m.classList.remove('on', 'hot'));
  done.classList.remove('on');
  await c.wait(500);
  for (let step = 1; step <= 5; step++) {
    keys.forEach((k) => {
      const i = k.querySelector<HTMLElement>('i')!;
      i.style.width = `${(Number(i.dataset.v) * step) / 5}%`;
    });
    await c.wait(c.reduced ? 0 : 650);
  }
  for (const k of keys) {
    const m = maps.find((x) => x.dataset.m === k.dataset.t)!;
    m.classList.add('on', 'hot');
    await c.wait(380);
    m.classList.remove('hot');
  }
  done.classList.add('on');
  await c.wait(2400);
});

register('padbridge-couch', async (c) => {
  const word = JSON.parse(c.root.querySelector('script[data-word]')!.textContent!) as string;
  const typed = c.$('typed'), keys = c.$$('.osk-k');
  typed.textContent = '';
  await c.wait(700);
  for (const ch of word) {
    const k = keys.find((x) => x.dataset.ch === ch);
    k?.classList.add('hot');
    await c.wait(420);
    typed.textContent += ch;
    k?.classList.remove('hot');
    await c.wait(200);
  }
  await c.wait(2200);
});

register('moss-panel', async (c) => {
  const files = c.$$('.mi.file[data-f]'), tip = c.$('tip'), nw = c.$('new');
  const names = files.map((f) => f.getAttribute('title')!);
  nw.classList.remove('in', 'done');
  tip.classList.remove('on');
  c.move(620, 300);
  await c.wait(600);
  for (const i of [0, 2, 4]) {
    const [x, y] = mid(c.root, files[i]);
    c.move(x, y);
    await c.wait(900);
    tip.textContent = names[i];
    const t = at(c.root, files[i]);
    tip.style.left = `${t.x + t.w / 2}px`;
    tip.style.translate = '-50% 0';
    tip.classList.add('on');
    await c.wait(900);
    tip.classList.remove('on');
  }
  // новая загрузка появляется в кармане сама
  c.move(620, 300);
  await c.wait(500);
  nw.classList.add('in');
  await c.wait(1600);
  nw.classList.add('done');
  await c.wait(1800);
});

register('moss-magnify', async (c) => {
  const items = c.$$('.dockrow .mi');
  const reset = () => items.forEach((m) => m.style.setProperty('--s', '1'));
  const cur = c.$('cursor');
  cur.style.transition = '';
  reset();
  c.move(160, 380);
  await c.wait(700);
  const base = items.map((m) => mid(c.root, m));
  const y = base[0][1];
  const from = base[0][0] - 20, to = base[base.length - 2][0] + 20;
  const steps = c.reduced ? 1 : 40;
  // во время проводки указатель идёт ровно, без задержки
  c.move(from, y);
  await c.wait(900);
  cur.style.transition = 'translate 0.07s linear';
  for (let s = 0; s <= steps; s++) {
    const x = from + ((to - from) * s) / steps;
    c.move(x, y);
    items.forEach((m, i) => {
      const d = Math.abs(base[i][0] - x);
      m.style.setProperty('--s', String(1 + 0.6 * Math.max(0, 1 - d / 130)));
    });
    await c.wait(70);
  }
  cur.style.transition = '';
  await c.wait(600);
  reset();
  c.move(560, 360);
  await c.wait(1200);
});

register('moss-drag', async (c) => {
  const cur = c.$('cursor'), ghost = c.$('ghost'), att = c.$('att');
  const file = c.root.querySelector<HTMLElement>('.mi.file[data-f="0"]')!;
  att.classList.remove('in');
  ghost.classList.remove('on');
  cur.classList.remove('grabbing');
  file.style.opacity = '';
  const f = at(c.root, file);
  ghost.style.transition = 'none';
  c.move(f.x, f.y, ghost);
  void ghost.offsetWidth;
  ghost.style.transition = '';
  c.move(620, 300);
  await c.wait(700);
  c.move(f.x + f.w / 2, f.y + f.h / 2);
  await c.wait(1000);
  cur.classList.add('grabbing');
  ghost.classList.add('on');
  file.style.opacity = '0.35';
  await c.wait(250);
  c.move(450, 210);
  c.move(430, 190, ghost);
  await c.wait(1100);
  ghost.classList.remove('on');
  cur.classList.remove('grabbing');
  file.style.opacity = '';
  att.classList.add('in');
  await c.wait(2400);
});

register('peecube-popup', async (c) => {
  const link = c.$('link'), chip = c.$('chip'), pop = c.$('pop');
  [link, chip, pop].forEach((e) => e.classList.remove('on', 'hot'));
  c.move(620, 460);
  await c.wait(600);
  const [x, y] = mid(c.root, link);
  c.move(x, y);
  await c.wait(1000);
  link.classList.add('hot');
  chip.classList.add('on');
  await c.wait(700);
  pop.classList.add('on');
  chip.classList.remove('on');
  c.move(700, 470);
  await c.wait(3200);
  pop.classList.remove('on');
  link.classList.remove('hot');
  await c.wait(600);
});

register('peecube-analysis', async (c) => {
  const sws = c.$$('.sws2 span[data-sw]'), copied = c.$('copied'), val = c.$('cval');
  copied.classList.remove('on');
  await c.wait(900);
  for (const s of [0, 3, 1]) {
    sws.forEach((e, i) => e.classList.toggle('hot', i === s));
    await c.wait(500);
    val.textContent = sws[s].querySelector('b')!.textContent;
    copied.classList.add('on');
    await c.wait(1300);
    copied.classList.remove('on');
    await c.wait(300);
  }
  sws.forEach((e) => e.classList.remove('hot'));
  await c.wait(600);
});

register('peecube-media', async (c) => {
  const rows = c.$$('.mrow');
  rows.forEach((r) => r.classList.remove('hot', 'done'));
  await c.wait(800);
  for (const r of rows) {
    r.classList.add('hot');
    await c.wait(450);
    r.classList.remove('hot');
    r.classList.add('done');
    await c.wait(150);
  }
  await c.wait(2000);
});

register('peecube-features', async (c) => {
  const tgs = c.$$('.tg');
  tgs.forEach((t) => t.classList.add('on'));
  await c.wait(1200);
  for (const i of [1, 4]) {
    tgs[i].classList.remove('on');
    await c.wait(900);
    tgs[i].classList.add('on');
    await c.wait(900);
  }
  await c.wait(800);
});

register('anycam-call', async (c) => {
  const me = c.$('me'), name = c.$('camname'), sel = c.$('sel'), btn = c.$('cambtn');
  me.classList.remove('on');
  sel.classList.remove('hot');
  btn.classList.remove('hot');
  name.textContent = 'FaceTime HD';
  await c.wait(1200);
  sel.classList.add('hot');
  await c.wait(700);
  name.textContent = 'ANY CAMERA';
  sel.classList.remove('hot');
  await c.wait(600);
  btn.classList.add('hot');
  me.classList.add('on');
  await c.wait(3600);
});

register('anycam-popup', async (c) => {
  const sw = c.$('sw'), state = c.$('state'), ok = c.$('ok');
  const res = c.$$('.seg2 span[data-res]');
  const off = state.dataset.off ?? (state.dataset.off = state.textContent!);
  const setRes = (i: number) => res.forEach((r, j) => r.classList.toggle('on', i === j));
  sw.classList.remove('on');
  ok.classList.remove('on');
  state.textContent = off;
  setRes(1);
  await c.wait(1100);
  sw.classList.add('on');
  state.textContent = ru() ? 'Включено' : 'On';
  await c.wait(500);
  ok.classList.add('on');
  await c.wait(1200);
  setRes(2);
  await c.wait(2600);
});

register('anycam-test', async (c) => {
  const t = c.$('time');
  const fmt = (ms: number) => {
    const p = (n: number, l = 2) => String(Math.floor(n)).padStart(l, '0');
    return `${p(ms / 3600000)}:${p((ms / 60000) % 60)}:${p((ms / 1000) % 60)}.${p(ms % 1000, 3)}`;
  };
  if (c.reduced) {
    t.textContent = fmt(24000);
    return;
  }
  const start = performance.now();
  for (let i = 0; i < 300; i++) {
    t.textContent = fmt(performance.now() - start);
    await c.wait(33);
  }
});

/* ── Snowpuff ── */
// Перезапустить CSS-анимацию по классу
const replay = (el: HTMLElement, cls: string) => {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
};
// Сбросить снег и сосульки (.bare) и дать им вырасти заново
const regrow = (root: HTMLElement) => {
  root.classList.add('bare');
  void root.offsetWidth;
  root.classList.remove('bare');
};

register('snowpuff-desktop', async (c) => {
  const cur = c.$('cursor'), win = c.$('wa'), dock = c.$('dock');
  const bursts = c.$$('.burst');
  let b = 0;
  const puff = (x: number, y: number) => {
    const el = bursts[b++ % bursts.length];
    c.move(x, y, el);
    replay(el, 'go');
  };
  // смести снег курсором слева направо по краю элемента
  const sweep = async (el: HTMLElement, y: number) => {
    const r = at(c.root, el);
    c.move(r.x - 4, y);
    await c.wait(1000);
    cur.style.transition = 'translate 0.3s linear';
    for (let i = 1; i <= 6; i++) {
      const x = r.x - 4 + ((r.w + 8) * i) / 6;
      c.move(x, y);
      el.style.setProperty('--cut', `${(i / 6) * 100 + 2}%`);
      await c.wait(300);
      puff(x, y + 2);
    }
    cur.style.transition = '';
  };
  bursts.forEach((el) => el.classList.remove('go'));
  win.style.setProperty('--cut', '0%');
  dock.style.setProperty('--cut', '0%');
  regrow(c.root);
  c.move(700, 430);
  await c.wait(4200);
  if (c.reduced) return;
  await sweep(win, 100);
  await c.wait(400);
  const d = at(c.root, dock);
  await sweep(dock, d.y - 4);
  await c.wait(600);
  c.move(700, 430);
  await c.wait(1800);
});

register('snowpuff-icicles', async (c) => {
  const win = c.$('win'), cur = c.$('cursor');
  cur.classList.remove('grabbing');
  win.style.translate = '';
  c.move(620, 430);
  await c.wait(1800);
  if (c.reduced) return;
  c.move(300, 96);
  await c.wait(1100);
  cur.classList.add('grabbing');
  await c.wait(250);
  cur.style.transition = 'translate 0.08s linear';
  c.root.classList.add('fall');
  for (const [dx, dy] of [[-16, 4], [18, -3], [-18, 3], [16, -2], [-12, 2], [10, 0], [-6, 0], [0, 0]]) {
    win.style.translate = `${dx}px ${dy}px`;
    c.move(300 + dx, 96 + dy);
    await c.wait(85);
  }
  cur.style.transition = '';
  cur.classList.remove('grabbing');
  await c.wait(1700);
  c.move(620, 430);
  // сосульки отрастают заново
  c.root.classList.add('bare');
  c.root.classList.remove('fall');
  void c.root.offsetWidth;
  c.root.classList.remove('bare');
  await c.wait(3600);
});

register('snowpuff-glow', async (c) => {
  const a = c.$('wa'), b = c.$('wb'), halo = c.$('halo');
  const focus = (w: HTMLElement) => {
    a.classList.toggle('on', w === a);
    b.classList.toggle('on', w === b);
    halo.dataset.at = w === a ? 'a' : 'b';
  };
  focus(a);
  c.move(640, 450);
  await c.wait(1600);
  c.move(590, 280);
  await c.wait(1100);
  focus(b);
  await c.wait(2600);
  c.move(220, 280);
  await c.wait(1100);
  focus(a);
  await c.wait(2400);
});

register('snowpuff-menu', async (c) => {
  const menu = c.$('menu'), tray = c.$('tray'), snow = c.$('snow'), mic = c.$('mic'), puffRow = c.$('puff'), gust = c.$('gust');
  const radios = c.$$('[data-r]');
  const pick = (i: number) => radios.forEach((r, j) => r.classList.toggle('chk', j === i));
  const hot = (el?: HTMLElement) => c.$$('.mrow').forEach((r) => r.classList.toggle('hot', r === el));
  const open = async () => {
    const [x, y] = mid(c.root, tray);
    c.move(x + 2, y + 4);
    await c.wait(1000);
    tray.classList.add('hot');
    menu.classList.add('open');
    await c.wait(500);
  };
  const choose = async (row: HTMLElement) => {
    const [x, y] = mid(c.root, row);
    c.move(x - 30, y + 3);
    await c.wait(900);
    hot(row);
    await c.wait(450);
  };
  const close = () => {
    hot();
    menu.classList.remove('open');
    tray.classList.remove('hot');
  };
  // исходное состояние: ровный снегопад, микрофон выключен
  close();
  pick(2);
  snow.dataset.lvl = '2';
  mic.classList.remove('on');
  puffRow.classList.remove('chk');
  c.root.classList.remove('blow');
  gust.classList.remove('go');
  c.move(560, 330);
  await c.wait(1400);
  await open();
  await choose(radios[3]);
  pick(3);
  await c.wait(200);
  close();
  snow.dataset.lvl = '3';
  c.move(560, 330);
  await c.wait(2600);
  await open();
  await choose(puffRow);
  puffRow.classList.add('chk');
  await c.wait(200);
  close();
  mic.classList.add('on');
  c.move(560, 330);
  await c.wait(1300);
  if (c.reduced) return;
  replay(gust, 'go');
  await c.wait(250);
  c.root.classList.add('blow');
  await c.wait(1600);
  c.root.classList.remove('blow');
  await c.wait(2200);
});

register('snowpuff-calls', async (c) => {
  const call = c.$('call'), cam = c.$('cam'), app = c.$('callapp'), hang = c.$('hang');
  call.classList.remove('on');
  cam.classList.remove('on');
  c.root.classList.remove('hush');
  c.move(640, 400);
  await c.wait(2000);
  const [ax, ay] = mid(c.root, app);
  c.move(ax, ay);
  await c.wait(1000);
  app.classList.add('press');
  await c.wait(160);
  app.classList.remove('press');
  call.classList.add('on');
  await c.wait(500);
  cam.classList.add('on');
  await c.wait(400);
  // другое приложение включило камеру — снег и звук плавно уходят
  c.root.classList.add('hush');
  c.move(560, 330);
  await c.wait(3400);
  const [hx, hy] = mid(c.root, hang);
  c.move(hx, hy);
  await c.wait(1000);
  call.classList.remove('on');
  cam.classList.remove('on');
  await c.wait(700);
  c.root.classList.remove('hush');
  c.move(640, 400);
  await c.wait(2800);
});
