import { describe, expect, it } from "vitest";
import { parsePath, sampleContours } from "../../packages/motion/src/index";
import { areaPath } from "./area";

describe("areaPath", () => {
  it("draws one closed shape that fills the 120 box from edge to edge", () => {
    const d = areaPath([3, 8, 5, 12, 9], 12);
    expect(() => parsePath(d)).not.toThrow();
    const [c] = sampleContours(d);
    expect(sampleContours(d)).toHaveLength(1);
    expect(Math.min(...c.x)).toBeCloseTo(0, 1);
    expect(Math.max(...c.x)).toBeCloseTo(120, 1);
    expect(Math.max(...c.y)).toBeCloseTo(120, 1);
  });

  it("puts the highest value near the top and keeps a floor for zeros", () => {
    const [c] = sampleContours(areaPath([0, 10, 0], 10));
    expect(Math.min(...c.y)).toBeLessThan(20);
    expect(Math.min(...c.y)).toBeGreaterThanOrEqual(0);
    const [flat] = sampleContours(areaPath([0, 0, 0], 10));
    expect(Math.min(...flat.y)).toBeLessThan(120);
  });

  it("handles a single value and an empty list", () => {
    expect(() => sampleContours(areaPath([4], 10))).not.toThrow();
    expect(() => sampleContours(areaPath([], 10))).not.toThrow();
  });
});
