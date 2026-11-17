import { describe, expect, it } from "vitest";
import { type Command, PathError, fitPath, parsePath, scalePath, shapes } from "../src/index";

const points = (d: string) => parsePath(d).flatMap((c: Command) => (c.c === "M" ? [c.x, c.y] : c.c === "C" ? [c.x1, c.y1, c.x2, c.y2, c.x, c.y] : []));

const close = (a: number[], b: number[]) => {
  expect(a.length).toBe(b.length);
  a.forEach((v, i) => expect(Math.abs(v - b[i])).toBeLessThan(0.01));
};

describe("scalePath", () => {
  it("maps a 24 box icon into the 120 box without fitting it", () => {
    const square = "M6 6H18V18H6Z";
    close(points(scalePath(square, 24)), points("M30 30H90V90H30Z"));
  });

  it("keeps an offset viewBox centred", () => {
    const dot = "M12 11.9L12.1 12L12 12.1L11.9 12Z";
    const scaled = points(scalePath(dot, "-2 -2 28 28"));
    const xs = scaled.filter((_, i) => i % 2 === 0);
    const ys = scaled.filter((_, i) => i % 2 === 1);
    expect(Math.abs((Math.min(...xs) + Math.max(...xs)) / 2 - 60)).toBeLessThan(0.01);
    expect(Math.abs((Math.min(...ys) + Math.max(...ys)) / 2 - 60)).toBeLessThan(0.01);
  });

  it("centres the shorter axis of a wide viewBox", () => {
    const middle = "M23.9 6L24.1 6L24.1 6.1L23.9 6.1Z";
    const scaled = points(scalePath(middle, "0 0 48 12"));
    const ys = scaled.filter((_, i) => i % 2 === 1);
    expect(Math.abs(Math.min(...ys) - 60)).toBeLessThan(0.3);
  });

  it("leaves a path already in the box unchanged", () => {
    close(points(scalePath(shapes.dot, 120)), points(shapes.dot));
  });

  it("refuses a broken viewBox", () => {
    for (const box of ["0 0 0 24", "a b c d", "0 0 24", -4]) {
      try {
        scalePath("M0 0L1 1Z", box as string);
        expect.unreachable();
      } catch (error) {
        expect(error).toBeInstanceOf(PathError);
        expect((error as PathError).code).toBe("FLUID_VIEWBOX");
      }
    }
  });
});

describe("path errors", () => {
  const codeOf = (run: () => unknown) => {
    try {
      run();
    } catch (error) {
      expect(error).toBeInstanceOf(PathError);
      expect((error as PathError).message).toContain("docs/troubleshooting#");
      return (error as PathError).code;
    }
    return "no error";
  };

  it("every path error has its own code and a link", () => {
    expect(codeOf(() => parsePath("L10 10"))).toBe("FLUID_PATH_START");
    expect(codeOf(() => parsePath("M10"))).toBe("FLUID_PATH_NUMBER");
    expect(codeOf(() => parsePath("M0 0a1 1 0 2 1 1 1"))).toBe("FLUID_PATH_FLAG");
    expect(codeOf(() => parsePath("M0 0B1 1"))).toBe("FLUID_PATH_COMMAND");
    expect(codeOf(() => parsePath("M0 0L1 1Z5"))).toBe("FLUID_PATH_CHARACTER");
    expect(codeOf(() => parsePath("M0 0Z"))).toBe("FLUID_PATH_EMPTY");
    expect(codeOf(() => fitPath("M5 5L5 5L5 5Z"))).toBe("FLUID_PATH_NO_SIZE");
  });
});
