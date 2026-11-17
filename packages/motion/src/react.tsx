"use client";

import { type RefObject, type SVGProps, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { docsLink, warnOnce } from "./dev.ts";
import { type MorpherConfig, createMorpher } from "./morph.ts";
import { PathError, sampleContours } from "./path.ts";
import { type Spring, type SpringConfig, createSpring, springs } from "./spring.ts";
import { play } from "./ticker.ts";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribeMotion(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

const isReduced = () => typeof window !== "undefined" && window.matchMedia(QUERY).matches;

export function useSpring<K extends string>(
  target: Record<K, number>,
  apply: (value: Record<K, number>, velocity: Record<K, number>) => void,
  config: SpringConfig & { immediate?: boolean } = springs.snappy,
) {
  const applyRef = useRef(apply);
  useLayoutEffect(() => {
    applyRef.current = apply;
  });
  const store = useRef<Record<string, Spring> | null>(null);
  const stop = useRef<(() => void) | null>(null);
  const signature = Object.values<number>(target).join();

  useLayoutEffect(() => {
    const first = !store.current;
    store.current ??= {};
    const all = store.current;
    for (const key in target) all[key] ??= createSpring(target[key], config);

    const flush = () => {
      const value = {} as Record<K, number>;
      const velocity = {} as Record<K, number>;
      for (const key in target) {
        value[key] = all[key].value;
        velocity[key] = all[key].velocity;
      }
      applyRef.current(value, velocity);
    };

    stop.current?.();
    if (first || config.immediate || isReduced()) {
      for (const key in target) all[key].jump(target[key]);
      flush();
      return;
    }
    for (const key in target) {
      const s = createSpring(all[key].value, config);
      s.velocity = all[key].velocity;
      s.target = target[key];
      all[key] = s;
    }
    stop.current = play((dt) => {
      let moving = false;
      for (const key in target) if (all[key].step(dt)) moving = true;
      flush();
      return moving;
    });
  }, [signature]);

  useEffect(() => () => stop.current?.(), []);
}

export function MorphPath({
  d,
  config,
  onRest,
  ...props
}: Omit<SVGProps<SVGPathElement>, "d"> & {
  d: string;
  config?: MorpherConfig;
  onRest?(d: string): void;
}) {
  const el = useRef<SVGPathElement>(null);
  const morpher = useRef<ReturnType<typeof createMorpher> | null>(null);
  const stop = useRef<(() => void) | null>(null);
  const rest = useRef(onRest);
  useLayoutEffect(() => {
    rest.current = onRest;
  });
  const [first] = useState(d);
  const target = useRef(first);

  useLayoutEffect(() => {
    if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") checkBox(el.current, d);
  }, [d]);

  useLayoutEffect(() => {
    if (d === target.current && !stop.current) return;
    const reduced = isReduced();
    try {
      morpher.current ??= createMorpher(first, config);
      if (reduced) morpher.current.jump(d);
      else morpher.current.to(d);
    } catch (error) {
      if (!(error instanceof PathError)) throw error;
      warnOnce(error.code ?? "FLUID_PATH", error.message);
      return;
    }
    const m = morpher.current;
    target.current = d;
    stop.current?.();
    stop.current = null;
    if (reduced) {
      el.current?.setAttribute("d", d);
      rest.current?.(d);
      return;
    }
    stop.current = play((dt) => {
      const moving = m.step(dt);
      el.current?.setAttribute("d", m.path());
      if (!moving) {
        stop.current = null;
        rest.current?.(d);
      }
      return moving;
    });
  }, [d]);

  useEffect(() => () => stop.current?.(), []);

  return <path ref={el} d={first} fillRule="evenodd" {...props} />;
}

function checkBox(path: SVGPathElement | null, d: string) {
  const box = path?.ownerSVGElement?.viewBox?.baseVal;
  if (!box?.width || !box.height) return;
  let contours: ReturnType<typeof sampleContours>;
  try {
    contours = sampleContours(d);
  } catch {
    return;
  }
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  for (const c of contours) {
    for (let i = 0; i < c.x.length; i++) {
      minX = Math.min(minX, c.x[i]);
      maxX = Math.max(maxX, c.x[i]);
      minY = Math.min(minY, c.y[i]);
      maxY = Math.max(maxY, c.y[i]);
    }
  }
  const side = Math.max(box.width, box.height);
  const cornered = maxX - box.x < side * 0.3 && maxY - box.y < side * 0.3;
  const margin = side * 0.1;
  const outside = minX < box.x - margin || minY < box.y - margin || maxX > box.x + box.width + margin || maxY > box.y + box.height + margin;
  if (!cornered && !outside) return;
  const viewBox = `${box.x} ${box.y} ${box.width} ${box.height}`;
  warnOnce(
    "FLUID_BOX_MISMATCH",
    `FLUID_BOX_MISMATCH: a path given to MorphPath does not fit its svg viewBox "${viewBox}". Paths from icon sets usually use a 24 x 24 box: convert them once with scalePath(d, 24), keep viewBox="0 0 120 120", and they morph with the built-in shapes and your logo.\nMore: ${docsLink("FLUID_BOX_MISMATCH")}`,
  );
}

export function useSequence(times: number[], active = true) {
  const [step, setStep] = useState(0);
  const last = times.length - 1;
  const key = times.join();
  useEffect(() => {
    if (!active) return;
    if (isReduced()) {
      setStep(last);
      return;
    }
    setStep(0);
    let t = 0;
    let current = 0;
    return play((dt) => {
      t += dt;
      let next = current;
      while (next < last && t >= times[next + 1]) next++;
      if (next !== current) {
        current = next;
        setStep(next);
      }
      return current < last;
    });
  }, [key, active, last]);
  return step;
}

export function useSkip(enabled = true, initial = false) {
  const [skipped, setSkipped] = useState(initial);
  useEffect(() => {
    if (!enabled || skipped) return;
    const skip = () => setSkipped(true);
    addEventListener("keydown", skip);
    addEventListener("pointerdown", skip);
    return () => {
      removeEventListener("keydown", skip);
      removeEventListener("pointerdown", skip);
    };
  }, [enabled, skipped]);
  return skipped;
}

export function useInView(ref: RefObject<Element | null>, threshold = 0.35) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return seen;
}
