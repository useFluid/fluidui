import { describe, expect, it } from "vitest";
import {
  PathError,
  createMorpher,
  createSpring,
  fitPath,
  parsePath,
  sampleContours,
  shapes,
  springCss,
  springs,
  stepSpring,
} from "../src/index";

const LETTER_C = "M90 30A42 42 0 1 0 90 90L74 76A21 21 0 1 1 74 44Z";
const RING_AND_DOT =
  "M60 20a40 40 0 1 0 0 80a40 40 0 1 0 0-80ZM60 40a20 20 0 1 1 0 40a20 20 0 1 1 0-40ZM105 15a8 8 0 1 0 0 16a8 8 0 1 0 0-16Z";

describe("spring", () => {
  it("gives the same result at any frame rate", () => {
    for (const config of [springs.bouncy, springs.firm, { w: 20, z: 1.4 }]) {
      const a = createSpring(0, config);
      const b = createSpring(0, config);
      a.target = b.target = 100;
      for (let i = 0; i < 30; i++) a.step(1 / 30);
      for (let i = 0; i < 240; i++) b.step(1 / 240);
      expect(a.value).toBeCloseTo(b.value, 6);
      expect(a.velocity).toBeCloseTo(b.velocity, 6);
    }
  });

  it("has a velocity that matches the slope of the position", () => {
    for (const z of [0.5, 1, 1.5]) {
      const dt = 1e-5;
      const x1 = stepSpring(3, -7, 10, 18, z, 0.2).x;
      const r = stepSpring(3, -7, 10, 18, z, 0.2 + dt);
      expect((r.x - x1) / dt).toBeCloseTo(r.v, 2);
    }
  });

  it("settles exactly on the target and stops", () => {
    const s = createSpring(0, springs.snappy);
    s.target = 1;
    let frames = 0;
    while (s.step(1 / 60) && frames < 600) frames++;
    expect(frames).toBeLessThan(600);
    expect(s.value).toBe(1);
  });

  it("turns into a CSS easing that starts at 0 and ends at 1", () => {
    const { easing, duration } = springCss(springs.bouncy);
    expect(easing.startsWith("linear(0,")).toBe(true);
    expect(easing.endsWith(", 1)")).toBe(true);
    expect(duration).toBeGreaterThan(100);
  });
});

describe("path", () => {
  it("reads relative commands, compact arcs and implicit lines", () => {
    expect(parsePath("m10 10 20 0v20h-20z").filter((c) => c.c === "C")).toHaveLength(3);
    expect(parsePath("M0 0a10 10 0 01.5.5Z").some((c) => c.c === "C")).toBe(true);
    expect(parsePath("M0 0Q5 5 10 0T20 0S30 5 40 0Z").filter((c) => c.c === "C")).toHaveLength(3);
  });

  it("refuses what is not a path", () => {
    for (const bad of ["", "hello", "L10 10", "M10", "M0 0", "<svg>"]) {
      expect(() => parsePath(bad)).toThrow(PathError);
    }
  });

  it("fits any drawing into the box, centred", () => {
    const [c] = sampleContours(fitPath("M1000 1000H3000V2000H1000Z", 120), 80);
    expect(Math.min(...c.x)).toBeCloseTo(0, 1);
    expect(Math.max(...c.x)).toBeCloseTo(120, 1);
    expect(Math.min(...c.y)).toBeCloseTo(30, 1);
    expect(Math.max(...c.y)).toBeCloseTo(90, 1);
  });

  it("spaces points evenly, even on a concave shape", () => {
    const [c] = sampleContours(LETTER_C, 200);
    const gaps = Array.from(c.x, (x, i) => Math.hypot(c.x[(i + 1) % 200] - x, c.y[(i + 1) % 200] - c.y[i]));
    const mean = gaps.reduce((a, b) => a + b) / gaps.length;
    expect(Math.max(...gaps)).toBeLessThan(mean * 1.1);
  });

  it("finds every part of a logo, biggest first", () => {
    const parts = sampleContours(RING_AND_DOT, 100);
    expect(parts).toHaveLength(3);
    expect(parts[0].area).toBeGreaterThan(parts[1].area);
    expect(parts[1].area).toBeGreaterThan(parts[2].area);
    expect(parts[0].area).toBeCloseTo(Math.PI * 1600, -2);
  });
});

describe("morph", () => {
  const settle = (m: ReturnType<typeof createMorpher>, dt = 1 / 60) => {
    let frames = 0;
    while (m.step(dt) && frames < 1500) frames++;
    return frames;
  };

  it("ends on the exact target path, with its real curves", () => {
    const m = createMorpher(shapes.circle);
    m.to(LETTER_C);
    expect(settle(m)).toBeLessThan(1500);
    expect(m.path()).toBe(LETTER_C);
  });

  it("goes between logos with a different number of parts, both ways", () => {
    const m = createMorpher(shapes.dot);
    for (const d of [RING_AND_DOT, LETTER_C, RING_AND_DOT, shapes.circle]) {
      m.to(d);
      expect(settle(m)).toBeLessThan(1500);
      expect(m.path()).toBe(d);
    }
  });

  it("does not depend on the frame rate", () => {
    const run = (fps: number) => {
      const m = createMorpher(shapes.circle);
      m.to(shapes.flower);
      for (let i = 0; i < fps / 5; i++) m.step(1 / fps);
      return m.path().split(/[MLZ ]/).filter(Boolean).map(Number);
    };
    const a = run(30);
    const b = run(240);
    a.forEach((v, i) => expect(Math.abs(v - b[i])).toBeLessThan(0.02));
  });

  it("does not shake once it arrives", () => {
    const m = createMorpher(shapes.circle);
    m.to(shapes.square);
    settle(m);
    const before = m.path();
    for (let i = 0; i < 60; i++) expect(m.step(1 / 60)).toBe(false);
    expect(m.path()).toBe(before);
  });

  it("can change target in the middle of a move", () => {
    const m = createMorpher(shapes.circle);
    m.to(shapes.triangle);
    for (let i = 0; i < 6; i++) m.step(1 / 60);
    m.to(LETTER_C);
    expect(settle(m)).toBeLessThan(1500);
    expect(m.path()).toBe(LETTER_C);
  });
});
