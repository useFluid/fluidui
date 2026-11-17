import { type Contour, sampleContours } from "./path.ts";
import { type SpringConfig, springs, stepSpring } from "./spring.ts";

type Slot = {
  x: Float64Array;
  y: Float64Array;
  vx: Float64Array;
  vy: Float64Array;
  tx: Float64Array;
  ty: Float64Array;
  w: Float64Array;
  a: Float64Array;
  b: Float64Array;
  c: Float64Array;
  d: Float64Array;
  dt: number;
};

export type MorpherConfig = SpringConfig & {
  points?: number;
  spread?: number;
};

export type Morpher = {
  to(d: string): void;
  jump(d: string): void;
  step(dt: number): boolean;
  path(): string;
};

const REST = 0.02;

export function createMorpher(initial: string, config: MorpherConfig = springs.soft): Morpher {
  const n = config.points ?? 160;
  const spread = config.spread ?? 0.22;
  let slots: Slot[] = [];
  let exact = initial;
  let resting = true;

  const makeSlot = (x0: Float64Array, y0: Float64Array, index: number): Slot => {
    const w = new Float64Array(n);
    const phase = index * 1.7;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      w[i] = config.w * (1 + spread * (0.6 * Math.sin(a * 2 + phase) + 0.4 * Math.sin(a * 5 + phase * 2)));
    }
    return {
      x: Float64Array.from(x0),
      y: Float64Array.from(y0),
      vx: new Float64Array(n),
      vy: new Float64Array(n),
      tx: Float64Array.from(x0),
      ty: Float64Array.from(y0),
      w,
      a: new Float64Array(n),
      b: new Float64Array(n),
      c: new Float64Array(n),
      d: new Float64Array(n),
      dt: -1,
    };
  };

  const prepare = (s: Slot, dt: number) => {
    if (s.dt === dt) return;
    s.dt = dt;
    for (let i = 0; i < n; i++) {
      const fromOffset = stepSpring(1, 0, 0, s.w[i], config.z, dt);
      s.a[i] = fromOffset.x;
      s.d[i] = fromOffset.v;
      const fromVelocity = stepSpring(0, 1, 0, s.w[i], config.z, dt);
      s.b[i] = fromVelocity.x;
      s.c[i] = fromVelocity.v;
    }
  };

  const parts: string[] = [];
  const CENTS = Array.from({ length: 100 }, (_, i) => (i < 10 ? `.0${i}` : `.${i}`));
  const write = (v: number) => {
    const hundredths = Math.round(v * 100);
    const size = hundredths < 0 ? -hundredths : hundredths;
    const whole = (size - (size % 100)) / 100;
    return `${hundredths < 0 ? "-" : ""}${whole}${CENTS[size % 100]}`;
  };

  const align = (slot: Slot, c: Contour) => {
    let best = 0;
    let bestCost = Infinity;
    for (let off = 0; off < n; off += 2) {
      let cost = 0;
      for (let i = 0; i < n; i += 4) {
        const j = (i + off) % n;
        const dx = slot.x[i] - c.x[j];
        const dy = slot.y[i] - c.y[j];
        cost += dx * dx + dy * dy;
      }
      if (cost < bestCost) {
        bestCost = cost;
        best = off;
      }
    }
    for (let i = 0; i < n; i++) {
      const j = (i + best) % n;
      slot.tx[i] = c.x[j];
      slot.ty[i] = c.y[j];
    }
  };

  const api: Morpher = {
    jump(d) {
      const next = sampleContours(d, n);
      exact = d;
      resting = true;
      slots = next.map((c, i) => makeSlot(c.x, c.y, i));
    },
    to(d) {
      if (d === exact) return;
      const target = sampleContours(d, n);
      exact = d;
      resting = false;
      while (slots.length < target.length) {
        const c = target[slots.length];
        slots.push(makeSlot(new Float64Array(n).fill(c.cx), new Float64Array(n).fill(c.cy), slots.length));
      }
      slots.forEach((slot, i) => {
        const c = target[i];
        if (c) {
          align(slot, c);
          return;
        }
        let cx = 0,
          cy = 0;
        for (let p = 0; p < n; p++) {
          cx += slot.x[p] / n;
          cy += slot.y[p] / n;
        }
        slot.tx.fill(cx);
        slot.ty.fill(cy);
      });
    },
    step(dt) {
      if (resting) return false;
      if (!(dt > 0 && dt < Infinity)) return true;
      let moving = false;
      for (const s of slots) {
        prepare(s, dt);
        const { x, y, vx, vy, tx, ty, a, b, c, d } = s;
        for (let i = 0; i < n; i++) {
          const ox = x[i] - tx[i];
          const oy = y[i] - ty[i];
          const px = a[i] * ox + b[i] * vx[i];
          const py = a[i] * oy + b[i] * vy[i];
          const nvx = d[i] * ox + c[i] * vx[i];
          const nvy = d[i] * oy + c[i] * vy[i];
          x[i] = tx[i] + px;
          y[i] = ty[i] + py;
          vx[i] = nvx;
          vy[i] = nvy;
          if (!moving && (Math.abs(px) > REST || Math.abs(nvx) > REST || Math.abs(py) > REST || Math.abs(nvy) > REST)) moving = true;
        }
      }
      if (!moving) api.jump(exact);
      return moving;
    },
    path() {
      if (resting) return exact;
      parts.length = 0;
      for (const s of slots) {
        parts.push("M", write(s.x[0]), " ", write(s.y[0]));
        for (let i = 1; i < n; i++) parts.push("L", write(s.x[i]), " ", write(s.y[i]));
        parts.push("Z");
      }
      return parts.join("");
    },
  };
  api.jump(initial);
  return api;
}
