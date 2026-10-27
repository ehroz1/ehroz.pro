// «Обои»: медленный mesh-градиент на WebGL, слегка тянется к курсору.
// Рендерим в низком разрешении (градиент гладкий), стоп при скрытой вкладке и вне экрана.
// Нет WebGL или включено «уменьшить движение» — остаются CSS-градиенты из .wallpaper.

const FRAG = `
precision mediump float;
uniform vec2 r;
uniform float t;
uniform vec2 m;
uniform vec3 ca;
uniform vec3 cb;
uniform vec3 cc;
uniform vec3 bg;
uniform float light;

vec3 blob(vec2 uv, vec2 p, vec3 c, float s) {
  float d = length(uv - p);
  return c * exp(-d * d / s);
}
void main() {
  vec2 uv = gl_FragCoord.xy / r;
  uv.x *= r.x / r.y;
  float a = r.x / r.y;
  float k = t * 0.06;
  vec2 warp = vec2(sin(uv.y * 3.0 + k * 2.0), cos(uv.x * 2.5 - k * 1.7)) * 0.06;
  uv += warp;
  vec2 mm = vec2(m.x * a, m.y);
  vec3 col = bg;
  col += blob(uv, vec2(a * (0.2 + 0.08 * sin(k * 1.3)), 0.78 + 0.08 * cos(k)), ca, 0.16);
  col += blob(uv, vec2(a * (0.85 + 0.06 * cos(k * 0.9)), 0.7 + 0.1 * sin(k * 1.1)), cb, 0.14);
  col += blob(uv, vec2(a * (0.55 + 0.1 * sin(k * 0.7)), 0.08 + 0.06 * cos(k * 1.4)), cc, 0.2);
  col += blob(uv, mix(vec2(a * 0.5, 0.5), mm, 0.9), mix(ca, cb, 0.5 + 0.5 * sin(k)), 0.05) * 0.3;
  gl_FragColor = vec4(col, 1.0);
}`;

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

function hex(c: string): [number, number, number] {
  const s = c.trim().replace('#', '');
  const n = parseInt(s.length === 3 ? s.replace(/./g, (x) => x + x) : s.slice(0, 6), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function startWallpaper() {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-wallpaper]');
  if (!canvas) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power', preserveDrawingBuffer: false });
  if (!gl) return;

  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (n: string) => gl.getUniformLocation(prog, n);
  const uR = U('r'), uT = U('t'), uM = U('m'), uA = U('ca'), uB = U('cb'), uC = U('cc'), uBg = U('bg'), uL = U('light');

  const SCALE = 0.35;
  const resize = () => {
    const w = Math.max(2, Math.round(innerWidth * SCALE));
    const h = Math.max(2, Math.round(innerHeight * SCALE));
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    gl.uniform2f(uR, w, h);
  };
  const colors = () => {
    const cs = getComputedStyle(document.documentElement);
    const isLight = cs.colorScheme.includes('light') && !cs.colorScheme.includes('dark');
    const bg = hex(cs.getPropertyValue('--bg') || '#08080b');
    const k = isLight ? 0.6 : 0.95;
    // В светлой теме цвет — это сдвиг от фона к оттенку (значения могут быть отрицательными).
    const mix = (c: string) => hex(cs.getPropertyValue(c)).map((v, i) => (isLight ? (v - bg[i]) * k : v * k)) as [number, number, number];
    gl.uniform3fv(uA, mix('--wall-a'));
    gl.uniform3fv(uB, mix('--wall-b'));
    gl.uniform3fv(uC, mix('--wall-c'));
    gl.uniform3fv(uBg, bg);
    gl.uniform1f(uL, isLight ? 1 : 0);
  };
  resize();
  colors();
  addEventListener('resize', resize, { passive: true });
  new MutationObserver(colors).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style'] });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', colors);

  let mx = 0.5, my = 0.5, tx = 0.5, ty = 0.5;
  addEventListener('pointermove', (e) => {
    tx = e.clientX / innerWidth;
    ty = 1 - e.clientY / innerHeight;
  }, { passive: true });

  let raf = 0;
  const t0 = performance.now() - Math.random() * 60000;
  const frame = (now: number) => {
    mx += (tx - mx) * 0.03;
    my += (ty - my) * 0.03;
    gl.uniform1f(uT, (now - t0) / 1000);
    gl.uniform2f(uM, mx, my);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    raf = requestAnimationFrame(frame);
  };
  const draw = () => {
    gl.uniform1f(uT, 20);
    gl.uniform2f(uM, 0.5, 0.5);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  if (reduced) {
    draw();
    addEventListener('resize', draw, { passive: true });
  } else {
    raf = requestAnimationFrame(frame);
    document.addEventListener('visibilitychange', () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(frame);
    });
  }
  canvas.classList.add('on');
}
