"use client";

import { useReducedMotion } from "@usefluid/motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import styles from "./LogoWipe.module.css";

const COVER_MS = 420;
const HOLD_MS = 240;
const LEAVE_MS = 460;

type Props = {
  logo: string;
  view: string;
  children: ReactNode;
};

export function LogoWipe({ logo, view, children }: Props) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(view);
  const [phase, setPhase] = useState<"idle" | "cover" | "leave">("idle");
  const held = useRef(children);
  if (view === shown) held.current = children;

  useEffect(() => {
    if (view === shown) return;
    if (reduced) {
      setShown(view);
      return;
    }
    setPhase("cover");
    const swap = setTimeout(() => setShown(view), COVER_MS);
    const leave = setTimeout(() => setPhase("leave"), COVER_MS + HOLD_MS);
    const done = setTimeout(() => setPhase("idle"), COVER_MS + HOLD_MS + LEAVE_MS);
    return () => {
      clearTimeout(swap);
      clearTimeout(leave);
      clearTimeout(done);
    };
  }, [view, reduced]);

  return (
    <div className={styles.root}>
      {view === shown ? children : held.current}
      {phase !== "idle" && (
        <div className={styles.curtain} data-phase={phase} aria-hidden>
          <svg viewBox="0 0 120 120" className={styles.logo}>
            <path d={logo} fillRule="evenodd" fill="currentColor" />
          </svg>
        </div>
      )}
    </div>
  );
}
