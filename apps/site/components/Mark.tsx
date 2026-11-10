"use client";

import { play } from "@usefluid/motion";
import { useReducedMotion } from "@usefluid/motion/react";
import { useEffect, useRef } from "react";
import { MARK, waveMark } from "@/lib/logo";

const WAVE = 2.2;
const HOVER = 6;
const INTRO_S = 2.4;
let introDone = false;

export function Mark({ size = 28 }: { size?: number }) {
  const path = useRef<SVGPathElement>(null);
  const target = useRef(introDone ? 0 : WAVE);
  const wake = useRef<() => void>(() => {});
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      path.current?.setAttribute("d", MARK);
      return;
    }
    let t = 0;
    let amp = 0;
    let stop: (() => void) | null = null;
    const intro = setTimeout(() => {
      introDone = true;
      if (target.current === WAVE) target.current = 0;
    }, INTRO_S * 1000);
    const run = () => {
      if (stop) return;
      stop = play((dt) => {
        t += dt;
        amp += (target.current - amp) * Math.min(1, dt * 4);
        if (target.current === 0 && amp < 0.02) {
          path.current?.setAttribute("d", MARK);
          stop = null;
          return false;
        }
        path.current?.setAttribute("d", waveMark(t, amp));
      });
    };
    wake.current = run;
    run();
    return () => {
      clearTimeout(intro);
      stop?.();
    };
  }, [reduced]);

  return (
    <svg
      viewBox="-4 12 128 96"
      width={size}
      height={Math.round(size * 0.75)}
      aria-hidden
      overflow="visible"
      onPointerEnter={() => { target.current = HOVER; wake.current(); }}
      onPointerLeave={() => { target.current = 0; }}
    >
      <path ref={path} d={MARK} fill="currentColor" />
    </svg>
  );
}
