import { describe, expect, it } from "vitest";
import { parsePath } from "../../packages/motion/src/index";
import { linePath, pointsOf } from "./line";

describe("pointsOf", () => {
  it("spreads points from edge to edge with the highest value near the top", () => {
    const pts = pointsOf([0, 5, 10], 10, 300, 120);
    expect(pts.map((p) => p.x)).toEqual([0, 150, 300]);
    expect(pts[2].y).toBeLessThan(pts[1].y);
    expect(pts[1].y).toBeLessThan(pts[0].y);
    expect(pts[0].y).toBeLessThanOrEqual(120);
    expect(pts[2].y).toBeGreaterThanOrEqual(0);
  });

  it("puts a single value in the middle", () => {
    expect(pointsOf([4], 10, 300, 120)[0].x).toBe(150);
  });
});

describe("linePath", () => {
  it("draws a smooth line through every point that the path parser accepts", () => {
    const pts = pointsOf([3, 8, 5, 12], 12, 300, 120);
    const d = linePath(pts);
    expect(() => parsePath(d)).not.toThrow();
    expect(d.startsWith(`M${pts[0].x} ${pts[0].y}`)).toBe(true);
    expect(d.endsWith(`${pts[3].x} ${pts[3].y}`)).toBe(true);
  });

  it("returns an empty path for no points", () => {
    expect(linePath([])).toBe("");
  });
});
