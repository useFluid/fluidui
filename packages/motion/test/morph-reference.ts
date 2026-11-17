import { brands } from "../../../registry/brands.ts";
import { createMorpher, shapes, springs } from "../src/index.ts";

export const LOGO = brands[0].logo;
export const RING_AND_DOT = "M60 20a40 40 0 1 0 0 80a40 40 0 1 0 0-80ZM60 40a20 20 0 1 1 0 40a20 20 0 1 1 0-40ZM105 15a8 8 0 1 0 0 16a8 8 0 1 0 0-16Z";
const FRAMES = [1 / 60, 1 / 144, 0.1, 1 / 60, 1 / 30, 1 / 60, 1 / 240, 1 / 60];

export function runScenarios() {
  const out: Record<string, number[][]> = {};
  const numbers = (d: string) =>
    d
      .split(/[MLZ ]/)
      .filter(Boolean)
      .map(Number);
  const record = (name: string, from: string, to: string, then?: string) => {
    const m = createMorpher(from, springs.bouncy);
    m.to(to);
    const frames: number[][] = [];
    FRAMES.forEach((dt, i) => {
      if (then && i === 4) m.to(then);
      m.step(dt);
      frames.push(numbers(m.path()));
    });
    out[name] = frames;
  };
  record("circle to logo", shapes.circle, LOGO);
  record("ring and dot to circle", RING_AND_DOT, shapes.circle);
  record("circle to flower, retarget to logo", shapes.circle, shapes.flower, LOGO);
  return out;
}
