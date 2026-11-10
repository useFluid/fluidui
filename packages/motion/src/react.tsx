"use client";

import {
  type RefObject,
  type SVGProps,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { type MorpherConfig, createMorpher } from "./morph.ts";
import { type Spring, type SpringConfig, createSpring, springs } from "./spring.ts";
import { play } from "./ticker.ts";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribeMotion(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribeMotion, () => window.matchMedia(QUERY).matches, () => false);
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
    const all = (store.current ??= {});
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

  useLayoutEffect(() => {
    morpher.current ??= createMorpher(first, config);
    const m = morpher.current;
    stop.current?.();
    if (isReduced()) {
      m.jump(d);
      el.current?.setAttribute("d", d);
      rest.current?.(d);
      return;
    }
    m.to(d);
    stop.current = play((dt) => {
      const moving = m.step(dt);
      el.current?.setAttribute("d", m.path());
      if (!moving) rest.current?.(d);
      return moving;
    });
  }, [d]);

  useEffect(() => () => stop.current?.(), []);

  return <path ref={el} d={first} fillRule="evenodd" {...props} />;
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
