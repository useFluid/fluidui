const BOX = 120;
const TOP = 8;
const FLOOR = 6;

const clamp = (v: number) => Math.min(BOX, Math.max(0, v));
const r = (v: number) => Math.round(v * 100) / 100;

export function areaPath(values: number[], max = Math.max(1, ...values)): string {
  const span = BOX - TOP - FLOOR;
  const heightOf = (v: number) => clamp(BOX - FLOOR - (Math.max(0, v) / (max || 1)) * span);
  const ys = values.length ? values.map(heightOf) : [BOX - FLOOR];
  if (ys.length === 1) ys.push(ys[0]);
  const step = BOX / (ys.length - 1);
  const pts = ys.map((y, i) => [i * step, y] as const);
  let d = `M0 ${BOX}L0 ${r(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = clamp(p1[1] + (p2[1] - p0[1]) / 6);
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = clamp(p2[1] - (p3[1] - p1[1]) / 6);
    d += `C${r(c1x)} ${r(c1y)} ${r(c2x)} ${r(c2y)} ${r(p2[0])} ${r(p2[1])}`;
  }
  return `${d}L${BOX} ${BOX}Z`;
}
