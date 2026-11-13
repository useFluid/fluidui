"use client";

import { shapes, springCss, springs } from "@usefluid/motion";
import { MorphPath, useSequence, useSkip } from "@usefluid/motion/react";
import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { SpringButton } from "../spring-button/SpringButton";
import { WordCycle } from "../word-cycle/WordCycle";
import styles from "./SplashShapes.module.css";

const DEFAULT_ROUTE = [shapes.dot, shapes.circle, shapes.triangle, shapes.flower, shapes.square, shapes.drop, shapes.capsule];
const BEAT = 0.36;
const rise = springCss(springs.soft);

type Props = {
  logo: string;
  title: string;
  words: string[];
  action?: string;
  onAction?(): void;
  children?: ReactNode;
  route?: string[];
  as?: "h1" | "h2";
  play?: boolean;
  finished?: boolean;
  skippable?: boolean;
  onDone?(): void;
};

export function SplashShapes({
  logo,
  title,
  words,
  action,
  onAction,
  children,
  route = DEFAULT_ROUTE,
  as: Heading = "h2",
  play = true,
  finished = false,
  skippable = true,
  onDone,
}: Props) {
  const logoAt = route.length * BEAT;
  const times = [...route.map((_, i) => i * BEAT), logoAt, logoAt + 0.75, logoAt + 1.5];
  const stepLogo = route.length;
  const last = times.length - 1;
  const skipped = useSkip(play && skippable, finished);
  const live = useSequence(times, play && !skipped);
  const step = skipped ? last : live;
  const done = useRef(onDone);
  useLayoutEffect(() => {
    done.current = onDone;
  });
  const column = useRef<HTMLDivElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [placed, setPlaced] = useState(false);

  useLayoutEffect(() => {
    const measure = () => {
      if (!column.current || !slot.current) return;
      setOffset(column.current.offsetHeight / 2 - (slot.current.offsetTop + slot.current.offsetHeight / 2));
    };
    measure();
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setPlaced(true));
    });
    const observer = new ResizeObserver(measure);
    if (column.current) observer.observe(column.current);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (step === last) done.current?.();
  }, [step, last]);

  const d = step >= stepLogo ? logo : route[step];
  const stage = step >= last ? "action" : step >= stepLogo + 1 ? "rise" : "shapes";

  return (
    <div className={styles.root} data-stage={stage}>
      <div ref={column} className={styles.column}>
        <div
          ref={slot}
          className={styles.slot}
          style={{
            transform: stage === "shapes" ? `translateY(${offset}px) scale(1.35)` : "none",
            ...(placed ? rise.transition("transform") : { transitionProperty: "none" }),
          }}
        >
          <svg viewBox="-8 -8 136 136" aria-hidden>
            <MorphPath d={d} fill="currentColor" config={{ w: 14, z: 0.74 }} />
          </svg>
        </div>
        <Heading className={styles.title}>
          <span className={styles.titleLine}>{title}</span>{" "}
          <span className={styles.words}>
            <WordCycle
              key={stage === "shapes" ? "wait" : skipped ? "end" : "go"}
              words={skipped ? words.slice(-1) : words}
              every={0.5}
              loop={false}
              play={stage !== "shapes" && !skipped}
            />
          </span>
        </Heading>
        <div className={styles.action} inert={stage !== "action"}>
          {children ?? (action ? <SpringButton onClick={onAction}>{action}</SpringButton> : null)}
        </div>
      </div>
    </div>
  );
}
