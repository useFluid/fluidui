import { describe, expect, it } from "vitest";
import { monthGrid, moveDate, sameDay } from "./calendar";

describe("monthGrid", () => {
  it("fills six full weeks that start on the chosen weekday", () => {
    const cells = monthGrid(2026, 10, 1);
    expect(cells).toHaveLength(42);
    expect(cells[0].date.getDay()).toBe(1);
    expect(cells.filter((c) => c.inMonth)).toHaveLength(30);
    expect(cells.find((c) => c.inMonth)?.date.getDate()).toBe(1);
  });

  it("starts on Sunday when asked", () => {
    const cells = monthGrid(2026, 1, 0);
    expect(cells[0].date.getDay()).toBe(0);
    expect(cells[0].inMonth).toBe(true);
  });
});

describe("moveDate", () => {
  const day = new Date(2026, 0, 31);
  it("moves by day, week and month like a date grid", () => {
    expect(sameDay(moveDate(day, "ArrowRight", 1), new Date(2026, 1, 1))).toBe(true);
    expect(sameDay(moveDate(day, "ArrowUp", 1), new Date(2026, 0, 24))).toBe(true);
    expect(sameDay(moveDate(day, "PageDown", 1), new Date(2026, 1, 28))).toBe(true);
    expect(sameDay(moveDate(new Date(2026, 10, 18), "Home", 1), new Date(2026, 10, 16))).toBe(true);
    expect(sameDay(moveDate(new Date(2026, 10, 18), "End", 1), new Date(2026, 10, 22))).toBe(true);
  });

  it("returns null for keys it does not handle", () => {
    expect(moveDate(day, "a", 1)).toBeNull();
  });
});
