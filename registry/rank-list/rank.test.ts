import { describe, expect, it } from "vitest";
import { rank, roundLike } from "./rank";

describe("rank", () => {
  it("orders by value, highest first", () => {
    const items = [
      { id: "a", label: "Ana", value: 3 },
      { id: "b", label: "Bia", value: 9 },
      { id: "c", label: "Caio", value: 5 },
    ];
    expect(rank(items).map((i) => i.id)).toEqual(["b", "c", "a"]);
  });

  it("keeps ties in the order they were given, so rows do not swap back and forth", () => {
    const items = [
      { id: "x", label: "Xu", value: 4 },
      { id: "y", label: "Yan", value: 4 },
    ];
    expect(rank(items).map((i) => i.id)).toEqual(["x", "y"]);
    expect(rank([...items].reverse()).map((i) => i.id)).toEqual(["y", "x"]);
  });

  it("orders lowest first when asked, and does not change the input", () => {
    const items = [
      { id: "a", label: "A", value: 2 },
      { id: "b", label: "B", value: 1 },
    ];
    expect(rank(items, "asc").map((i) => i.id)).toEqual(["b", "a"]);
    expect(items[0].id).toBe("a");
  });
});

describe("roundLike", () => {
  it("rounds a rolling number to the decimals of where it is going", () => {
    expect(roundLike(511.344, 540)).toBe(511);
    expect(roundLike(12.3456, 19.5)).toBe(12.3);
    expect(roundLike(0.12345, 0.25)).toBe(0.12);
  });
});
