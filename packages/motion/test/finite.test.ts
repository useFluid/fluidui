import { describe, expect, it } from "vitest";
import { createMorpher, createSpring, shapes } from "../src/index";

describe("morph output stays a valid path", () => {
  it("ignores a frame time that is not a positive number", () => {
    const m = createMorpher(shapes.circle);
    m.to(shapes.square);
    m.step(1 / 60);
    const before = m.path();
    for (const dt of [Number.NaN, Number.POSITIVE_INFINITY, -1 / 60, 0]) expect(m.step(dt)).toBe(true);
    expect(m.path()).toBe(before);
    m.step(1 / 60);
    expect(m.path()).not.toMatch(/NaN|undefined|Infinity/);
  });

  it("a spring with no stiffness snaps instead of writing NaN", () => {
    const m = createMorpher(shapes.circle, { w: 0, z: 0.5 });
    m.to(shapes.square);
    m.step(1 / 60);
    expect(m.path()).not.toMatch(/NaN|undefined|Infinity/);
  });
});

describe("a spring ignores a bad frame time", () => {
  it("keeps its value and still settles", () => {
    const s = createSpring(0);
    s.target = 1;
    s.step(1 / 60);
    const before = s.value;
    for (const dt of [Number.NaN, Number.POSITIVE_INFINITY, -1 / 60, 0]) expect(s.step(dt)).toBe(true);
    expect(s.value).toBe(before);
    let frames = 0;
    while (s.step(1 / 60) && frames < 1000) frames++;
    expect(s.value).toBe(1);
  });
});
