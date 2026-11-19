import { describe, expect, it } from "vitest";
import { levelOf } from "./grid";

describe("levelOf", () => {
  it("maps a value to one of five levels against the max", () => {
    expect([0, 1, 25, 50, 75, 100].map((v) => levelOf(v, 100))).toEqual([0, 1, 1, 2, 3, 4]);
  });

  it("never leaves the range", () => {
    expect(levelOf(-5, 10)).toBe(0);
    expect(levelOf(50, 10)).toBe(4);
    expect(levelOf(3, 0)).toBe(0);
  });
});
