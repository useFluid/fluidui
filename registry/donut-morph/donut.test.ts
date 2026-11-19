import { describe, expect, it } from "vitest";
import { slices } from "./donut";

describe("slices", () => {
  it("turns values into shares that start where the last one ended", () => {
    const s = slices([1, 1, 2]);
    expect(s.map((x) => x.share)).toEqual([0.25, 0.25, 0.5]);
    expect(s.map((x) => x.start)).toEqual([0, 0.25, 0.5]);
  });

  it("treats negative values as zero and an empty total as all zeros", () => {
    expect(slices([-3, 1]).map((x) => x.share)).toEqual([0, 1]);
    expect(slices([0, 0]).map((x) => x.share)).toEqual([0, 0]);
  });
});
