export type Point = { x: number; y: number };

const PAD = 10;
const r = (v: number) => Math.round(v * 100) / 100;

export function pointsOf(values: number[], max: number, width: number, height: number): Point[] {
  const span = height - PAD * 2;
  return values.map((v, i) => ({
    x: values.length === 1 ? width / 2 : r((i / (values.length - 1)) * width),
    y: r(height - PAD - Math.min(1, Math.max(0, v / (max || 1))) * span),
  }));
}

export function linePath(points: Point[]): string {
  if (!points.length) return "";
  let d = `M${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    d += `C${r(p1.x + (p2.x - p0.x) / 6)} ${r(p1.y + (p2.y - p0.y) / 6)} ${r(p2.x - (p3.x - p1.x) / 6)} ${r(p2.y - (p3.y - p1.y) / 6)} ${p2.x} ${p2.y}`;
  }
  return d;
}
