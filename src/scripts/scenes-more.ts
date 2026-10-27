// Сценарии сцен Morfu, Pachaq, Sukhan, radius, BLA-БЛА и Picta.
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
