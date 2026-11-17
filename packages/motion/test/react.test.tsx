import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

GlobalRegistrator.register();

const { act, cleanup, render } = await import("@testing-library/react");
const { MorphPath } = await import("../src/react");
const { scalePath, shapes } = await import("../src/index");
const { brands } = await import("../../../registry/brands");

const LUCIDE_CIRCLE = "M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20Z";
const LUCIDE_SQUARE = "M4 4h16v16H4z";
const LOGO = brands[0].logo;

let frames: FrameRequestCallback[] = [];
let clock = 0;
let reduced = false;

const flush = (ms = 2000) => {
  for (let t = 0; t < ms; t += 16) {
    clock += 16;
    const run = frames;
    frames = [];
    for (const f of run) f(clock);
  }
};

beforeAll(() => {
  globalThis.requestAnimationFrame = (f) => {
    frames.push(f);
    return frames.length;
  };
  globalThis.cancelAnimationFrame = () => {};
  vi.spyOn(performance, "now").mockImplementation(() => clock);
  window.matchMedia = ((query: string) => ({
    matches: reduced && query.includes("reduce"),
    media: query,
    addEventListener() {},
    removeEventListener() {},
  })) as unknown as typeof window.matchMedia;
});

afterAll(async () => {
  await GlobalRegistrator.unregister();
});

let warn: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  reduced = false;
});
afterEach(() => {
  cleanup();
  warn.mockRestore();
});

const inBox = (d: string, box = "0 0 120 120") => (
  <svg viewBox={box}>
    <MorphPath d={d} fill="currentColor" />
  </svg>
);

const drawn = (container: HTMLElement) => container.querySelector("path")?.getAttribute("d") ?? "";

describe("MorphPath", () => {
  it("keeps the last shape when d is not a path", () => {
    const { container, rerender } = render(inBox(shapes.circle));
    expect(() => {
      rerender(inBox("hello"));
      act(() => flush());
    }).not.toThrow();
    expect(drawn(container)).toBe(shapes.circle);
    rerender(inBox(""));
    act(() => flush());
    expect(drawn(container)).toBe(shapes.circle);
  });

  it("warns once when a 24 box icon sits in a 120 box", () => {
    const { rerender } = render(inBox(shapes.circle));
    rerender(inBox(LUCIDE_CIRCLE));
    act(() => flush());
    rerender(inBox(LUCIDE_SQUARE));
    act(() => flush());
    const box = warn.mock.calls.filter((c: unknown[]) => String(c[0]).includes("FLUID_BOX_MISMATCH"));
    expect(box.length).toBe(1);
    expect(String(box[0][0])).toContain("scalePath");
  });

  it("stays quiet for a dot that grows into a logo", () => {
    const { rerender } = render(inBox(shapes.dot));
    rerender(inBox(LOGO));
    act(() => flush());
    expect(warn).not.toHaveBeenCalled();
  });

  it("stays quiet for an icon converted with scalePath", () => {
    const { rerender } = render(inBox(shapes.circle));
    rerender(inBox(scalePath(LUCIDE_CIRCLE, 24)));
    act(() => flush());
    expect(warn).not.toHaveBeenCalled();
  });

  it("does not warn without a viewBox", () => {
    const { rerender } = render(
      <svg>
        <MorphPath d={shapes.circle} />
      </svg>,
    );
    rerender(
      <svg>
        <MorphPath d={LUCIDE_CIRCLE} />
      </svg>,
    );
    act(() => flush());
    expect(warn).not.toHaveBeenCalled();
  });

  it("lands on the target at once with reduced motion", () => {
    reduced = true;
    const { container, rerender } = render(inBox(shapes.circle));
    rerender(inBox(shapes.flower));
    expect(drawn(container)).toBe(shapes.flower);
  });

  it("shows the first valid shape after an invalid first d", () => {
    const { container, rerender } = render(inBox(""));
    rerender(inBox(shapes.circle));
    act(() => flush());
    expect(drawn(container)).toBe(shapes.circle);
    rerender(inBox(shapes.flower));
    act(() => flush());
    expect(drawn(container)).toBe(shapes.flower);
  });

  it("stays quiet for a menu drawn in the corner of a wide box", () => {
    const closed = "M0 24a24 24 0 1 1 48 0a24 24 0 1 1-48 0Z";
    const bars = "M8 10h27v3H8zM8 20h27v3H8zM8 30h27v3H8z";
    const { rerender } = render(inBox(closed, "0 0 320 240"));
    rerender(inBox(bars, "0 0 320 240"));
    act(() => flush());
    expect(warn).not.toHaveBeenCalled();
  });
});
