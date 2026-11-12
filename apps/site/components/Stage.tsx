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

const IDLE_MS = 4000;

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
  const [seen, setSeen] = useState(false);
  if (visible && !seen) setSeen(true);
  const reduced = useReducedMotion();
  const [held, setHeld] = useState(false);
  const idle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [take, setTake] = useState(0);
  const auto = (visible || priority) && !held && !reduced;

  const touch = () => {
    setHeld(true);
    clearTimeout(idle.current);
    idle.current = setTimeout(() => setHeld(false), IDLE_MS);
  };

  useEffect(() => () => clearTimeout(idle.current), []);
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
      data-stage={slug}
      data-offscreen={visible ? undefined : ""}
      onPointerDown={preview ? undefined : touch}
      onKeyDown={preview ? undefined : touch}
      onInput={preview ? undefined : touch}
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
