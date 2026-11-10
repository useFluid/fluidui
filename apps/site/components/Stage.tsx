"use client";

import { useReducedMotion } from "@usefluid/motion/react";
import type { Brand } from "@usefluid/registry/brands.ts";
import { DemoProvider } from "@usefluid/registry/demo-context.tsx";
import { demos } from "@usefluid/registry/demos.tsx";
import { type CSSProperties, type RefObject, useEffect, useMemo, useRef, useState } from "react";
import { useBrand } from "./BrandProvider";
import styles from "./Stage.module.css";

type Props = {
  slug: string;
  loop?: number;
  className?: string;
  vars?: Record<string, string>;
  preview?: boolean;
  brand?: Brand;
  priority?: boolean;
};

const MAX = 3;
const TURN_MS = 5000;
type Slot = { el: HTMLElement; on: boolean; set(on: boolean): void };
const slots = new Set<Slot>();
let offset = 0;
let rotation: ReturnType<typeof setInterval> | undefined;

function distance(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return Math.abs(r.top + r.height / 2 - innerHeight / 2);
}

function deal() {
  const list = [...slots].sort((a, b) => distance(a.el) - distance(b.el));
  const chosen = new Set(list.length <= MAX ? list : Array.from({ length: MAX }, (_, i) => list[(offset + i) % list.length]));
  for (const slot of slots) {
    const on = chosen.has(slot);
    if (on !== slot.on) {
      slot.on = on;
      slot.set(on);
    }
  }
  if (list.length > MAX && !rotation) {
    rotation = setInterval(() => {
      offset += MAX;
      deal();
    }, TURN_MS);
  } else if (list.length <= MAX && rotation) {
    clearInterval(rotation);
    rotation = undefined;
    offset = 0;
  }
}

function useTurn(ref: RefObject<HTMLElement | null>, visible: boolean, always: boolean) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (always || !visible || !el) {
      setOn(always && visible);
      return;
    }
    const slot: Slot = { el, on: false, set: setOn };
    slots.add(slot);
    deal();
    return () => {
      slots.delete(slot);
      setOn(false);
      deal();
    };
  }, [ref, visible, always]);
  return on;
}

function useVisible(ref: RefObject<Element | null>) {
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const close = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNear(true);
        close.disconnect();
      }
    }, { rootMargin: "600px 0px" });
    const on = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    }, { threshold: 0.25 });
    close.observe(el);
    on.observe(el);
    return () => {
      close.disconnect();
      on.disconnect();
    };
  }, [ref]);
  return { near, visible };
}

export function Stage({ slug, loop, className, vars, preview, brand: fixed, priority = false }: Props) {
  const chosen = useBrand().brand;
  const brand = fixed ?? chosen;
  const root = useRef<HTMLDivElement>(null);
  const { near, visible } = useVisible(root);
  const turn = useTurn(root, visible, priority);
  const [seen, setSeen] = useState(false);
  if (turn && !seen) setSeen(true);
  const reduced = useReducedMotion();
  const [held, setHeld] = useState(false);
  const [take, setTake] = useState(0);
  const auto = turn && !held && !reduced;
  const Demo = demos[slug];

  useEffect(() => {
    if (!auto || !loop) return;
    const timer = setInterval(() => setTake((t) => t + 1), loop * 1000);
    return () => clearInterval(timer);
  }, [auto, loop]);

  const demo = useMemo(() => ({ name: brand.name, logo: brand.logo, play: seen, auto }), [brand, seen, auto]);

  return (
    <div
      ref={root}
      className={[styles.stage, className].filter(Boolean).join(" ")}
      style={{ ...brand.vars, ...vars } as CSSProperties}
      data-offscreen={turn || held ? undefined : ""}
      onPointerEnter={preview ? undefined : (e) => { if (e.pointerType === "mouse") setHeld(true); }}
      onPointerLeave={preview ? undefined : () => setHeld(false)}
      onFocus={preview ? undefined : () => setHeld(true)}
      onBlur={preview ? undefined : (e) => { if (!e.currentTarget.contains(e.relatedTarget)) setHeld(false); }}
    >
      <div className={styles.inner} inert={preview} aria-hidden={preview || undefined}>
        {near && (
          <DemoProvider value={demo}>
            <Demo key={`${take}-${loop ? brand.id : ""}`} />
          </DemoProvider>
        )}
      </div>
    </div>
  );
}
