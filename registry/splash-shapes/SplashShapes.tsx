"use client";

import { shapes, springCss, springs } from "@usefluid/motion";
import { MorphPath, useSequence } from "@usefluid/motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { WordCycle } from "../word-cycle/WordCycle";
import { SpringButton } from "../spring-button/SpringButton";
import styles from "./SplashShapes.module.css";

const ROUTE = [shapes.dot, shapes.circle, shapes.triangle, shapes.flower, shapes.square, shapes.drop, shapes.capsule];
const BEAT = 0.36;
const LOGO_AT = ROUTE.length * BEAT;
const RISE_AT = LOGO_AT + 0.75;
const ACTION_AT = RISE_AT + 1.5;
const TIMES = [...ROUTE.map((_, i) => i * BEAT), LOGO_AT, RISE_AT, ACTION_AT];
const STEP_LOGO = ROUTE.length;
const STEP_RISE = STEP_LOGO + 1;
const STEP_ACTION = STEP_RISE + 1;

const rise = springCss(springs.soft);

type Props = {
  logo: string;
  title: string;
  words: string[];
  action: string;
  onAction?(): void;
  play?: boolean;
};

export function SplashShapes({ logo, title, words, action, onAction, play = true }: Props) {
  const step = useSequence(TIMES, play);
  const column = useRef<HTMLDivElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (!column.current || !slot.current) return;
      const c = column.current.offsetHeight / 2;
      setOffset(c - (slot.current.offsetTop + slot.current.offsetHeight / 2));
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (column.current) observer.observe(column.current);
    return () => observer.disconnect();
  }, []);

  const d = step >= STEP_LOGO ? logo : ROUTE[step];
  const stage = step >= STEP_ACTION ? "action" : step >= STEP_RISE ? "rise" : "shapes";

  return (
    <div className={styles.root} data-stage={stage}>
      <div ref={column} className={styles.column}>
        <div
          ref={slot}
          className={styles.slot}
          style={{
            transform: stage === "shapes" ? `translateY(${offset}px) scale(1.35)` : "none",
            transition: `transform ${rise.duration}ms ${rise.easing}`,
          }}
        >
          <svg viewBox="-8 -8 136 136" aria-hidden>
            <MorphPath d={d} fill="currentColor" config={{ w: 14, z: 0.74 }} />
          </svg>
        </div>
        <h2 className={styles.title}>
          <span className={styles.titleLine}>{title}</span>{" "}
          <span className={styles.words}>
            <WordCycle key={stage === "shapes" ? "wait" : "go"} words={words} every={0.5} loop={false} play={stage !== "shapes"} />
          </span>
        </h2>
        <div className={styles.action}>
          <SpringButton onClick={onAction} tabIndex={stage === "action" ? undefined : -1}>{action}</SpringButton>
        </div>
      </div>
    </div>
  );
}
