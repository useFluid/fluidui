"use client";

import { sampleContours, springCss } from "@usefluid/motion";
import { useSequence, useSkip } from "@usefluid/motion/react";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { TextReveal } from "../text-reveal/TextReveal";
import styles from "./SplashDots.module.css";

const TIMES = [0, 0.08, 1.7, 2.1];
const fly = springCss({ w: 11, z: 0.7 });

function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

type Props = {
  logo: string;
  name: string;
  as?: "h1" | "h2" | "p";
  play?: boolean;
  finished?: boolean;
  skippable?: boolean;
  onDone?(): void;
};

export function SplashDots({ logo, name, as: Name = "p", play = true, finished = false, skippable = true, onDone }: Props) {
  const last = TIMES.length - 1;
  const skipped = useSkip(play && skippable, finished);
  const live = useSequence(TIMES, play && !skipped);
  const step = skipped ? last : live;
  const done = useRef(onDone);
  useLayoutEffect(() => {
    done.current = onDone;
  });
  useEffect(() => {
    if (step === last) done.current?.();
  }, [step, last]);
  const dots = useMemo(() => {
    const random = seeded(7);
    return sampleContours(logo, 40).flatMap((c) =>
      Array.from(c.x, (x, i) => ({ x, y: c.y[i], sx: random() * 180 - 30, sy: random() * 180 - 30, delay: random() * 380 })),
    );
  }, [logo]);

  return (
    <div className={styles.root} data-step={step}>
      <svg viewBox="-10 -10 140 140" className={styles.logo} aria-hidden>
        <path d={logo} fillRule="evenodd" className={styles.fill} />
        {dots.map((dot, i) => (
          <circle
            key={i}
            r={1.7}
            className={styles.dot}
            style={{
              transform: step === 0 ? `translate(${dot.sx}px, ${dot.sy}px)` : `translate(${dot.x}px, ${dot.y}px)`,
              transition: `transform ${fly.duration}ms ${fly.easing} ${dot.delay}ms, opacity 300ms ease`,
            }}
          />
        ))}
      </svg>
      <Name className={styles.name}>
        {skipped ? name : <TextReveal text={name} play={step >= last} stagger={36} />}
      </Name>
    </div>
  );
}
