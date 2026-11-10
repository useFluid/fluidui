"use client";

import { play } from "@usefluid/motion";
import { useReducedMotion } from "@usefluid/motion/react";
import { useEffect, useRef, useState } from "react";
import { MARK, waveMark } from "@/lib/logo";

const REST = 2.4;
const MAX = 4.2;

export function BigMark({ className, label }: { className?: string; label?: string }) {
  const path = useRef<SVGPathElement>(null);
  const reduced = useReducedMotion();

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = path.current?.ownerSVGElement;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || !visible) {
      if (reduced) path.current?.setAttribute("d", MARK);
      return;
    }
    let t = 0;
    let amp = REST;
    let energy = 0;
    let last: { x: number; y: number } | null = null;
    const onMove = (e: PointerEvent) => {
      if (last) energy = Math.min(MAX - REST, energy + Math.hypot(e.clientX - last.x, e.clientY - last.y) * 0.02);
      last = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    const stop = play((dt) => {
      t += dt;
      energy *= Math.exp(-dt * 1.6);
      amp += (REST + energy - amp) * Math.min(1, dt * 5);
      path.current?.setAttribute("d", waveMark(t, amp));
    });
    return () => {
      stop();
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced, visible]);

  return (
    <svg
      viewBox="-8 4 136 112"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      overflow="visible"
    >
      <path ref={path} d={MARK} fill="currentColor" />
    </svg>
  );
}
