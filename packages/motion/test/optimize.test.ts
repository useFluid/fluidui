import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createMorpher, parsePath, sampleContours, springs } from "../src/index";
import { LOGO, runScenarios } from "./morph-reference";

const reference: Record<string, number[][]> = JSON.parse(readFileSync(new URL("./fixtures/morph-reference.json", import.meta.url), "utf8"));

describe("optimized engine", () => {
  it("matches the recorded reference for every point at irregular frame times", () => {
    const now = runScenarios();
    for (const name of Object.keys(reference)) {
      expect(now[name].length).toBe(reference[name].length);
      reference[name].forEach((frame, f) => {
        expect(now[name][f].length).toBe(frame.length);
        let worst = 0;
        for (let i = 0; i < frame.length; i++) worst = Math.max(worst, Math.abs(now[name][f][i] - frame[i]));
        expect(worst, `${name}, frame ${f}`).toBeLessThan(0.011);
      });
    }
  });

  it("returns the same contours for the same path twice, and callers cannot corrupt them", () => {
    const first = sampleContours(LOGO, 160);
    const copy = first.map((c) => ({ x: Array.from(c.x), y: Array.from(c.y), area: c.area }));
    first[0].x.fill(0);
    first[0].y.fill(0);
    const second = sampleContours(LOGO, 160);
    expect(second.length).toBe(copy.length);
    second.forEach((c, i) => {
      expect(Array.from(c.x)).toEqual(copy[i].x);
      expect(Array.from(c.y)).toEqual(copy[i].y);
      expect(c.area).toBe(copy[i].area);
    });
  });

  it("writes negative coordinates and small values correctly while moving", () => {
    const from = "M-40 -40L-20 -40L-20 -20L-40 -20Z";
    const to = "M-0.004 -0.5L0.5 -0.5L0.5 0.5L-0.004 0.5Z";
    const m = createMorpher(from, springs.soft);
    m.to(to);
    m.step(1 / 60);
    const d = m.path();
    expect(() => parsePath(d)).not.toThrow();
    expect(d).toMatch(/^M-\d+\.\d\d -\d+\.\d\d/);
    expect(d).not.toMatch(/--|\.\d{3}|NaN|Infinity/);
    for (let i = 0; i < 600; i++) m.step(1 / 60);
    expect(m.path()).toBe(to);
  });
});
