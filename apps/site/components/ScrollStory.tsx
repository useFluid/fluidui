"use client";

import { scalePath, shapes } from "@usefluid/motion";
import { MorphPath } from "@usefluid/motion/react";
import { areaPath } from "@usefluid/registry/area-morph/area.ts";
import { useEffect, useRef, useState } from "react";
import { useBrand } from "./BrandProvider";
import styles from "./ScrollStory.module.css";

export type StoryStep = { title: string; text: string };

const PLAY = scalePath("M6 3l14 9-14 9V3Z", 24);
const CHART = areaPath([22, 40, 34, 62, 54, 80, 72, 96], 100);

export function ScrollStory({ steps }: { steps: StoryStep[] }) {
  const { brand } = useBrand();
  const [active, setActive] = useState(0);
  const list = useRef<HTMLOListElement>(null);
  const shapesByStep = [shapes.circle, PLAY, brand.logo, CHART, shapes.pebble];
  const step = Math.min(active, shapesByStep.length - 1);

  useEffect(() => {
    const items = list.current?.querySelectorAll<HTMLElement>("[data-step]");
    if (!items?.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const item of items) io.observe(item);
    return () => io.disconnect();
  }, []);

  return (
    <div className={styles.story}>
      <div className={styles.sticky}>
        <div className={styles.stage} data-look={step} aria-hidden>
          {shapesByStep.map((_, i) => (
            <span key={i} className={styles.layer} data-look={i} data-on={i === step ? "" : undefined} />
          ))}
          <svg viewBox="0 0 120 120" className={styles.shape}>
            <MorphPath d={shapesByStep[step]} fill="currentColor" config={{ w: 11, z: 0.72, spread: 0.3 }} />
            <g className={styles.eyes} data-on={step === 4 ? "" : undefined}>
              <circle cx={48} cy={58} r={5} />
              <circle cx={72} cy={58} r={5} />
            </g>
          </svg>
          <span className={styles.count}>
            {String(step + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
          </span>
        </div>
      </div>
      <ol ref={list} className={styles.steps}>
        {steps.map((s, i) => (
          <li key={s.title} data-step={i} data-on={i === step ? "" : undefined} className={styles.step}>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
