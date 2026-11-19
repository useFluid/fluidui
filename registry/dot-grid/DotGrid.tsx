"use client";

import { useSpring } from "@usefluid/motion/react";
import { type CSSProperties, useRef } from "react";
import { levelOf } from "./grid";
import styles from "./DotGrid.module.css";

type Props = {
  label: string;
  values: number[];
  max?: number;
  rows?: number;
  summary?: string;
  color?: string;
};

function Cell({ level, wave }: { level: number; wave: number }) {
  const dot = useRef<HTMLSpanElement>(null);
  useSpring(
    { s: level / 4 },
    ({ s }) => {
      if (dot.current) dot.current.style.transform = `scale(${0.38 + Math.max(0, s) * 0.62})`;
    },
    { w: Math.max(8, 18 - wave * 0.45), z: 0.55 },
  );
  return <span ref={dot} className={styles.dot} data-level={level} />;
}

export function DotGrid({ label, values, max, rows = 7, summary, color }: Props) {
  const top = max ?? Math.max(1, ...values);
  return (
    <figure className={styles.root} style={color ? ({ "--fluid-accent": color } as CSSProperties) : undefined}>
      <div className={styles.grid} style={{ gridTemplateRows: `repeat(${rows}, auto)` }} role="img" aria-label={summary ? `${label}: ${summary}` : label}>
        {values.map((v, i) => (
          <Cell key={i} level={levelOf(v, top)} wave={Math.floor(i / rows) + (i % rows)} />
        ))}
      </div>
      <figcaption className={styles.caption}>
        <span>{label}</span>
        <span className={styles.scale} aria-hidden>
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} className={styles.dot} data-level={l} />
          ))}
        </span>
      </figcaption>
    </figure>
  );
}
