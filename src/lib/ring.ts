/** Геометрия кольца (как в Morfus): секторы-«дольки» с зазорами. Углы в градусах, 0 — вверх, по часовой. */
export interface Sector {
  d: string;
  /** Центр подписи. */
  lx: number;
  ly: number;
  mid: number;
}

const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;
const pt = (cx: number, cy: number, r: number, deg: number) => [cx + r * Math.cos(rad(deg)), cy + r * Math.sin(rad(deg))] as const;
const f = (n: number) => Math.round(n * 100) / 100;

/**
 * n секторов вокруг (cx, cy). gap — зазор в пикселях (одинаковый у внешнего и внутреннего края),
 * corner — скругление углов.
 */
export function ringSectors(n: number, cx: number, cy: number, rOut: number, rIn: number, gap = 8, corner = 10, start = 0): Sector[] {
  const out: Sector[] = [];
  const step = 360 / n;
  for (let i = 0; i < n; i++) {
    const a0 = start + i * step - step / 2;
    const a1 = a0 + step;
    // угловой зазор на каждом радиусе — так ширина щели постоянна
    const go = ((gap / 2 / rOut) * 180) / Math.PI;
    const gi = ((gap / 2 / rIn) * 180) / Math.PI;
    const co = ((corner / rOut) * 180) / Math.PI;
    const ci = ((corner / rIn) * 180) / Math.PI;
    const o0 = a0 + go,
      o1 = a1 - go,
      i0 = a0 + gi,
      i1 = a1 - gi;
    const [ax, ay] = pt(cx, cy, rOut, o0 + co);
    const [bx, by] = pt(cx, cy, rOut, o1 - co);
    const [c1x, c1y] = pt(cx, cy, rOut, o1);
    const [cx2, cy2] = pt(cx, cy, rOut - corner, o1);
    const [dx, dy] = pt(cx, cy, rIn + corner, i1);
    const [c2x, c2y] = pt(cx, cy, rIn, i1);
    const [ex, ey] = pt(cx, cy, rIn, i1 - ci);
    const [fx, fy] = pt(cx, cy, rIn, i0 + ci);
    const [c3x, c3y] = pt(cx, cy, rIn, i0);
    const [gx, gy] = pt(cx, cy, rIn + corner, i0);
    const [hx, hy] = pt(cx, cy, rOut - corner, o0);
    const [c4x, c4y] = pt(cx, cy, rOut, o0);
    const large = o1 - o0 - 2 * co > 180 ? 1 : 0;
    const d = [
      `M${f(ax)} ${f(ay)}`,
      `A${rOut} ${rOut} 0 ${large} 1 ${f(bx)} ${f(by)}`,
      `Q${f(c1x)} ${f(c1y)} ${f(cx2)} ${f(cy2)}`,
      `L${f(dx)} ${f(dy)}`,
      `Q${f(c2x)} ${f(c2y)} ${f(ex)} ${f(ey)}`,
      `A${rIn} ${rIn} 0 0 0 ${f(fx)} ${f(fy)}`,
      `Q${f(c3x)} ${f(c3y)} ${f(gx)} ${f(gy)}`,
      `L${f(hx)} ${f(hy)}`,
      `Q${f(c4x)} ${f(c4y)} ${f(ax)} ${f(ay)}`,
      'Z',
    ].join(' ');
    const mid = (a0 + a1) / 2;
    const [lx, ly] = pt(cx, cy, (rOut + rIn) / 2, mid);
    out.push({ d, lx: f(lx), ly: f(ly), mid });
  }
  return out;
}
