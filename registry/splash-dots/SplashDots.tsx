"use client";

import { sampleContours, springCss } from "@usefluid/motion";
import { useSequence } from "@usefluid/motion/react";
import { useMemo } from "react";
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

export function SplashDots({ logo, name, play = true }: { logo: string; name: string; play?: boolean }) {
  const step = useSequence(TIMES, play);
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
      <p className={styles.name}>
        <TextReveal text={name} play={step >= 3} stagger={36} />
      </p>
    </div>
  );
}
